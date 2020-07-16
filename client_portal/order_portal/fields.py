import base64

from django.core.files.base import ContentFile
from rest_framework.fields import ImageField


class ImgField(ImageField):
    def to_internal_value(self, data):
        _format, _img_str = data.split(';base64,')
        _name, ext = _format.split('/')
        name = _name.split(":")[-1]

        file = ContentFile(base64.b64decode(_img_str),
                           name='{}.{}'.format(name, ext))

        return super().to_internal_value(file)