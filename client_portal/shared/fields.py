"""
Custom serializer fields range
"""

import base64
from abc import abstractmethod
from typing import Any, Union, List

from dateutil.parser import parse, ParserError
from django import forms
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.utils.translation import gettext_lazy as _
from rest_framework.fields import FileField as FileFieldBase


class FileField(FileFieldBase):
    """
    Takes base64 encoded string image and converts to ContentFile
    """
    def to_internal_value(self, data: str) -> ContentFile:
        """
        :type data: str

        :rtype: ContentFile
        """
        file_str, name = self.__normalize(data)

        file = ContentFile(base64.b64decode(file_str),
                           name=name)

        return super().to_internal_value(file)

    @staticmethod
    def __normalize(data: str) -> (str, str):
        _name_mime, _file_str = data.split(';base64,')
        _name, _ = _name_mime.split(';data:')
        _, _name = _name.split("name:")

        return _file_str, _name


class RangeField(forms.CharField):
    """
    Takes input separated by special char and converts it to tuple of values
    """

    CHUNKS_NUMBER = 2
    SEPARATOR = '|'

    default_error_messages = {
        'format_error': _('Value should consist of '
                          '{} argument(s) separated by '
                          '{}'.format(CHUNKS_NUMBER, SEPARATOR))
    }

    def clean(self, value: str) -> Union[str, List[Any]]:
        """
        :type value: str

        :return: Union[str, List[Any]]
        """
        if value is None:
            return value

        result = [
            self._prepare(item)
            for item
            in value.split(self.SEPARATOR)
        ]

        if result and len(result) != self.CHUNKS_NUMBER:
            raise ValidationError(
                self.default_error_messages.get('format_error')
            )

        return result

    @abstractmethod
    def _prepare(self, item: str) -> Any:
        """
        Prepare separated value

        :type item: str

        :rtype: Any
        """


class DateTimeRangeField(RangeField):
    """
    Datetime concatenated list processor
    """

    def _prepare(self, item: str) -> Any:
        try:
            return parse(item)
        except ParserError as e:
            raise ValidationError(e, code='format_error')


class FloatRangeField(RangeField):
    """
    Float concatenated list processor
    """

    def _prepare(self, item: str) -> Any:
        try:
            return float(item)
        except ValueError:
            raise ValidationError('Value must be numeric')


class GPSRangeField(FloatRangeField):
    """
    GPS concatenated (4 floats in succession) list processor
    """

    CHUNKS_NUMBER = 4
