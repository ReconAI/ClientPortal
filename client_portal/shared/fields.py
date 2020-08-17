"""
Custom serializer fields range
"""

import base64

from django.core.files.base import ContentFile
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
