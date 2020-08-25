from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from recon_db_manager.models import RelevantData
from reporting_tool.serializers import RelevantDataSerializer
from shared.permissions import IsActive, PaymentRequired
from shared.swagger.headers import token_header
from shared.swagger.responses import default_get_responses_with_custom_success, \
    data_serializer
from shared.views.utils import RetrieveAPIView


class RelevantDataGet:
    serializer_class = RelevantDataSerializer

    permission_classes = (IsAuthenticated, IsActive, PaymentRequired)

    queryset = RelevantData.objects.all()


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
class RelevantDataView(RelevantDataGet, ListAPIView):
    pass


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
class RelevantDataItemView(RelevantDataGet, RetrieveAPIView):
    pass
