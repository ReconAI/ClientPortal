from typing import List, Optional, Any

from django.db.models import Q, QuerySet
from django_filters import rest_framework as filters
from django_filters.constants import EMPTY_VALUES

from shared.fields import DateTimeRangeField, FloatRangeField, GPSRangeField


class FilterMixin:
    """
    Filter mixin return Q object rather than query sets with filters applied
    """

    def filter(self, qs: QuerySet, value: Any) -> Optional[Q]:
        """
        :type qs: QuerySet
        :type value: Any

        :rtype: Optional[Q]
        """
        if value not in EMPTY_VALUES:
            lookup = '%s__%s' % (self.field_name, self.lookup_expr)

            return Q(**{lookup: value})

        return None


class NumberFilter(FilterMixin, filters.NumberFilter):
    pass


class CharFilter(FilterMixin, filters.CharFilter):
    pass


class BooleanFilter(FilterMixin, filters.BooleanFilter):
    pass


class DateTimeFromToRangeFilter(FilterMixin, filters.DateTimeFromToRangeFilter):
    field_class = DateTimeRangeField


class NumericRangeFilter(FilterMixin, filters.NumericRangeFilter):
    field_class = FloatRangeField


class GPSFilter(FilterMixin, filters.NumberFilter):
    field_class = GPSRangeField

    def __init__(self, lat_field_name: str, long_field_name:str, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.__lat_field_name = lat_field_name
        self.__long_field_name = long_field_name

    def filter(self, qs, value):
        if value not in EMPTY_VALUES:
            return Q(**dict(zip(self.filter_expr, value)))

        return None

    @property
    def filter_expr(self) -> list:
        return [
            '{}__{}'.format(self.__lat_field_name, 'lte'),
            '{}__{}'.format(self.__long_field_name, 'gte'),
            '{}__{}'.format(self.__lat_field_name, 'gte'),
            '{}__{}'.format(self.__long_field_name, 'lte')
        ]


class FilterSet(filters.FilterSet):
    logical_and = filters.BooleanFilter()

    LOGICAL_AND = True
    LOGICAL_AND_FIELD_NAME = 'logical_and'

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

    def __apply_filterset(self, queryset: QuerySet,
                          filter_set: List) -> QuerySet:
        if filter_set:
            conditions = filter_set.pop()

            while filter_set:
                conditions = self.__apply_filter(conditions, filter_set.pop())

            return queryset.filter(conditions)

        return queryset

    def __apply_filter(self, conditions: Q, condition: Q) -> Q:
        if self.__logical_and_to_apply():
            return conditions & condition

        return conditions | condition

    def __logical_and_to_apply(self) -> bool:
        logical_and = self.form.cleaned_data.get('logical_and')

        if logical_and is None:
            return self.LOGICAL_AND

        return logical_and
