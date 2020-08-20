"""
Payment views module
"""
from django.conf import settings
from django.db.transaction import atomic
from django.utils.translation import gettext_lazy as _
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from order_portal.serizalizers import BasketOverviewSerializer, \
    PaymentSerializer, BasketSerializer, PaymentIntentSerializer
from recon_db_manager.models import Device
from shared.permissions import IsCompanyDeveloper, IsActive
from shared.swagger.headers import token_header
from shared.swagger.responses import \
    default_unsafe_responses_with_custom_success, data_serializer_many, \
    data_message_serializer
from shared.views.utils import CreateAPIView


class BasketOverviewView(CreateAPIView):
    """
    List with ordered items view
    """
    serializer_class = BasketOverviewSerializer

    permission_classes = (IsAuthenticated, IsActive, IsCompanyDeveloper)

    queryset = Device.objects.prefetch_related(
        'images').filter(published=True).all()

    @swagger_auto_schema(
        responses=default_unsafe_responses_with_custom_success(
            data_serializer_many(serializer_class)
        ),
        request_body=BasketSerializer,
        tags=['Basket'],
        operation_summary="Basket overview",
        manual_parameters=[
            token_header(),
        ],
        operation_description='Returns fields required for payment',
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            self.filter_queryset(self.get_queryset()),
            many=True
        )

        return Response({
            'data': serializer.data
        })

    def get_serializer_context(self):
        return {
            'request': self.request,
            'device_count': self.request.data.get('device_count', {})
        }

    def filter_queryset(self, queryset):
        return queryset.filter(
            id__in=self.request.data.get('device_count', {}).keys()
        )


class BasketPayView(CreateAPIView):
    """
    Complete payment view
    """
    serializer_class = PaymentSerializer

    permission_classes = (IsAuthenticated, IsActive, IsCompanyDeveloper)

    create_success_message = _('Your order has been completed successfully')

    @swagger_auto_schema(
        responses=default_unsafe_responses_with_custom_success(
            data_message_serializer(PaymentIntentSerializer)
        ),
        tags=['Basket'],
        operation_summary="Carry payment out",
        manual_parameters=[
            token_header(),
        ],
        operation_description='Carries payment out and puts data to db'
    )
    @atomic(settings.RECON_AI_CONNECTION_NAME)
    def post(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            payment = serializer.save()

            return Response({
                'message': self.create_success_message,
                'data': PaymentIntentSerializer(payment).data
            }, status=status.HTTP_200_OK)

        return Response({
            'errors': serializer.errors
        }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

    def get_serializer_context(self):
        return {
            'request': self.request
        }
