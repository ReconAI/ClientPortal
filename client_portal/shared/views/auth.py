from django.http import JsonResponse
from django.utils.translation import gettext_lazy as _
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.authtoken.views import \
    ObtainAuthToken as ObtainAuthTokenBase
from rest_framework.request import Request

from shared.models import Token
from shared.permissions import IsNotAuthenticated
from shared.serializers import AuthTokenSerializer
from shared.swagger.responses import token, http400, http403, http405


class ObtainAuthToken(ObtainAuthTokenBase):
    """
    Returns user token by credential provided
    """

    permission_classes = (IsNotAuthenticated,)

    serializer_class = AuthTokenSerializer

    @swagger_auto_schema(
        request_body=AuthTokenSerializer,
        responses={
            status.HTTP_201_CREATED: token(),
            status.HTTP_400_BAD_REQUEST: http400(),
            status.HTTP_403_FORBIDDEN: http403(),
            status.HTTP_405_METHOD_NOT_ALLOWED: http405()
        },
        tags=['Accounts'],
        operation_summary="Logs user in",
        operation_description='Returns authentication token '
                              'as a successful result of loging',
    )
    def post(self, request: Request, *args, **kwargs) -> JsonResponse:
        """
        User token retrieval

        :type request: Request
        :type args: list
        :type kwargs: dict

        :rtype: JsonResponse
        """
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            user_token, created = Token.objects.get_or_create(user_id=user.pk)

            return JsonResponse({
                'data': {
                    'token': user_token.key
                }
            }, status=status.HTTP_201_CREATED)

        return JsonResponse({
            'errors': _('Sorry, the information you entered '
                        'does not match what we have on file. '
                        'Please try again')
        }, status=status.HTTP_400_BAD_REQUEST)

