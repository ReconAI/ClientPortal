"""
Stores classes describing access logic
"""
from urllib.request import Request

from django.conf import settings
from rest_framework.permissions import BasePermission


class IsAPISDKAuthorized(BasePermission):
    """
    API SDK key must be provided
    """
    def has_permission(self, request: Request, view) -> bool:
        """
        :type request: Request
        :param view:

        :rtype: bool
        """
        api_sdk_key = request.META.get('HTTP_X_API_SDK_KEY')

        return api_sdk_key == settings.API_SDK_KEY
