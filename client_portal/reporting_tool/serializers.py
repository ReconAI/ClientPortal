"""
Modules defines models serializers
"""
from typing import Type

from django.contrib.auth.models import Group
from django.db.models import Model
from django.forms import ModelForm
from drf_braces.serializers.form_serializer import FormSerializer
from rest_framework import serializers

from reporting_tool.models import User


def form_to_formserializer(form: Type[ModelForm]):
    meta_class = type('Meta', (), {
        'form': form
    })

    form_serializer = type('Serializer', (FormSerializer, ), {
        'Meta': meta_class
    })

    return form_serializer


class ReadOnlySerializer(serializers.Serializer):
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


class UserSerializer(ReadOnlySerializer):
    """
    Serializes user data
    """
    id = serializers.IntegerField()
    firstname = serializers.CharField(max_length=255)
    lastname = serializers.CharField(max_length=255)
    username = serializers.CharField(max_length=255)
    address = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    created_dt = serializers.DateTimeField()
    user_level = serializers.CharField(max_length=3)
    is_active = serializers.BooleanField()
    user_group = GroupSerializer()

    class Meta:
        """
        User is serializer's model
        """
        model = User
