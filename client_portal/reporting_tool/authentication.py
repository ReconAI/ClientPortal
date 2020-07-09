"""
Custom authentication mechanisms
"""
from typing import Tuple

from django.contrib.auth.models import AnonymousUser
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
        except (model.DoesNotExist, TypeError):
            token = None
            user = AnonymousUser()

        return user, token
