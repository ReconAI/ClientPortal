"""
Cards views set
"""
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from reporting_tool.serializers import AttachPaymentMethodSerializer, \
    DetachPaymentMethodSerializer, PaymentMethodSerializer, \
    DefaultPaymentMethodSerializer
from shared.managers import PaymentMethodManager
from shared.permissions import IsCompanyDeveloper, IsActive
from shared.swagger.headers import token_header
from shared.swagger.responses import DEFAULT_UNSAFE_REQUEST_RESPONSES, \
    default_get_responses_with_custom_success, data_serializer_many
from shared.views.utils import ListCreateAPIView, UpdateAPIView


class CardListView(ListCreateAPIView):
    """
    Cards manipulation list view
    """
    permission_classes = (IsAuthenticated, IsActive, IsCompanyDeveloper)

    serializer_class = AttachPaymentMethodSerializer

    delete_serializer_class = DetachPaymentMethodSerializer

    CARDS_LIMIT = 100

    @swagger_auto_schema(
        responses=default_get_responses_with_custom_success(
            data_serializer_many(PaymentMethodSerializer)
        ),
        tags=['Cards'],
        operation_summary="List of cards",
        operation_description='Gets list of cards attached',
        manual_parameters=[
            token_header(),
        ]
    )
    def get(self, request: Request, *args, **kwargs) -> Response:
        return Response(
            request.user.organization.customer.payment_methods().list(
                PaymentMethodManager.CARD_METHOD,
                limit=self.CARDS_LIMIT
            )
        )

    @swagger_auto_schema(
        responses=DEFAULT_UNSAFE_REQUEST_RESPONSES,
        tags=['Cards'],
        operation_summary="Attach a card",
        operation_description='Attaches created card to organization',
        manual_parameters=[
            token_header(),
        ]
    )
    def post(self, request: Request, *args, **kwargs) -> Response:
        return self.save_or_error(
            'Card is attached',
            self.serializer_class(
                instance=request.user.organization,
                data=request.data
            )
        )

    @swagger_auto_schema(
        responses=DEFAULT_UNSAFE_REQUEST_RESPONSES,
        request_body=delete_serializer_class,
        tags=['Cards'],
        operation_summary="Detach a card",
        operation_description='Detaches created card from organization',
        manual_parameters=[
            token_header(),
        ]
    )
    def delete(self, request: Request) -> Response:
        """
        Detaches card from customer

        :type request: Request

        :rtype: Response
        """
        return self.save_or_error(
            'Card is detached',
            self.delete_serializer_class(
                instance=request.user.organization,
                data=request.data
            )
        )


@method_decorator(name='put', decorator=swagger_auto_schema(
    responses=DEFAULT_UNSAFE_REQUEST_RESPONSES,
    tags=['Payment methods'],
    operation_summary='Set default payment method',
    operation_description='Updates default payment method',
    manual_parameters=[
        token_header(),
    ]
))
class DefaultPaymentMethodView(UpdateAPIView):
    """
    Updated default payment method
    """

    permission_classes = (IsAuthenticated, IsActive, IsCompanyDeveloper)

    serializer_class = DefaultPaymentMethodSerializer

    update_success_message = _('Default payment method is changed')

    def get_object(self):
        return self.request.user.organization
