"""
Modules defines models serializers
"""
from typing import Type, List, Union

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.db.models import Model
from django.forms import Form, BaseForm
from django.utils.translation import gettext_lazy as _
from drf_braces.serializers.form_serializer import FormSerializer
from rest_framework import serializers
from rest_framework.authtoken.serializers import \
    AuthTokenSerializer as AuthTokenSerializerBase
from rest_framework.serializers import ModelSerializer
from rest_framework.utils.serializer_helpers import ReturnDict

from recon_db_manager.models import Organization, DeviceImage, DevicePurchase
from shared.helpers import PriceWithTax, Price


def form_to_formserializer(form: Union[Type[BaseForm], type]) \
        -> Union[Type[FormSerializer], type]:
    """
    Converts form to serializer

    :type form: Type[BaseForm]

    :rtype: Union[Type[FormSerializer], type]
    """
    meta_class = type('Meta', (), {
        'form': form
    })

    form_serializer = type('Serializer', (FormSerializer, ), {
        'Meta': meta_class
    })

    return form_serializer


def forms_to_formserializer(
        *forms: List[Type[BaseForm]]) -> Union[Type[FormSerializer], type]:
    """
    Combines multiple forms into seriallizer

    :type forms: List[Type[BaseForm]]

    :rtype: Union[Type[FormSerializer], type]
    """

    fields = {}

    for form in forms:
        fields = {
            **fields,
            **getattr(form, 'all_base_fields', form.base_fields)
        }

    return form_to_formserializer(type('Form', (Form, ), {**fields}))


class ReadOnlySerializerMixin:
    """
    Serializer doesn't let write
    """
    def update(self, instance: Model, validated_data: dict):
        """
        :type instance: Model
        :type validated_data: dict
        """
    def create(self, validated_data: dict):
        """
        :type validated_data: dict
        """


class GroupSerializer(ReadOnlySerializerMixin, serializers.ModelSerializer):
    """
    Serializes user group data
    """
    name = serializers.CharField(max_length=255)

    class Meta:
        """
        Group is serializer's model
        """
        model = Group
        fields = ('name',)


class OrganizationSerializer(ReadOnlySerializerMixin,
                             serializers.ModelSerializer):
    """
    Represents organization as serialized data
    """

    class Meta:
        """
        All of the fields except id are counted in
        """
        model = Organization
        fields = (
            'name', 'vat', 'main_firstname', 'main_lastname', 'main_address',
            'main_phone', 'main_email', 'inv_firstname', 'inv_lastname',
            'inv_address', 'inv_phone', 'inv_email',
            'is_invoice_payment_method'
        )


class IaMUserSerializer(ReadOnlySerializerMixin, serializers.ModelSerializer):
    """
    IaM user serializer
    """
    class Meta:
        """
        User is serializer's model
        """
        model = get_user_model()
        fields = (
            'id', 'firstname', 'lastname', 'username', 'address',
            'phone', 'email', 'created_dt', 'is_active'
        )


class UserSerializer(ReadOnlySerializerMixin, serializers.ModelSerializer):
    """
    Serializes user data
    """

    group = GroupSerializer()

    class Meta:
        """
        User is serializer's model
        """
        model = get_user_model()
        fields = (
            'id', 'firstname', 'lastname', 'username', 'address',
            'phone', 'email', 'created_dt', 'user_level', 'is_active',
            'group',
        )


class UserOrganizationSerializer(UserSerializer):
    """
    Serialized user data extended with organization associated
    """
    organization = OrganizationSerializer()

    class Meta:
        """
        User is serializer's model
        """
        model = get_user_model()
        fields = (
            'id', 'firstname', 'lastname', 'username', 'address',
            'phone', 'email', 'created_dt', 'user_level', 'is_active',
            'group', 'organization'
        )


class AuthTokenSerializer(AuthTokenSerializerBase):
    """
    Handles users' empty passwords
    """
    def validate(self, attrs):
        try:
            return super().validate(attrs)
        except TypeError:
            msg = _('Unable to log in with provided credentials.')
            raise serializers.ValidationError(msg, code='authorization')

    def create(self, validated_data):
        """
        Create is prohibited for the Token
        """

    def update(self, instance, validated_data):
        """
        Update is prohibited for the Token
        """


class DeviceImageSerializer(ModelSerializer):
    """
    Image serializer definition
    """

    class Meta:
        """
        Id and path are to be exposed
        """
        model = DeviceImage
        fields = ('id', 'path')


class TrialSerializer(ModelSerializer):
    """
    Trial serializer definition
    """
    class Meta:
        """
        Trial data expiration is to be exposed
        """
        model = Organization
        fields = ('trial_expires_on',)


class OrderSerializer(ModelSerializer):
    """
    Order item serializer
    """
    payment_id = serializers.CharField(source='purchase.payment_id')
    price_without_vat = serializers.FloatField(source='device_price')
    price_with_vat = serializers.SerializerMethodField(
        method_name='process_price_with_vat'
    )
    total = serializers.SerializerMethodField(
        method_name='process_total'
    )
    images = serializers.SerializerMethodField(
        method_name='format_images'
    )
    created_dt = serializers.DateTimeField(source='purchase.created_dt')

    class Meta:
        """
        Device purchase fields list definition
        """
        model = DevicePurchase
        fields = ('device_id', 'payment_id', 'device_name',
                  'price_without_vat', 'price_with_vat', 'device_cnt',
                  'total', 'images', 'created_dt')

    @staticmethod
    def process_price_with_vat(purchase: DevicePurchase) -> float:
        """
        :type purchase: DevicePurchase

        :rtype: float
        """
        return round(PriceWithTax(
            Price(purchase.device_price),
            purchase.purchase.vat
        ).as_price(), 2)

    def process_total(self, purchase: DevicePurchase) -> float:
        """
        Returns total in number with floating point

        :type purchase: DevicePurchase

        :rtype: float
        """
        return self.process_price_with_vat(purchase) * purchase.device_cnt

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
