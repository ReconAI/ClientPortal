"""
Forms helpers are located here
"""

from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.exceptions import ObjectDoesNotExist
from django.utils.http import urlsafe_base64_decode
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ParseError, NotFound

from reporting_tool.tokens import PasswordResetTokenGenerator
from shared.models import User
from shared.validators import user_role_validator


class RoleFieldMixin:
    """
    Describes role fields and its validation process
    """

    role = forms.CharField(label=_("User role"), validators=[
        user_role_validator
    ])

    def clean_role(self) -> Group:
        """
        :rtype: Group

        :raise: ValidationError
        """
        role = self.data["role"]

        try:
            return Group.objects.get(name=role)
        except ObjectDoesNotExist:
            raise forms.ValidationError(_('Invalid role'))


class CheckUserTokenForm(forms.Form):
    """
    Check up activation token form
    """
    uidb64 = forms.CharField(min_length=1)
    token = forms.CharField(min_length=2, max_length=33)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.__token_user = None

    @property
    def user(self) -> User:
        """
        :rtype: User
        """
        if self.__token_user is None:
            try:
                user_model = get_user_model()

                uidb64 = self.data.get('uidb64')

                uid = urlsafe_base64_decode(uidb64).decode()
                self.__token_user = user_model.objects.get(pk=uid)
            except (AttributeError, TypeError, ValueError, OverflowError):
                raise ParseError('Request data is invalid')
            except ObjectDoesNotExist:
                raise NotFound(_('No user found'))

        return self.__token_user

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
