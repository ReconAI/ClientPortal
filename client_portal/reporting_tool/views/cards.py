from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from reporting_tool.serializers import AttachPaymentMethodSerializer, DetachPaymentMethodSerializer
from shared.permissions import IsCompanyDeveloper, IsActive
from shared.swagger.headers import token_header
from shared.swagger.responses import DEFAULT_UNSAFE_REQUEST_RESPONSES, \
    DEFAULT_GET_REQUESTS_RESPONSES
from shared.views.utils import ListCreateAPIView


class CardListView(ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsActive,
                          IsCompanyDeveloper)

    serializer_class = AttachPaymentMethodSerializer

    delete_serializer_class = DetachPaymentMethodSerializer

    @swagger_auto_schema(
        responses=DEFAULT_GET_REQUESTS_RESPONSES,
        tags=['Cards'],
        operation_summary="List of cards",
        operation_description='Gets list of cards attached',
        manual_parameters=[
            token_header(),
        ]
    )
    def get(self, request: Request, *args, **kwargs) -> Response:
        return Response(request.user.organization.customer.payment_methods().list('card'))

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
            self.serializer_class(instance=request.user.organization, data=request.data)
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
    def delete(self, request):
        return self.save_or_error(
            'Card is detached',
            self.delete_serializer_class(instance=request.user.organization,
                                  data=request.data)
        )