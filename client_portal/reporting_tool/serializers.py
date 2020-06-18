"""
Modules defines models serializers
"""
from django.contrib.auth.models import Group
from django.db.models import Model
from rest_framework import serializers

from reporting_tool.models import User


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
