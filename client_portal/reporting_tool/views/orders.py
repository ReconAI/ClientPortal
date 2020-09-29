"""
Views managing orders
"""

from django.db.models import QuerySet, Value, CharField, BooleanField, Case, \
    When, Q
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from recon_db_manager.models import DevicePurchase, Purchase, Organization, \
    RecurrentCharge
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

    def get_queryset(self):
        return self.__unify(self.purchase_queryset).union(
            self.__unify(self.invoice_queryset), all=True
        ).order_by('-created_dt')

    def __unify(self, queryset: QuerySet) -> QuerySet:
        return queryset.values(
            'id', 'total', 'type', 'payment_id',
            'created_dt', 'is_invoice', 'success'
        ).filter(
            organization_id=self.request.user.organization.id
        )

    @property
    def purchase_queryset(self) -> QuerySet:
        """
        Initial purchase queryset

        :rtype: QuerySet
        """
        return Purchase.objects.all().annotate(
            is_invoice=Case(
                When(payment_id__isnull=True, then=Value(True)),
                default=Value(False),
                output_field=BooleanField(),
            ),
            success=Value(True, output_field=BooleanField()),
            type=Value('purchase', output_field=CharField()),
        )

    @property
    def invoice_queryset(self) -> QuerySet:
        """
        Initial invoice queryset

        :rtype: QuerySet
        """
        return RecurrentCharge.objects.all().annotate(
            success=Case(
                When(
                    Q(payment_id__isnull=False) | Q(is_invoice=True),
                    then=Value(True)
                ),
                default=Value(False),
                output_field=BooleanField(),
            ),
            type=Value('recurrent_charge', output_field=CharField())
        )


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

    queryset = DevicePurchase.objects.prefetch_related(
        'purchase', 'device__images'
    ).all()

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
        return queryset.filter(
            purchase__organization_id=self.request.user.organization.id,
            purchase=self.kwargs[self.lookup_field]
        )

    def get_serializer_context(self) -> dict:
        return {
            'request': self.request
        }


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=default_get_responses_with_custom_success(
        openapi.Response(
            'File Attachment',
            schema=openapi.Schema(type=openapi.TYPE_FILE)
        ),
    ),
    tags=['Orders'],
    operation_summary='Monthly invoice download',
    operation_description='Downloads invoice if it\'s completed'
                          'by invoice payment method',
    manual_parameters=[
        token_header(),
    ]
))
class OrderItemDownload(PlainListModelMixin, RetrieveAPIView):
    """
    Download invoice http hanlder
    """

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
            id=self.kwargs[self.lookup_field]
        )
