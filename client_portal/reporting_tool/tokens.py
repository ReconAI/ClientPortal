"""
Tokens logic generation is described here
"""
from datetime import datetime

from django.contrib.auth.tokens import \
    PasswordResetTokenGenerator as PasswordResetTokenGeneratorBase

from reporting_tool.models import User


class PasswordResetTokenGenerator(PasswordResetTokenGeneratorBase):
    def _make_hash_value(self, user, timestamp):
        login_timestamp = ''
        if user.last_login is not None:
            login_timestamp = user.last_login.replace(
                microsecond=0,
                tzinfo=None
            )

        return (
            str(user.pk)
            + str(user.password)
            + str(login_timestamp)
            + str(timestamp)
        )


class AccountActivationTokenGenerator(PasswordResetTokenGeneratorBase):
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


class InvitationTokenGenerator(PasswordResetTokenGeneratorBase):
    """
    Generate invitation token for a user
    """
    def _make_hash_value(self, user: User, timestamp: datetime) -> str:
        """
        :type user: User
        :type timestamp: datetime

        :rtype: str
        """
        return str(user.pk) + str(timestamp) + str(user.password)
