"""
Contains views helpers
"""

from django.http import JsonResponse
from django.utils.translation import gettext_lazy as _
from django.views.generic.edit import FormMixin as FormMixinBase
from rest_framework import status

from reporting_tool.serializers import UserSerializer


class CheckTokenMixin:
    """
    Processes any check user token
    """

    check_token_form_class = None

    def check_token(self) -> JsonResponse:
        """
        Checks user token and returns appropriate response

        :rtype: JsonResponse
        """
        form = self.get_form(form_class=self.check_token_form_class)

        if form.is_valid():
            return JsonResponse({
                'message': _('Token is valid'),
                'data': UserSerializer(form.user).data
            }, status=status.HTTP_200_OK)

        return JsonResponse({
            'errors': form.errors
        }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class FormMixin(FormMixinBase):
    """
    Base form mixin for form views
    """

    def get_form_kwargs(self) -> dict:
        """
        :type: dict
        """
        return {
            'data': self.request.data
        }
