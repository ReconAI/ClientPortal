from abc import abstractmethod
from typing import Any, Dict, Optional, List

from dateutil.parser import parse, ParserError
from django import forms
from django.db.models import Q, QuerySet
from django.forms import Form
from django.utils.translation import gettext_lazy as _
from django_filters import rest_framework as filters
from django_filters.constants import EMPTY_VALUES
from rest_framework.exceptions import ValidationError

from recon_db_manager.models import RelevantData


class FilterMixin:
    def filter(self, qs, value):
        if value not in EMPTY_VALUES:
            lookup = '%s__%s' % (self.field_name, self.lookup_expr)

            return Q(**{lookup: value})

        return None


class NumberFilter(FilterMixin, filters.NumberFilter):
    pass


class CharFilter(FilterMixin, filters.CharFilter):
    pass


class RangeField(forms.CharField):
    CHUNKS_NUMBER = 2
    SEPARATOR = ';'
    
    default_error_messages = {
        'format_error': _('Value should consist of '
                          '{} argument(s) separated by '
                          '{}'.format(CHUNKS_NUMBER, SEPARATOR))
    }

    def clean(self, value: str):
        if value is None:
            return value

        result = [
            self._prepare(item)
            for item
            in value.split(';')
        ]

        if result and len(result) != self.CHUNKS_NUMBER:
            raise ValidationError(
                self.default_error_messages.get('format_error')
            )

        return result
    
    @abstractmethod
    def _prepare(self, item: str) -> Any:
        pass


class DateTimeRangeField(RangeField):
    def _prepare(self, item: str) -> Any:
        try:
            return parse(item)
        except ParserError as e:
            raise ValidationError(e, code='format_error')


class FloatRangeField(RangeField):
    def _prepare(self, item: str) -> Any:
        return float(item)


class DateTimeFromToRangeFilter(FilterMixin, filters.DateTimeFromToRangeFilter):
    field_class = DateTimeRangeField


class NumericRangeFilter(FilterMixin, filters.NumericRangeFilter):
    field_class = FloatRangeField


class RelevantDataFilersForm(Form):
    def __init__(self, data=None, *args, **kwargs):
        self.negated_fields = set()

        normalized_data = self.__normalize_negated(data)

        super().__init__(data=normalized_data, *args, **kwargs)

    def __normalize_negated(self,
                            data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        if data:
            normalized = {}

            for data_key, data_value in data.items():
                if data_key.startswith('-'):
                    data_key = data_key[1:]
                    self.negated_fields.add(data_key)

                normalized[data_key] = data_value

            return normalized

        return data


class RelevantDataFilter(filters.FilterSet):
    id = NumberFilter(field_name="id", lookup_expr='exact')
    project_name = CharFilter(field_name="project__name", lookup_expr='exact')
    timestamp = DateTimeFromToRangeFilter(field_name="timestamp", lookup_expr='range')
    orient_theta = NumericRangeFilter(field_name="orient_theta", lookup_expr='range')
    orient_phi = NumericRangeFilter(field_name="orient_phi", lookup_expr='range')

    logical_and = filters.BooleanFilter()

    LOGICAL_AND = True
    LOGICAL_AND_FIELD_NAME = 'logical_and'

    class Meta:
        model = RelevantData
        fields = ['id', 'project_name']
        form = RelevantDataFilersForm
        # fields = ['category', 'in_stock', 'min_price', 'max_price']

    def filter_queryset(self, queryset):
        filters_set = []

        for name, value in self.__cleand_data.items():
            condition = self.filters[name].filter(queryset, value)

            if not condition:
                continue

            assert isinstance(condition, Q), \
                "Expected '%s.%s' to return a Q, but got a %s instead." \
                % (type(self).__name__, name, type(condition).__name__)

            if name in self.form.negated_fields:
                filters_set.append(~condition)
                continue

            filters_set.append(condition)

        return self.__apply_filterset(queryset, filters_set)

    @property
    def __cleand_data(self):
        cleaned_data = self.form.cleaned_data

        return {
            key: value
            for key, value
            in cleaned_data.items()
            if key != self.LOGICAL_AND_FIELD_NAME
        }

    def __apply_filterset(self,
                          queryset: QuerySet, filter_set: List) -> QuerySet:
        if filter_set:
            conditions = filter_set.pop()

            while filter_set:
                conditions = self.__apply_filter(conditions, filter_set.pop())

            return queryset.filter(conditions)

        return queryset

    def __apply_filter(self, conditions, condition):
        if self.__logical_and_to_apply():
            return conditions & condition

        return conditions | condition

    def __logical_and_to_apply(self) -> bool:
        logical_and = self.form.cleaned_data.get('logical_and')

        if logical_and is None:
            return self.LOGICAL_AND

        return logical_and
