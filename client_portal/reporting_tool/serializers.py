"""
Modules defines models serializers
"""
from django.contrib.auth.models import Group
from rest_framework import serializers

from reporting_tool.models import User


class GroupSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)

    class Meta:
        model = Group
        fields = ('name',)


class UserSerializer(serializers.Serializer):
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
        model = User

