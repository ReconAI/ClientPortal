"""
Reporting tool filters set
"""
from typing import Any, Optional

from django.db.models import QuerySet, Q
from django_filters import rest_framework as filters

from recon_db_manager.models import RelevantData
from shared.fields import CharRangeField
from shared.filters import FilterSet, CharFilter, DateTimeFromToRangeFilter, \
    NumericRangeFilter, BooleanFilter, GPSFilter, NumberFilter, FilterMixin
from shared.forms import NegativeFiltersForm


class EventObjectFilter(FilterMixin, filters.ChoiceFilter):
    """
    Event/Object relevant data filter
    """

    EVENT_TYPE = 'event'
    OBJECT_TYPE = 'object'

    def filter(self, queryset: QuerySet, value: Any) -> Optional[Q]:
        return super().filter(
            queryset,
            value != self.EVENT_TYPE if value else value
        )


class IsTaggedFilter(BooleanFilter):
    """
    Is tagged filter logic.
    Null and False should be considered as False.
    """
    def filter(self, queryset: QuerySet, value: Any) -> Optional[Q]:
        q = super().filter(queryset, value)

        if value is False:
            return Q(
                **{'{}__{}'.format(self.field_name, self.lookup_expr): True},
                _negated=True
            )

        return q


class MultipleTypeCodeFilter(FilterMixin, filters.CharFilter):
    """
    Multiple options filter for relevant type code
    """
    field_class = CharRangeField


class RelevantDataSensorFilter(FilterSet):
    """
    Full set of filters for the relevant data page apart from sensor id
    """
    project_name = CharFilter(
        field_name="project__name", lookup_expr='exact', strip=False
    )
    license_plate_number = CharFilter(
        field_name="license_plate_number", lookup_expr='exact', strip=False
    )
    timestamp = DateTimeFromToRangeFilter(
        field_name="timestamp", lookup_expr='range'
    )
    orient_theta = NumericRangeFilter(
        field_name="orient_theta", lookup_expr='range'
    )
    orient_phi = NumericRangeFilter(
        field_name="orient_phi", lookup_expr='range'
    )
    road_temperature = NumericRangeFilter(
        field_name="road_temperature", lookup_expr='range'
    )
    ambient_temperature = NumericRangeFilter(
        field_name="ambient_temperature", lookup_expr='range'
    )
    is_tagged = IsTaggedFilter(
        field_name='is_tagged_data', lookup_expr='exact'
    )
    vehicle_type = CharFilter(
        field_name='vehicle_classification', lookup_expr='exact', strip=False
    )
    object_class = MultipleTypeCodeFilter(
        field_name='object_class', lookup_expr='in', strip=False
    )
    road_weather_condition = CharFilter(
        field_name='road_weather_condition', lookup_expr='exact', strip=False
    )
    gps = GPSFilter(
        lat_field_name='sensor_GPS_lat', long_field_name='sensor_GPS_long'
    )
    pedestrian_transit_method = CharFilter(
        field_name='pedestrian_flow__TransitMethod', lookup_expr='exact',
        strip=False
    )
    event_object = EventObjectFilter(
        field_name='event', lookup_expr='isnull',
        choices=(
            (EventObjectFilter.EVENT_TYPE, EventObjectFilter.EVENT_TYPE),
            (EventObjectFilter.OBJECT_TYPE, EventObjectFilter.OBJECT_TYPE)
        )
    )

    class Meta:
        """
        RelevantDataSensorFilter specification
        """
        model = RelevantData
        fields = (
            'project_name', 'timestamp', 'orient_theta', 'orient_phi',
            'is_tagged', 'vehicle_type', 'event_object', 'object_class',
            'road_temperature', 'ambient_temperature',
            'road_weather_condition', 'license_plate_number', 'gps',
            'pedestrian_transit_method'
        )
        form = NegativeFiltersForm


class RelevantDataFilter(RelevantDataSensorFilter):
    """
    Full set of filters for the relevant data page
    """
    sensor_id = NumberFilter(field_name="device_instance", lookup_expr='exact')

    class Meta:
        """
        RelevantDataFilter specification
        """
        model = RelevantData
        fields = (
            'sensor_id', 'project_name', 'timestamp', 'orient_theta',
            'orient_phi', 'is_tagged', 'vehicle_type', 'event_object',
            'road_temperature', 'ambient_temperature',
            'road_weather_condition', 'license_plate_number'
        )
        form = NegativeFiltersForm


class ProjectFilter(filters.FilterSet):
    """
    Filtering data by project name
    """
    name = filters.CharFilter(field_name='project__name',
                              lookup_expr='istartswith')

    class Meta:
        """
        Project name is sole filter
        """
        model = RelevantData
        fields = ('name', )


class LicensePlateFilter(filters.FilterSet):
    """
    Relevant data filtering by license plates
    """
    license_plate = filters.CharFilter(field_name='license_plate_number',
                                       lookup_expr='istartswith')

    class Meta:
        """
        Filters by license plate
        """
        model = RelevantData
        fields = ('license_plate',)


class ExportRelevantDataFilterBackend(filters.DjangoFilterBackend):
    """
    Query backend retrieving query params from view object
    rather than request object
    """

    def get_filterset_kwargs(self, request, queryset, view):
        return {
            'data': getattr(view, 'query_params', {}),
            'queryset': queryset,
            'request': request,
        }
