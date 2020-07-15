"""
Order portal serializers range
"""

from typing import List, Dict

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.fields import ListField
from rest_framework.serializers import ListSerializer, \
    Serializer
from rest_framework.serializers import ModelSerializer

from recon_db_manager.models import Category, Manufacturer


class CategorySerializer(ModelSerializer):
    """
    Category serializer for displays
    """
    class Meta:
        """
        Id and name should be shown
        """
        model = Category
        fields = ('id', 'name',)


class CategoryCollectionSerializer(Serializer):
    """
    Category collection `create` serializer
    """
    categories = ListSerializer(child=CategorySerializer(), allow_null=False,
                                allow_empty=False)

    def create(self, validated_data: Dict[str, List[dict]]) -> List[Category]:
        """
        :rtype validated_data: Dict[str, List[dict]]

        :rtype: List[Category]
        """
        return [
            Category.objects.create(**category_data)
            for category_data
            in validated_data.get('categories', [])
        ]

    def update(self, instance: Category, validated_data):
        """
        Update is not valid for the serializer

        :type instance: Category
        :type validated_data: dict
        """


class ReadManufacturerSerializer(ModelSerializer):
    """
    Manufacturer serializer for show
    """
    categories = CategorySerializer(many=True, allow_null=True)
    category_ids = serializers.ListSerializer

    class Meta:
        """
        Manufacturer name and related categories must be displayed
        """
        model = Manufacturer
        fields = ('name', 'categories')


class WriteManufacturerSerializer(ModelSerializer):
    """
    Create/Update Manufacturer serializer
    """
    category_ids = ListField(
        child=serializers.IntegerField(min_value=1),
        allow_empty=False,
        min_length=1,
        max_length=None
    )

    class Meta:
        """
        Name and categories are required for the creation process
        """
        model = Manufacturer
        fields = ('name', 'category_ids')

    @staticmethod
    def validate_category_ids(category_ids: List[int]) -> List[Category]:
        """
        All af the categories are to be present in the db

        :type category_ids: List[int]

        :rtype: List[Category]
        """
        category_ids = set(category_ids)

        categories = Category.objects.filter(id__in=category_ids).all()

        if category_ids and len(categories) != len(category_ids):
            raise ValidationError("Some of passed categories does not exist")

        return categories

    def create(self, validated_data):
        categories = validated_data.pop('category_ids')

        manufacturer = super().create(validated_data)
        manufacturer.categories.set(categories)

        return manufacturer

    def update(self, instance, validated_data):
        categories = validated_data.pop('category_ids')

        manufacturer = super().update(instance, validated_data)
        manufacturer.categories.set(categories)

        return manufacturer
