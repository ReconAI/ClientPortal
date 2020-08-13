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

from recon_db_manager.models import Organization, DeviceImage


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
            'inv_address', 'inv_phone', 'inv_email'
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
