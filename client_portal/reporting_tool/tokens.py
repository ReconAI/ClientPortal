"""
Tokens logic generation is described here
"""
from datetime import datetime

from django.contrib.auth.tokens import PasswordResetTokenGenerator

from reporting_tool.models import User


class TokenGenerator(PasswordResetTokenGenerator):
    """
    Generate account activation token for a user signed up
    """
    def _make_hash_value(self, user: User, timestamp: datetime) -> str:
        """
        :type user: User
        :type timestamp: datetime

        :rtype: str
        """
        return str(user.pk) + str(timestamp) + str(user.is_active)
