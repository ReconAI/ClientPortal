"""
Reporting tool serializers range
"""
import functools
import json
from typing import List

import boto3
from botocore.client import BaseClient
from botocore.config import Config
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.db import models
from django.utils.module_loading import import_string
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.fields import CharField, IntegerField, ListField, empty
from rest_framework.serializers import ModelSerializer, ListSerializer, \
    BaseSerializer
from rest_framework.serializers import Serializer
from rest_framework.utils.serializer_helpers import ReturnDict

from recon_db_manager.models import Organization, DevicePurchase, RelevantData, \
    Project, TypeCode
from reporting_tool.forms.utils import SendEmailMixin
from shared.fields import FileField
from shared.models import User
from shared.serializers import ReadOnlySerializerMixin, DeviceImageSerializer


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

        self.s3_client.put_object(
            Body=file,
            Bucket=settings.AWS_CLIENT_PORTAL_BUCKET,
            Key=destination,
            Tagging="recon_owner=56"
        )

        return self.s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': settings.AWS_CLIENT_PORTAL_BUCKET,
                'Key': destination
            }
        )

    def __destination(self, file: ContentFile) -> str:
        return '{}/organization_{}/{}'.format(
            self.FILES_UPLOAD_KEY,
            self.context.get('organization').id,
            file.name
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
            [settings.INFO_EMAIL],
            'emails/feature_request_subject.txt',
            'emails/feature_request.html',
            validated_data=self.validated_data
        )

    def get_email_context(self, validated_data: dict, *args, **kwargs) -> dict:
        """
        :type validated_data: dict

        :rtype: dict
        """
        organization = self.context.get('organization')

        return {
            'files_attached': self.__upload_files(validated_data.get('files')),
            'feed_links': validated_data.get('sensor_feed_links', []),
            'description': validated_data.get('description', ''),
            'organization': organization,
            'organization_name': getattr(organization, 'name', '')
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
        method_name='process_price_without_vat'
    )
    price_with_vat = serializers.SerializerMethodField(
        method_name='process_price_with_vat'
    )
    total = serializers.SerializerMethodField(
        method_name='process_total'
    )
    images = serializers.SerializerMethodField(
        method_name='format_images'
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
        images = purchase.device.images if purchase.device else []

        return DeviceImageSerializer(
            images,
            many=True,
            context={
                'request': self.context.get('request')
            }
        ).data


class UserInvoiceSerializer(ModelSerializer):
    """
    User invoice serializer logic
    """
    cloud_cost = serializers.SerializerMethodField(
        method_name='format_cloud_cost'
    )
    license_fee = serializers.SerializerMethodField(
        method_name='format_license_fee'
    )
    total = serializers.SerializerMethodField(
        method_name='format_total'
    )

    USER_COST_HANDLER = 'shared.helpers.UserCostHandler'

    def __init__(self, instance=None, data=empty, user_license_fee: float = 0,
                 **kwargs):
        """
        :type user_license_fee: float
        :type instance: Optional[User]
        :type data: dict
        """
        super().__init__(instance=instance, data=data, **kwargs)

        self.__user_license_fee = user_license_fee
        self.__user_cost_handler = import_string(self.USER_COST_HANDLER)

    class Meta:
        """
        Set of fileds is to be displayed on onvoice
        """
        model = get_user_model()
        fields = ('id', 'fullname', 'cloud_cost', 'license_fee', 'total')

    def format_cloud_cost(self, user: User) -> float:
        """
        :type user: User

        :rtype: float
        """
        return round(
            self.__user_cost_handler(user, self.__user_license_fee).cloud_cost,
            2
        )

    def format_license_fee(self, user: User) -> float:
        """
        :type user: User

        :rtype: float
        """
        user_license_fee = self.__user_license_fee

        return round(
            self.__user_cost_handler(user, user_license_fee).license_fee,
            2
        )

    def format_total(self, user: User) -> float:
        """
        :type user: User

        :rtype: float
        """
        return round(
            self.__user_cost_handler(user, self.__user_license_fee).total,
            2
        )


class DefaultPaymentMethodSerializer(ReadOnlySerializerMixin, Serializer):
    """
    Default payment method modification serializer
    """

    is_card = serializers.BooleanField(required=True, allow_null=False)
    card_id = serializers.CharField(required=False)

    def update(self, instance: Organization,
               validated_data: dict) -> Organization:
        """
        :type instance: Organization
        :type validated_data: dict

        :rtype: Organization
        """
        is_card = validated_data.get('is_card')

        instance.is_invoice_payment_method = not is_card
        instance.save()

        return instance


class ProjectSerializer(ModelSerializer):
    class Meta:
        model = Project
        fields = (
            'id', 'name'
        )


class RelevantDataSerializer(ModelSerializer):
    sensor_id = serializers.IntegerField(source='edge_node_id')
    project_name = serializers.SerializerMethodField('format_project_name')
    event_object = serializers.SerializerMethodField('format_event_object')
    object_class = serializers.SerializerMethodField('format_object_class')
    vehicle_classification = serializers.SerializerMethodField('format_vehicle_classification')

    ambient_weather = serializers.SerializerMethodField('format_ambient_weather')
    road_weather = serializers.SerializerMethodField('format_road_weather')

    tagged_data = serializers.SerializerMethodField('format_tagged_data')
    license_plate_location = serializers.SerializerMethodField(
        'format_license_plate_location'
    )
    face_location = serializers.SerializerMethodField('format_face_location')
    cad_file_tag = serializers.SerializerMethodField('format_cad_file_tag')
    traffic_flow = serializers.SerializerMethodField('format_traffic_flow')

    class Meta:
        model = RelevantData
        fields = (
            'id', 'sensor_GPS_lat', 'sensor_GPS_long', 'location_x',
            'location_y', 'location_z', 'orient_theta', 'orient_phi',
            'timestamp', 'project_name', 'sensor_id', 'license_plate_number',
            'event_object', 'object_class', 'vehicle_classification',
            'traffic_flow', 'ambient_weather', 'road_weather',
            'stopped_vehicle_detection', 'pedestrian_flow', 'tagged_data',
            'license_plate_location', 'face_location', 'cad_file_tag'
        )

    @staticmethod
    def __related_model_attr(instance: RelevantData, related: str,
                             attr_name: str):
        attr = getattr(instance, related, None)

        if attr:
            return getattr(attr, attr_name)

        return None

    def __type_code(self, instance: RelevantData, related: str):
        return self.__related_model_attr(instance, related,
                                         'short_description')

    def __file(self, instance: RelevantData, related: str):
        return self.__related_model_attr(instance, related, 'link')

    @staticmethod
    def __json(instance: RelevantData, attr_name: str):
        return json.dumps(getattr(instance, attr_name))

    def format_traffic_flow(self, instance: RelevantData):
        return self.__json(instance, 'traffic_flow')

    @staticmethod
    def format_event_object(instance: RelevantData):
        if instance.event:
            return str(instance.EVENT_TYPE)

        return str(instance.OBJECT_TYPE)

    def format_project_name(self, instance: RelevantData):
        return self.__related_model_attr(instance, 'project', 'name')

    def format_vehicle_classification(self, instance: RelevantData):
        return self.__type_code(instance, 'vehicle_classification')

    def format_object_class(self, instance: RelevantData):
        return self.__type_code(instance, 'object_class')

    def format_ambient_weather(self, instance: RelevantData):
        return self.__type_code(instance, 'ambient_weather_condition')

    def format_road_weather(self, instance: RelevantData):
        return self.__type_code(instance, 'road_weather_condition')

    @staticmethod
    def format_tagged_data(instance: RelevantData) -> str:
        return instance.tagged_data.name

    def format_license_plate_location(self, instance: RelevantData):
        return self.__file(instance, 'license_plate')

    def format_face_location(self, instance: RelevantData):
        return self.__file(instance, 'face')

    def format_cad_file_tag(self, instance: RelevantData):
        return self.__file(instance, 'cad_file_tag')


class GeneratorListSerializer(ListSerializer):
    @property
    def data(self):
        data = self.instance

        iterable = data.all() if isinstance(data, models.Manager) else data

        for item in iterable:
            yield self.child.to_representation(item)


class RelevantDataGeneratorSeriralizer(RelevantDataSerializer):
    class Meta:
        model = RelevantData
        fields = (
            'id', 'sensor_GPS_lat', 'sensor_GPS_long', 'location_x',
            'location_y', 'location_z', 'orient_theta', 'orient_phi',
            'timestamp', 'project', 'sensor_id', 'license_plate_number',
            'event_object', 'object_class', 'vehicle_classification',
            'traffic_flow', 'ambient_weather', 'road_weather',
            'stopped_vehicle_detection', 'pedestrian_flow', 'tagged_data',
            'license_plate_location', 'face_location', 'cad_file_tag'
        )
        list_serializer_class = GeneratorListSerializer


class RelevantDataGPSSerializer(ModelSerializer):
    lat = serializers.FloatField(
        required=True, allow_null=False,max_value=90,
        min_value=-90, source='sensor_GPS_lat'
    )
    long = serializers.FloatField(
        required=True, allow_null=False, max_value=180,
        min_value=-180, source='sensor_GPS_long'
    )

    class Meta:
        model = RelevantData
        fields = ('lat', 'long')


class TypeCodeSerializer(ModelSerializer):
    class Meta:
        model = TypeCode
        fields = ('value', 'short_description')


class HeatMapSerializer(ReadOnlySerializerMixin, Serializer):
    sensor_GPS_lat = serializers.FloatField(required=True)
    sensor_GPS_long = serializers.FloatField(required=True)
    number_of_objects = serializers.IntegerField(required=True)
