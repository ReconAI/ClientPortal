from django.db.models import QuerySet
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django_filters import rest_framework as filters
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from recon_db_manager.models import DeviceInstance
from reporting_tool.filters import RelevantDataSensorFilter
from reporting_tool.serializers import RelevantDataSerializer, SensorSerializer
from reporting_tool.serializers import SensorGPSSerializer
from reporting_tool.views.relevant_data import RelevantDataHandler
from shared.permissions import IsActive, PaymentRequired
from shared.swagger.headers import token_header
from shared.swagger.responses import DEFAULT_UNSAFE_REQUEST_RESPONSES
from shared.swagger.responses import \
    default_get_responses_with_custom_success, data_serializer
from shared.views.utils import UpdateAPIView, RetrieveAPIView


class SensorHandler:
    permission_classes = (IsAuthenticated, IsActive, PaymentRequired)

    queryset = DeviceInstance.objects.all()

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
        qs = queryset.filter(
            edge_nodes__organization_id=self.request.user.organization.id
        )

        return super().filter_queryset(qs)


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
        qs = queryset.filter(
            device_instance=self.kwargs.get(self.lookup_field)
        )

        return super().filter_queryset(qs)


class SensorsListView(SensorHandler, ListAPIView):
    serializer_class = SensorSerializer

    queryset = DeviceInstance.objects.all().distinct('id')


class SensorsItemView(SensorHandler, RetrieveAPIView):
    serializer_class = SensorSerializer

    queryset = DeviceInstance.objects.all().distinct('id')


@method_decorator(name='put', decorator=swagger_auto_schema(
    responses=DEFAULT_UNSAFE_REQUEST_RESPONSES,
    tags=['Sensors'],
    operation_summary='Relevant data set GPS',
    operation_description='Sets GPS for an entry of relevant data',
    manual_parameters=[
        token_header(),
    ]
))
class SensorSetGPSView(UpdateAPIView):
    serializer_class = SensorGPSSerializer

    update_success_message = _('GPS is updated successfully')
