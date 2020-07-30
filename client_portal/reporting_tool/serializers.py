"""
Reporting tool serializers range
"""
import functools
import uuid
from typing import List

import boto3
from botocore.client import BaseClient
from botocore.config import Config
from django.conf import settings
from django.core.files.base import ContentFile
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.fields import CharField, IntegerField, ListField
from rest_framework.serializers import ModelSerializer
from rest_framework.serializers import Serializer
from rest_framework.utils.serializer_helpers import ReturnDict

from order_portal.serizalizers import DeviceImageSerializer
from recon_db_manager.models import Organization, DevicePurchase
from reporting_tool.forms.utils import SendEmailMixin
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

    def save(self, **kwargs):
        payment_method = self.validated_data.get('payment_method')

        return self.instance.customer.payment_methods().attach(payment_method)


class DetachPaymentMethodSerializer(AttachPaymentMethodSerializer):
    """
    Organization detach card serializer
    """
    def save(self, **kwargs):
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


class FeatureRequestSerializer(ReadOnlySerializerMixin,
                               SendEmailMixin, Serializer):
    """
    New feature request serializer
    """

    TOTAL_SIZE_LIMITATION_BYTES = 100 << 20
    FILES_UPLOAD_KEY = 'feature_requests'

    description = CharField(required=True, min_length=50, max_length=10000)
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
        """
        :type files: List[ContentFile]

        :rtype: List[ContentFile]
        """
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
        """
        Uploads file and returns its link

        :type file: ContentFile

        :rtype: str
        """
        destination = self.__destination(file)

        self.s3_client.upload_fileobj(
            file,
            settings.CLIENT_PORTAL_BUCKET,
            destination
        )

        return self.s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': settings.CLIENT_PORTAL_BUCKET,
                'Key': destination
            }
        )

    def __destination(self, file: ContentFile) -> str:
        return '{}/organization_{}/{}.{}'.format(
            self.FILES_UPLOAD_KEY,
            self.context.get('organization').id,
            uuid.uuid1(),
            file.ext
        )

    @property
    def s3_client(self) -> BaseClient:
        """
        :rtype: BaseClient
        """
        if self.__s3 is None:
            self.__s3 = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                config=Config(signature_version='s3v4')
            )

        return self.__s3

    def save(self, **kwargs):
        return self.send_mail(
            'a.volosyuk@hqsoftwarelab.com',
            'emails/feature_request_subject.txt',
            'emails/feature_request.html',
            self.validated_data
        )

    def get_email_context(self, validated_data: dict, *args, **kwargs) -> dict:
        """
        :type validated_data: dict

        :rtype: dict
        """
        return {
            'files_attached': self.__upload_files(validated_data.get('files')),
            'feed_links': validated_data.get('sensor_feed_links', []),
            'description': validated_data.get('description', ''),
            'organization': self.context.get('organization')
        }


class OrderListSerializer(ModelSerializer):
    """
    Order list serializer
    """
    type = serializers.CharField()
    timestamp = serializers.CharField()
    payment_id = serializers.CharField()
    total = serializers.SerializerMethodField(method_name='process_total')

    class Meta:
        """
        Orders list fields set
        """
        model = DevicePurchase
        fields = ('payment_id', 'type', 'timestamp', 'total')

    @staticmethod
    def process_total(purchase: dict) -> float:
        """
        Total displayed with cents separated

        :type purchase: dict

        :rtype: float
        """
        return purchase.get('total__sum', 0) / 100


class OrderSerializer(ModelSerializer):
    """
    Order item serializer
    """
    price_without_vat = serializers.SerializerMethodField(
        method_name='process_price_without_vat',
        required=True
    )
    price_with_vat = serializers.SerializerMethodField(
        method_name='process_price_with_vat',
        required=True
    )
    total = serializers.SerializerMethodField(
        method_name='process_total',
        required=True
    )
    images = serializers.SerializerMethodField(
        method_name='format_images',
        required=True
    )

    class Meta:
        """
        Device purchase fields list definition
        """
        model = DevicePurchase
        fields = ('payment_id', 'device_name', 'price_without_vat',
                  'price_with_vat', 'device_cnt', 'total', 'images',
                  'created_dt')

    @staticmethod
    def process_price_without_vat(purchase: DevicePurchase) -> float:
        """
        :type purchase: DevicePurchase

        :rtype: float
        """
        return float(purchase.device_price)

    def process_price_with_vat(self, purchase: DevicePurchase) -> float:
        """
        :type purchase: DevicePurchase

        :rtype: float
        """
        return round(self.process_total(purchase) / purchase.device_cnt, 2)

    @staticmethod
    def process_total(purchase: DevicePurchase) -> float:
        """
        Returns total in number with floating point

        :type purchase: DevicePurchase

        :rtype: float
        """
        return purchase.total / 100

    def format_images(self, purchase: DevicePurchase) -> ReturnDict:
        """
        :type purchase: DevicePurchase

        :rtype: list
        """
        return DeviceImageSerializer(
            purchase.device.images,
            many=True,
            context={
                'request': self.context.get('request')
            }
        ).data
