"""
Modules defines models serializers
"""
from rest_framework import serializers


class UserSerializer(serializers.Serializer):
    """
    Serializes user data
    """
    id = serializers.IntegerField()
    # organization = models.ForeignKey(Organization
    # models.DO_NOTHING, db_column='organizationId')
    firstname = serializers.CharField(max_length=200)
    lastname = serializers.CharField(max_length=200)
    address = serializers.CharField(max_length=200)
    phone = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    created_dt = serializers.DateTimeField()
    user_level = serializers.CharField(max_length=3)
    is_active = serializers.BooleanField()
