"""
Modules defines models serializers
"""
from typing import Type, List, Union

from django.contrib.auth.models import Group
from django.db.models import Model
from django.forms import Form
from drf_braces.serializers.form_serializer import FormSerializer
from rest_framework import serializers

from recon_db_manager.models import Organization
from reporting_tool.models import User


def form_to_formserializer(
        form: Union[Type[Form], type]) -> Union[Type[FormSerializer], type]:
    """
    Converts form to serializer

    :type form: Type[Form]

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
        *forms: List[Type[Form]]) -> Union[Type[FormSerializer], type]:
    """
    Combines multiple forms into seriallizer

    :type forms: List[Type[Form]]

    :rtype: Union[Type[FormSerializer], type]
    """

    fields = {}

    for form in forms:
        fields = {
            **fields,
            **getattr(form, 'all_base_fields', form.base_fields)
        }

    return form_to_formserializer(type('Form', (Form, ), {**fields}))


class ReadOnlySerializer(serializers.ModelSerializer):
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


class GroupSerializer(ReadOnlySerializer):
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


class OrganizationSerializer(ReadOnlySerializer):
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


class UserSerializer(ReadOnlySerializer):
    """
    Serializes user data
    """

    group = GroupSerializer()

    class Meta:
        """
        User is serializer's model
        """
        model = User
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
        model = User
        fields = (
            'id', 'firstname', 'lastname', 'username', 'address',
            'phone', 'email', 'created_dt', 'user_level', 'is_active',
            'group', 'organization'
        )
