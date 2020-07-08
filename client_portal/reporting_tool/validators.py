"""
Module with custom validators
"""

import re
from typing import Iterable

from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

from reporting_tool.models import Role


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
        return _('At least two characters should be lowercased.')


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
        return _('At least two characters should be uppercased.')


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
        return _('At least two characters should be number.')


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
        if not re.match(r'.*[\-/*+.=!?]', password):
            raise ValidationError(
                self.get_help_text()
            )

    @staticmethod
    def get_help_text() -> str:
        """
        :rtype: str
        """
        return _('At least one character should be -/*+.=!?.')


class InSetValidator:
    """
    Validate whether the password is alphanumeric.
    """
    __message = _('Provided option is out of acceptable set.')
    __code = 'invalid_option'

    def __init__(self, options: Iterable, message=None, code=None):
        self.__options = options

        if message is not None:
            self.__message = message
        if code is not None:
            self.__code = code

    def __call__(self, value):
        if not self.__is_value_valid(value):
            raise ValidationError(
                self.__message,
                code=self.__code
            )

    def __is_value_valid(self, value):
        return (
            value in self.__options
            or str(value) in [str(option) for option in self.__options]
        )


user_role_validator = InSetValidator(
    options=(Role.ADMIN, Role.DEVELOPER, Role.CLIENT)
)
