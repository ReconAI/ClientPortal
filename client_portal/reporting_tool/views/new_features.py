from django.utils.translation import gettext_lazy as _
from rest_framework.permissions import IsAuthenticated

from reporting_tool.serializers import FeatureRequestSerializer
from shared.permissions import IsActive, IsCompanyDeveloper
from shared.views.utils import CreateAPIView


class NewFeatureView(CreateAPIView):
    create_success_message = _('Request is sent to the administrator')

    serializer_class = FeatureRequestSerializer

    permission_classes = (IsAuthenticated, IsActive, IsCompanyDeveloper)

    def get_serializer_context(self) -> dict:
        """
        :rtype: dict
        """
        return {
            'organization': self.request.user.organization
        }
