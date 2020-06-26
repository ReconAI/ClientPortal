"""
Custom authentication mechanisms
"""
from typing import Tuple

from django.utils.translation import gettext_lazy as _
from rest_framework import exceptions
from rest_framework.authentication import \
    TokenAuthentication as TokenAuthenticationBase

from reporting_tool.models import Token, User


class TokenAuthentication(TokenAuthenticationBase):
    """
    Authenticate user by token provided
    """
    model = Token

    def authenticate_credentials(self, key: str) -> Tuple[User, Token]:
        model = self.get_model()
        try:
            token = model.objects.get(key=key)
            user = token.user
        except model.DoesNotExist:
            raise exceptions.AuthenticationFailed(_('Invalid token.'))

        if not user.is_active:
            raise exceptions.AuthenticationFailed(
                _('User inactive or deleted.'))

        return user, token
