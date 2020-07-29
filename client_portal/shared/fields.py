"""
Custom serializer fields range
"""

import base64

from django.core.files.base import ContentFile as ContentFileBase
from rest_framework.fields import FileField as FileFieldBase


class ContentFile(ContentFileBase):
    """
    Content file accepting file extension
    """
    def __init__(self, content, ext, name=None):
        super().__init__(content, name=name)

        self.ext = ext


class FileField(FileFieldBase):
    """
    Takes base64 encoded string image and converts to ContentFile
    """
    def to_internal_value(self, data: str) -> ContentFile:
        """
        :type data: str

        :rtype: ContentFile
        """
        _format, _file_str = data.split(';base64,')
        _name, ext = _format.split('/')
        name = _name.split(":")[-1]

        file = ContentFile(base64.b64decode(_file_str),
                           ext=ext,
                           name='{}.{}'.format(name, ext))

        return super().to_internal_value(file)
