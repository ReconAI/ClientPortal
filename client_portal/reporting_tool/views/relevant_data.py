from django.db.models import QuerySet
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django_filters import rest_framework as filters
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from recon_db_manager.models import RelevantData
from reporting_tool.filters import RelevantDataFilter
from reporting_tool.serializers import RelevantDataSerializer, \
    RelevantDataSetGPSSerializer
from shared.permissions import IsActive, PaymentRequired
from shared.swagger.headers import token_header
from shared.swagger.responses import \
    default_get_responses_with_custom_success, data_serializer, \
    DEFAULT_UNSAFE_REQUEST_RESPONSES
from shared.views.utils import RetrieveAPIView, UpdateAPIView


class RelevantDataHandler:
    permission_classes = (IsAuthenticated, IsActive, PaymentRequired)

    queryset = RelevantData.objects.select_related('project').all()

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
        return queryset.filter(
            project__organization_id=self.request.user.organization.id
        )


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
    operation_summary='Relevant data item',
    operation_description='Relevant data item view',
    manual_parameters=[
        token_header(),
    ]
))
class RelevantDataItemView(RelevantDataHandler, RetrieveAPIView):
    serializer_class = RelevantDataSerializer


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
