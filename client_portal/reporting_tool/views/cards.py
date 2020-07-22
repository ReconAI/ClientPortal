from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from reporting_tool.serializers import AddCardSerializer
from shared.permissions import IsCompanyDeveloper, IsActive
from shared.swagger.headers import token_header
from shared.swagger.responses import DEFAULT_UNSAFE_REQUEST_RESPONSES
from shared.views.utils import ListCreateAPIView


class CardListView(ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsActive,
                          IsCompanyDeveloper)

    write_serializer_class = AddCardSerializer

    def get(self, request: Request, *args, **kwargs) -> Response:
        return Response({
            'data': request.user.organization.customer.payment_methods().list('card')
        })

    @swagger_auto_schema(
        responses=DEFAULT_UNSAFE_REQUEST_RESPONSES,
        request_body=AddCardSerializer,
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
            self.write_serializer_class(instance=request.user.organization, data=request.data)
        )
