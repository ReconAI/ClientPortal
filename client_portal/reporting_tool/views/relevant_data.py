from django.db.models import QuerySet
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django_filters import rest_framework as filters
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from recon_db_manager.models import RelevantData, TypeCode
from reporting_tool.filters import RelevantDataFilter, \
    RelevantDataSensorFilter, ProjectFilter
from reporting_tool.serializers import RelevantDataSerializer, \
    RelevantDataSetGPSSerializer, TypeCodeSerializer
from shared.permissions import IsActive, PaymentRequired
from shared.swagger.headers import token_header
from shared.swagger.responses import \
    default_get_responses_with_custom_success, data_serializer, \
    DEFAULT_UNSAFE_REQUEST_RESPONSES, data_serializer_many
from shared.views.utils import UpdateAPIView, PlainListModelMixin


class RelevantDataHandler:
    permission_classes = (IsAuthenticated, IsActive, PaymentRequired)

    queryset = RelevantData.objects.select_related(
        'project'
    ).prefetch_related(
        'event', 'object_class', 'tagged_data', 'license_plate',
        'face', 'cad_file_tag', 'ambient_weather_condition',
        'road_weather_condition'
    ).order_by('-id').all()

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
        qs = queryset.filter(
            project__organization_id=self.request.user.organization.id
        )

        return super().filter_queryset(qs)


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
    filter_backends = (filters.DjangoFilterBackend,)

    filterset_class = RelevantDataFilter

    serializer_class = RelevantDataSerializer


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=default_get_responses_with_custom_success(
        data_serializer(RelevantDataSerializer)
    ),
    tags=['Relevant data'],
    operation_summary='Sensor\'s relevant data',
    operation_description='Displays source\'s relevant data',
    manual_parameters=[
        token_header(),
    ]
))
class RelevantDataSensorView(RelevantDataHandler, ListAPIView):
    serializer_class = RelevantDataSerializer

    filter_backends = (filters.DjangoFilterBackend,)

    filterset_class = RelevantDataSensorFilter

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
        qs = queryset.filter(edge_node_id=self.kwargs.get(self.lookup_field))

        return super().filter_queryset(qs)


@method_decorator(name='put', decorator=swagger_auto_schema(
    responses=DEFAULT_UNSAFE_REQUEST_RESPONSES,
    tags=['Relevant data'],
    operation_summary='Relevant data set GPS',
    operation_description='Sets GPS for an entry of relevant data',
    manual_parameters=[
        token_header(),
    ]
))
class RelevantDataSetGPSView(RelevantDataHandler, UpdateAPIView):
    serializer_class = RelevantDataSetGPSSerializer

    update_success_message = _('GPS is updated successfully')


class RelevantDataTypeCodeList:
    TYPE_CODES = []
    EXISTENT_VALUES_COLUMN = ''

    serializer_class = TypeCodeSerializer

    permission_classes = (IsAuthenticated, IsActive, PaymentRequired)

    def get_queryset(self) -> QuerySet:
        return TypeCode.objects.filter(
            type_name__in=self.TYPE_CODES
        ).order_by('short_description')

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
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
class RelevantDataEventsVehiclesView(RelevantDataTypeCodeList, PlainListModelMixin,
                                     ListAPIView):
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
    TYPE_CODES = [TypeCode.ROAD_CONDITIONS_TYPE]

    EXISTENT_VALUES_COLUMN = 'road_weather_condition'


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
    permission_classes = (IsAuthenticated, IsActive, PaymentRequired)

    queryset = RelevantData.objects.distinct().all()

    filter_backends = (filters.DjangoFilterBackend,)

    filterset_class = ProjectFilter

    def filter_queryset(self, queryset: queryset) -> QuerySet:
        qs = queryset.filter(
            project__organization_id=self.request.user.organization.id
        )

        return super().filter_queryset(qs)

    def list(self, *args, **kwargs) -> Response:
        queryset = self.filter_queryset(self.get_queryset())

        return Response({
            'data': queryset.values_list('project__name', flat=True)[:5]
        })

class ExportRelevantData(ListAPIView):
    def list(self, request, *args, **kwargs):
        from reporting_tool.tasks import ExportRelevantDataTask

        ExportRelevantDataTask().delay(4, 6)

        return Response(status=200)
