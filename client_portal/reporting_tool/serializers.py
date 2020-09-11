"""
Reporting tool serializers range
"""
import functools
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
from rest_framework.serializers import ModelSerializer, ListSerializer
from rest_framework.serializers import Serializer
from rest_framework.utils.serializer_helpers import ReturnDict

from recon_db_manager.models import Organization, DevicePurchase,\
    RelevantData, Project, TypeCode, DeviceInstance
from reporting_tool.forms.utils import SendEmailMixin
from reporting_tool.utils import FeatureRequestUploader
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
            file_uploader = FeatureRequestUploader(
                file.open('r').file.getvalue(),
                self.FILES_UPLOAD_KEY,
                self.context.get('organization').id
            )

            file_public_links.append(
                file_uploader.upload_and_get_link()
            )

        return file_public_links

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
    """
    Project serializer
    """
    class Meta:
        """
        Project serializer meta class
        """
        model = Project
        fields = (
            'id', 'name'
        )


class RelevantDataSerializer(ModelSerializer):
    """
    Reevant data serializer
    """
    sensor_id = serializers.IntegerField(source='edge_node_id')
    project_name = serializers.CharField(source='project.name')
    event_object = serializers.SerializerMethodField('format_event_object')
    object_class = serializers.CharField(
        source='object_class.short_description', default=None
    )
    vehicle_classification = serializers.CharField(
        source='vehicle_classification.short_description', default=None
    )
    ambient_weather = serializers.CharField(
        source='ambient_weather_condition.short_description', default=None
    )
    road_weather = serializers.CharField(
        source='road_weather_condition.short_description', default=None
    )

    tagged_data = serializers.CharField(
        source='tagged_data.name', default=None
    )
    license_plate_location = serializers.CharField(
        source='license_plate.link', default=None
    )
    face_location = serializers.CharField(source='face.link', default=None)
    cad_file_tag = serializers.CharField(
        source='cad_file_tag.link', default=None
    )
    road_temperature = serializers.FloatField()
    ambient_temperature = serializers.FloatField()
    pedestrian_flow_transit_method = serializers.SerializerMethodField(
        'format_pedestrian_flow_transit_method'
    )
    pedestrian_flow_number_of_objects = serializers.IntegerField(
        source='pedestrian_flow.NumberOfObjects', default=None
    )

    __pedestrian_transit_methods = None

    class Meta:
        """
        Reevant data serializer settings
        """
        model = RelevantData
        fields = (
            'id', 'sensor_GPS_lat', 'sensor_GPS_long', 'location_x',
            'location_y', 'location_z', 'orient_theta', 'orient_phi',
            'timestamp', 'project_name', 'sensor_id', 'license_plate_number',
            'event_object', 'object_class', 'vehicle_classification',
            'ambient_weather', 'road_weather', 'stopped_vehicle_detection',
            'tagged_data', 'license_plate_location', 'face_location',
            'cad_file_tag', 'road_temperature', 'ambient_temperature',
            'traffic_flow', 'pedestrian_flow_number_of_objects',
            'pedestrian_flow_transit_method'
        )

    @staticmethod
    def format_event_object(instance: RelevantData) -> str:
        """
        :type instance: RelevantData

        :rtype: str
        """
        if instance.event:
            return str(instance.EVENT_TYPE)

        return str(instance.OBJECT_TYPE)

    @property
    def _pedestrian_transit_methods(self) -> dict:
        """
        Lazy pedestrian transit methods load

        :rtype: dict
        """
        if self.__pedestrian_transit_methods is None:
            self.__pedestrian_transit_methods = dict(TypeCode.objects.filter(
                type_name=TypeCode.PEDESTRIAN_TRANSIT_TYPE
            ).values_list('value', 'short_description'))

        return self.__pedestrian_transit_methods

    def pedestrian_method_by_code(self, code: str) -> str:
        """
        :type code: str

        :rtype: str
        """
        return self._pedestrian_transit_methods.get(code, '')

    def format_pedestrian_flow_transit_method(self,
                                              instance: RelevantData) -> str:
        """
        :type instance: RelevantData

        :rtype: str
        """
        return self.pedestrian_method_by_code(
            instance.pedestrian_flow.get('TransitMethod')
        )


class GeneratorListSerializer(ListSerializer):
    """
    The serializer's data will be returned as generator
    """
    @property
    def data(self):
        data = self.instance

        iterable = data.all() if isinstance(data, models.Manager) else data

        for item in iterable:
            yield self.child.to_representation(item)

    def update(self, instance, validated_data):
        pass


class RelevantDataGeneratorSeriralizer(RelevantDataSerializer):
    """
    Relevant data serializer with plain level fields.
    Data will be returned as generator
    """
    traffic_flow_number_of_objects = serializers.IntegerField(
        source='traffic_flow.NumberOfObjects', default=None
    )
    traffic_flow_observation_start_dt = serializers.DateTimeField(
        source='traffic_flow.ObservationStartDT', default=None
    )
    traffic_flow_observation_end_dt = serializers.DateTimeField(
        source='traffic_flow.ObservationEndDT', default=None
    )
    traffic_flow_number_of_directions = serializers.IntegerField(
        source='traffic_flow.NumberOfDirections', default=None
    )
    traffic_flow_directions_statistics = serializers.IntegerField(
        source='traffic_flow.DirectionsStatistics', default=None
    )

    class Meta:
        """
        Relevant data serializer settings
        """
        model = RelevantData
        fields = (
            'id', 'sensor_GPS_lat', 'sensor_GPS_long', 'location_x',
            'location_y', 'location_z', 'orient_theta', 'orient_phi',
            'timestamp', 'project_name', 'sensor_id', 'license_plate_number',
            'event_object', 'object_class', 'vehicle_classification',
            'ambient_weather', 'road_weather', 'stopped_vehicle_detection',
            'tagged_data', 'license_plate_location', 'face_location',
            'cad_file_tag', 'road_temperature', 'ambient_temperature',
            'pedestrian_flow_transit_method',
            'pedestrian_flow_number_of_objects',
            'traffic_flow_number_of_objects',
            'traffic_flow_observation_end_dt',
            'traffic_flow_observation_start_dt',
            'traffic_flow_number_of_directions',
            'traffic_flow_directions_statistics'
        )
        list_serializer_class = GeneratorListSerializer


class TypeCodeSerializer(ModelSerializer):
    """
    Type code serializer
    """
    class Meta:
        """
        Type code serializer specification
        """
        model = TypeCode
        fields = ('value', 'short_description')


class HeatMapSerializer(ReadOnlySerializerMixin, Serializer):
    """
    Heat map serializer
    """

    sensor_GPS_lat = serializers.FloatField(required=True)
    sensor_GPS_long = serializers.FloatField(required=True)
    number_of_objects = serializers.IntegerField(required=True)


class SensorGPSSerializer(ModelSerializer):
    """
    Sensor set GPS serializer
    """
    lat = serializers.FloatField(
        required=True, allow_null=False, max_value=90,
        min_value=-90, source='gps_lat'
    )
    long = serializers.FloatField(
        required=True, allow_null=False, max_value=180,
        min_value=-180, source='gps_long'
    )

    class Meta:
        """
        Sensor set GPS serializer specification
        """
        model = DeviceInstance
        fields = ('lat', 'long')


class SensorSerializer(SensorGPSSerializer):
    """
    Sensor serializer
    """
    class Meta:
        """
        Sensor specification
        """
        model = DeviceInstance
        fields = ('id', 'serial', 'gps_lat', 'gps_long')


class RelevantDataGPSSerializer(ModelSerializer):
    """
    Relevant data GPS serializer
    """
    lat = serializers.FloatField(source='sensor_GPS_lat')
    long = serializers.FloatField(source='sensor_GPS_long')

    class Meta:
        """
        Relevant serializer specification
        """
        model = RelevantData
        fields = ('lat', 'long')
