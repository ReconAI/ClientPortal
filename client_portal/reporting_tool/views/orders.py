"""
Views managing orders
"""

from django.db.models import QuerySet, Value, CharField
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from recon_db_manager.models import DevicePurchase, Purchase, Organization
from reporting_tool.serializers import OrderListSerializer
from shared.pdf import Order
from shared.permissions import IsCompanyDeveloper, IsActive
from shared.serializers import OrderSerializer
from shared.swagger.headers import token_header
from shared.swagger.responses import DEFAULT_GET_REQUESTS_RESPONSES, \
    default_get_responses_with_custom_success, data_serializer_many
from shared.views.utils import PlainListModelMixin, RetrieveAPIView


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
    """
    Organization orders list view
    """

    permission_classes = (IsAuthenticated, IsActive, IsCompanyDeveloper)

    serializer_class = OrderListSerializer

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
        return queryset.filter(
            organization_id=self.request.user.organization.id
        )

    def get_queryset(self):
        return Purchase.objects.all().annotate(
            type=Value('purchase', output_field=CharField())
        ).order_by('-created_dt')


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=default_get_responses_with_custom_success(
        data_serializer_many(OrderSerializer)
    ),
    tags=['Orders'],
    operation_summary='Order item view',
    operation_description='Shows purchase item with related information',
    manual_parameters=[
        token_header(),
    ]
))
class OrderItemView(PlainListModelMixin, ListAPIView):
    """
    Displays organization order item
    """

    permission_classes = (IsAuthenticated, IsActive, IsCompanyDeveloper)

    serializer_class = OrderSerializer

    queryset = DevicePurchase.objects.prefetch_related('purchase', 'device__images').all()

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
        return queryset.filter(
            purchase__organization_id=self.request.user.organization.id,
            purchase=self.kwargs[self.lookup_field]
        )

    def get_serializer_context(self) -> dict:
        return {
            'request': self.request
        }


class OrderItemDownload(PlainListModelMixin, RetrieveAPIView):
    permission_classes = (IsAuthenticated, IsActive, IsCompanyDeveloper)

    serializer_class = OrderSerializer

    queryset = Purchase.objects.prefetch_related(
        'device_purchases',
        'device_purchases__device__images'
    ).all()

    def get(self, *args, **kwargs) -> HttpResponse:
        purchase = self.get_object()

        serializer = self.get_serializer(purchase.device_purchases, many=True)

        order = Order(
            self.request.user.organization,
            Organization.root(),
            serializer,
            purchase
        ).generate()

        response = HttpResponse(order, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename=order.pdf'

        return response

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
        return queryset.filter(
            organization_id=self.request.user.organization.id,
            id=self.kwargs[self.lookup_field],
            payment_id__isnull=True
        )
