from django import forms
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.utils.http import urlsafe_base64_decode
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ParseError, NotFound

from reporting_tool.models import User
from reporting_tool.tokens import PasswordResetTokenGenerator


class CheckUserTokenForm(forms.Form):
    """
    Check up activation token form
    """
    uidb64 = forms.CharField(min_length=1)
    token = forms.CharField(min_length=2, max_length=33)

    @property
    def user(self) -> User:
        """
        :rtype: User
        """
        try:
            user_model = get_user_model()

            uidb64 = self.data.get('uidb64')

            uid = urlsafe_base64_decode(uidb64).decode()
            return user_model.objects.get(pk=uid)
        except (AttributeError, TypeError, ValueError, OverflowError):
            raise ParseError('Request data is invalid')
        except ObjectDoesNotExist:
            raise NotFound(_('No user found'))

    def clean_token(self) -> str:
        """
        :rtype: str
        """
        token = self.cleaned_data.get('token')

        if not self._token_generator.check_token(self.user, token):
            raise forms.ValidationError(_('Token is invalid.'))

        return token

    @property
    def _token_generator(self):
        """
        :return: token generator should be returned
        """
        return PasswordResetTokenGenerator()
