"""
Module with custom validators
"""

import re

from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


class TwoLowercasesPasswordValidator:
    """
    Validate whether the password is alphanumeric.
    """

    def validate(self, password: str, user=None):
        """
        :type password: str
        :type user: User

        :raise: ValidationError
        """
        if not re.match(r'.*[a-z].*[a-z]', password):
            raise ValidationError(
                self.get_help_text()
            )

    @staticmethod
    def get_help_text() -> str:
        """
        :rtype: str
        """
        return _('At least two characters should be lowercased')


class TwoUppercasesPasswordValidator:
    """
    Validate whether the password is alphanumeric.
    """

    def validate(self, password, user=None):
        """
        :type password: str
        :type user: User

        :raise: ValidationError
        """
        if not re.match(r'.*[A-Z].*[A-Z]', password):
            raise ValidationError(
                self.get_help_text()
            )

    @staticmethod
    def get_help_text() -> str:
        """
        :rtype: str
        """
        return _('At least two characters should be uppercased')


class TwoNumbersPasswordValidator:
    """
    Validate whether the password is alphanumeric.
    """

    def validate(self, password, user=None):
        """
        :type password: str
        :type user: User

        :raise: ValidationError
        """
        if not re.match(r'.*\d.*\d', password):
            raise ValidationError(
                self.get_help_text()
            )

    @staticmethod
    def get_help_text() -> str:
        """
        :rtype: str
        """
        return _('At least two characters should be number')


class SpecialCharacterPasswordValidator:
    """
    Validate whether the password is alphanumeric.
    """

    def validate(self, password, user=None):
        """
        :type password: str
        :type user: User

        :raise: ValidationError
        """
        if not re.match(r'.*[\-/*.=]', password):
            raise ValidationError(
                self.get_help_text()
            )

    @staticmethod
    def get_help_text() -> str:
        """
        :rtype: str
        """
        return _('At least one character should be -/*+.=')
