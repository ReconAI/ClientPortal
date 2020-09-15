"""
Relevant data views set
"""

from django.contrib.postgres.fields.jsonb import KeyTextTransform
from django.db import models
from django.db.models import QuerySet, Sum
from django.db.models.functions import Cast
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django_filters import rest_framework as filters
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.exceptions import NotFound
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from recon_db_manager.models import RelevantData, TypeCode
from reporting_tool.filters import RelevantDataFilter, \
    RelevantDataSensorFilter, ProjectFilter, LicensePlateFilter
from reporting_tool.serializers import RelevantDataSerializer, \
    TypeCodeSerializer, HeatMapSerializer, RelevantDataGPSSerializer
from shared.permissions import IsActive, PaymentRequired
from shared.swagger.headers import token_header
from shared.swagger.responses import \
    default_get_responses_with_custom_success, data_serializer, \
    data_serializer_many, http200
from shared.views.utils import PlainListModelMixin


class RelevantDataHandler:
    """
    Relevant data preset
    """
    permission_classes = (IsAuthenticated, IsActive, PaymentRequired)

    queryset = RelevantData.objects.select_related(
        'project'
    ).prefetch_related(
        'event', 'object_class', 'tagged_data', 'license_plate',
        'face', 'cad_file_tag', 'ambient_weather_condition',
        'road_weather_condition', 'vehicle_classification'
    ).order_by('-timestamp', '-id').all()

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
        """
        :type queryset: QuerySet

        :rtype: QuerySet
        """
        queryset = queryset.filter(
            project__organization_id=self.request.user.organization.id
        )

        return super().filter_queryset(queryset)


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=default_get_responses_with_custom_success(
        data_serializer(RelevantDataSerializer)
    ),
    tags=['Relevant data'],
    operation_summary='Relevant data list',
    operation_description='Relevant data list view',
    manual_parameters=[
        token_header(),
    ]
))
class RelevantDataView(RelevantDataHandler, ListAPIView):
    """
    Relevant data view
    """
    filter_backends = (filters.DjangoFilterBackend,)

    filterset_class = RelevantDataFilter

    serializer_class = RelevantDataSerializer


class RelevantDataTypeCodeList:
    """
    Relevant data type code list generic preset
    """
    TYPE_CODES = []
    EXISTENT_VALUES_COLUMN = ''

    serializer_class = TypeCodeSerializer

    permission_classes = (IsAuthenticated, IsActive, PaymentRequired)

    def get_queryset(self) -> QuerySet:
        """
        Initial query set

        :rtype: QuerySet
        """
        return TypeCode.objects.filter(
            type_name__in=self.TYPE_CODES
        ).order_by('short_description')

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
        """
        Filters relevant data queryset

        :type queryset: QuerySet

        :rtype: QuerySet
        """
        relevant_data_sq = RelevantData.objects.filter(
            project__organization_id=self.request.user.organization.id
        ).exclude(**{
            '{}__isnull'.format(self.EXISTENT_VALUES_COLUMN): True
        }).distinct().values(self.EXISTENT_VALUES_COLUMN)

        return queryset.filter(value__in=relevant_data_sq)


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=default_get_responses_with_custom_success(
        data_serializer_many(TypeCodeSerializer)
    ),
    tags=['Relevant data'],
    operation_summary='Vehicles list',
    operation_description='Available vehicles list',
    manual_parameters=[
        token_header(),
    ]
))
class RelevantDataVehiclesView(RelevantDataTypeCodeList, PlainListModelMixin,
                               ListAPIView):
    """
    Vehicles list view
    """
    TYPE_CODES = [TypeCode.OBJECT_TYPE]

    EXISTENT_VALUES_COLUMN = 'vehicle_classification'


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=default_get_responses_with_custom_success(
        data_serializer_many(TypeCodeSerializer)
    ),
    tags=['Relevant data'],
    operation_summary='Event vehicles list',
    operation_description='Available events and vehicles list',
    manual_parameters=[
        token_header(),
    ]
))
class RelevantDataEventsVehiclesView(RelevantDataTypeCodeList,
                                     PlainListModelMixin, ListAPIView):
    """
    Events vehicles view
    """
    TYPE_CODES = [TypeCode.OBJECT_TYPE, TypeCode.ROAD_EVENT_TYPE]

    EXISTENT_VALUES_COLUMN = 'object_class'


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=default_get_responses_with_custom_success(
        data_serializer_many(TypeCodeSerializer)
    ),
    tags=['Relevant data'],
    operation_summary='Road conditions list',
    operation_description='Available road conditions list',
    manual_parameters=[
        token_header(),
    ]
))
class RelevantDataRoadConditionsView(RelevantDataTypeCodeList,
                                     PlainListModelMixin, ListAPIView):
    """
    Roads conditions view
    """
    TYPE_CODES = [TypeCode.ROAD_CONDITIONS_TYPE]

    EXISTENT_VALUES_COLUMN = 'road_weather_condition'


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=default_get_responses_with_custom_success(
        data_serializer_many(TypeCodeSerializer)
    ),
    tags=['Relevant data'],
    operation_summary='Pedestrian transit methods',
    operation_description='Relevant data pedestrian transit methods view',
    manual_parameters=[
        token_header(),
    ]
))
class RelevantDataPedestrianTransitTypeView(PlainListModelMixin, ListAPIView):
    """
    Relevant data pedestrian transit methods view
    """

    serializer_class = TypeCodeSerializer

    permission_classes = (IsAuthenticated, IsActive, PaymentRequired)

    queryset = TypeCode.objects.all().filter(
        type_name=TypeCode.PEDESTRIAN_TRANSIT_TYPE
    ).order_by('short_description')


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=default_get_responses_with_custom_success(
        openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=openapi.Schema(type=openapi.TYPE_STRING)
        )
    ),
    tags=['Relevant data'],
    operation_summary='Project names list',
    operation_description='Returns project names list filtered by prefix',
    manual_parameters=[
        token_header(),
    ]
))
class RelevantDataProjectsView(PlainListModelMixin, ListAPIView):
    """
    Relevant data project names view
    """
    permission_classes = (IsAuthenticated, IsActive, PaymentRequired)

    queryset = RelevantData.objects.distinct().all()

    filter_backends = (filters.DjangoFilterBackend,)

    filterset_class = ProjectFilter

    def filter_queryset(self, queryset: queryset) -> QuerySet:
        queryset = queryset.filter(
            project__organization_id=self.request.user.organization.id
        )

        return super().filter_queryset(queryset)

    def list(self, *args, **kwargs) -> Response:
        queryset = self.filter_queryset(self.get_queryset())

        return Response({
            'data': queryset.values_list('project__name', flat=True)[:5]
        })


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=default_get_responses_with_custom_success(
        http200()
    ),
    tags=['Relevant data'],
    operation_summary='Export relevant data',
    operation_description='Exports relevant data according to filters',
    manual_parameters=[
        token_header(),
    ]
))
class ExportRelevantDataView(RelevantDataHandler, ListAPIView):
    """
    Export relevant data view
    """
    filter_backends = (filters.DjangoFilterBackend,)

    filterset_class = RelevantDataSensorFilter

    def list(self, request: Request, *args, **kwargs):
        from reporting_tool.tasks import ExportRelevantDataTask

        export_format = self.kwargs.get('export_format')

        if not self.__is_format_allowed(export_format):
            raise NotFound(
                'Export format {} is not allowed'.format(export_format)
            )

        if self.filter_queryset(self.get_queryset()).count():
            ExportRelevantDataTask().delay(
                request.user.id,
                export_format,
                request.query_params
            )

            return Response(data={
                'message': _('You will get the file asap')
            }, status=200)

        return Response(data={
            'message': _('Nothing to export')
        }, status=200)

    @staticmethod
    def __is_format_allowed(export_format: str) -> bool:
        from reporting_tool.tasks import RelevantDataFileGenerator

        return export_format in [
            RelevantDataFileGenerator.FORMAT_XML,
            RelevantDataFileGenerator.FORMAT_CSV
        ]


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=default_get_responses_with_custom_success(
        data_serializer_many(RelevantDataGPSSerializer)
    ),
    tags=['Relevant data'],
    operation_summary='Build route',
    operation_description='Builds route by license plate',
    manual_parameters=[
        token_header(),
    ]
))
class RouteGenerationView(RelevantDataHandler, PlainListModelMixin,
                          ListAPIView):
    """
    Route generation view
    """
    permission_classes = (IsAuthenticated, IsActive, PaymentRequired)

    queryset = RelevantData.objects.order_by('timestamp', 'id').all()

    serializer_class = RelevantDataGPSSerializer

    filter_backends = (filters.DjangoFilterBackend,)

    filterset_class = RelevantDataFilter

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
        queryset = queryset.filter(
            license_plate_number=self.kwargs.get('license_plate_number')
        )

        return super().filter_queryset(queryset)


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=default_get_responses_with_custom_success(
        data_serializer_many(HeatMapSerializer)
    ),
    tags=['Relevant data'],
    operation_summary='Heat map',
    operation_description='Relevant data heat map',
    manual_parameters=[
        token_header(),
    ]
))
class RelevantDataHeatMapView(RelevantDataHandler, PlainListModelMixin,
                              ListAPIView):
    """
    Relevant data heat map view
    """
    queryset = RelevantData.objects.all()

    serializer_class = HeatMapSerializer

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
        queryset = queryset.values('sensor_GPS_lat', 'sensor_GPS_long').filter(
            id__in=self.request.query_params.getlist('id', [])
        ).annotate(
            number_of_objects=Sum(
                Cast(
                    KeyTextTransform("NumberOfObjects", "traffic_flow"),
                    models.IntegerField()
                )
            )
        )

        return super().filter_queryset(queryset)


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=default_get_responses_with_custom_success(
        openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=openapi.Schema(type=openapi.TYPE_STRING)
        )
    ),
    tags=['Relevant data'],
    operation_summary='License plates list',
    operation_description='Returns project names list filtered by prefix',
    manual_parameters=[
        token_header(),
    ]
))
class RelevantDataLicensePlatesView(PlainListModelMixin, ListAPIView):
    """
    Relevant data license plates view
    """
    permission_classes = (IsAuthenticated, IsActive, PaymentRequired)

    queryset = RelevantData.objects.distinct().exclude(
        license_plate_number=''
    ).order_by('license_plate_number').all()

    filter_backends = (filters.DjangoFilterBackend,)

    filterset_class = LicensePlateFilter

    def filter_queryset(self, queryset: queryset) -> QuerySet:
        queryset = queryset.filter(
            project__organization_id=self.request.user.organization.id
        )

        return super().filter_queryset(queryset)

    def list(self, *args, **kwargs) -> Response:
        queryset = self.filter_queryset(self.get_queryset())

        return Response({
            'data': queryset.values_list('license_plate_number', flat=True)[:5]
        })
