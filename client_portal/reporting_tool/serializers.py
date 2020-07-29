"""
Reporting tool serializers range
"""
import functools
import uuid
from typing import List

import boto3
from botocore.config import Config
from django.conf import settings
from django.core.files.base import ContentFile
from rest_framework.exceptions import ValidationError
from rest_framework.fields import CharField, IntegerField, ListField
from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import Serializer

from recon_db_manager.models import Organization
from shared.fields import FileField
from shared.serializers import ReadOnlySerializerMixin


class AttachPaymentMethodSerializer(ModelSerializer):
    """
    Organization attach card serializer
    """
    payment_method = CharField(
        required=True,
        allow_null=False,
        allow_blank=False
    )

    class Meta:
        """
        Organization payment method
        """
        model = Organization
        fields = ('payment_method', )

    def save(self):
        payment_method = self.validated_data.get('payment_method')

        return self.instance.customer.payment_methods().attach(payment_method)


class DetachPaymentMethodSerializer(AttachPaymentMethodSerializer):
    """
    Organization detach card serializer
    """
    def save(self):
        payment_method = self.validated_data.get('payment_method')

        return self.instance.customer.payment_methods().detach(payment_method)


class CardSerializer(ReadOnlySerializerMixin, Serializer):
    """
    Stripe card attributes
    """
    brand = CharField(required=True)
    country = CharField(required=True, min_length=2, max_length=2)
    exp_month = IntegerField(required=True)
    exp_year = IntegerField(required=True)
    last4 = CharField(required=True, min_length=2, max_length=2)


class PaymentMethodSerializer(ReadOnlySerializerMixin, Serializer):
    """
    Stripe payment method attributes
    """
    id = CharField(required=True)
    created = IntegerField(required=True)
    customer = CharField(required=True)
    type = CharField(required=True)
    card = CardSerializer(required=True)


class FeatureRequestSerializer(Serializer):
    TOTAL_SIZE_LIMITATION_BYTES = 100 << 20
    FILES_UPLOAD_KEY = 'feature_requests'

    description = CharField(required=True)
    sensor_feed_links = ListField(
        child=CharField(allow_null=False, allow_blank=False),
        required=False
    )
    files = ListField(
        child=FileField(),
        required=False,
        max_length=20
    )

    __s3 = None

    def validate_files(self, files: List[ContentFile]) -> List[ContentFile]:
        total_size = functools.reduce(
            lambda carry, file: carry + file.size,
            files,
            0
        )

        if total_size > self.TOTAL_SIZE_LIMITATION_BYTES:
            raise ValidationError('Files size exceeds permissible threshold')

        return files

    def __upload_files(self, files: List[ContentFile]):
        file_public_links = []

        for file in files:
            file_public_links.append(self.__upload_file(file))

        return file_public_links

    def __upload_file(self, file: ContentFile) -> str:
        destination = self.__destination(file)

        self.s3.upload_fileobj(
            file,
            settings.CLIENT_PORTAL_BUCKET,
            destination
        )

        return self.s3.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': settings.CLIENT_PORTAL_BUCKET,
                'Key': destination
            }
        )

    def file_public_link(self, destination: str):
        return '{}/{}/{}'.format(
            self.s3.meta.endpoint_url,
            settings.CLIENT_PORTAL_BUCKET,
            destination
        )

    def __destination(self, file: ContentFile):
        return '{}/organization_{}/{}.{}'.format(
            self.FILES_UPLOAD_KEY,
            self.context.get('organization').id,
            uuid.uuid1(),
            file.ext
        )

    @property
    def s3(self):
        if self.__s3 is None:
            self.__s3 = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                config=Config(signature_version='s3v4')
            )

        return self.__s3

    def create(self, validated_data: dict):
        files = self.__upload_files(validated_data.get('files'))

        return {}

