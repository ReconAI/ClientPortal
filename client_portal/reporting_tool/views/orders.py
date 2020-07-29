from django.db.models import QuerySet, Sum, Value, CharField
from django.db.models.expressions import RawSQL
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from recon_db_manager.models import DevicePurchase
from reporting_tool.serializers import OrderSerializer
from shared.permissions import IsCompanyDeveloper, IsActive
from shared.swagger.headers import token_header
from shared.swagger.responses import DEFAULT_GET_REQUESTS_RESPONSES


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=DEFAULT_GET_REQUESTS_RESPONSES,
    tags=['Orders'],
    operation_summary='Orders list',
    operation_description='Shows list of completed purchases',
    manual_parameters=[
        token_header(),
    ]
))
class OrdersListView(ListAPIView):
    permission_classes = (IsAuthenticated, IsActive, IsCompanyDeveloper)

    serializer_class = OrderSerializer

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
        return queryset.filter(organization_id=self.request.user.organization.id)

    def get_queryset(self):
        return DevicePurchase.objects.all().values('payment_id').annotate(
            Sum('total'),
            timestamp=RawSQL('created_dt::timestamp(0)', ()),
            type=Value('purchase', output_field=CharField())
        ).order_by('-timestamp')