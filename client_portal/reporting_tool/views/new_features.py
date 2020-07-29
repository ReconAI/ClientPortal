"""
New feature views set
"""

from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated

from reporting_tool.serializers import FeatureRequestSerializer
from shared.permissions import IsActive, IsCompanyDeveloper
from shared.swagger.headers import token_header
from shared.swagger.responses import DEFAULT_UNSAFE_REQUEST_RESPONSES
from shared.views.utils import CreateAPIView


@method_decorator(name='post', decorator=swagger_auto_schema(
    responses=DEFAULT_UNSAFE_REQUEST_RESPONSES,
    request_body=FeatureRequestSerializer,
    tags=['Feature request'],
    operation_summary='New feature request',
    operation_description='Requests new feature sending mail to administrator',
    manual_parameters=[
        token_header(),
    ]
))
class NewFeatureView(CreateAPIView):
    """
    Requests new feature
    """

    create_success_message = _('Request is sent to administrator')

    serializer_class = FeatureRequestSerializer

    permission_classes = (IsAuthenticated, IsActive, IsCompanyDeveloper)

    def get_serializer_context(self) -> dict:
        """
        :rtype: dict
        """
        return {
            'organization': self.request.user.organization
        }
