from typing import List

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.fields import ListField
from rest_framework.serializers import ModelSerializer

from recon_db_manager.models import Category, Manufacturer, Device


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name',)


class ReadManufacturerSerializer(ModelSerializer):
    categories = CategorySerializer(many=True, allow_null=True)
    category_ids = serializers.ListSerializer

    class Meta:
        model = Manufacturer
        fields = ('id', 'name', 'categories')


class WriteManufacturerSerializer(ModelSerializer):
    category_ids = ListField(
        child=serializers.IntegerField(min_value=1),
        allow_empty=False,
        min_length=1,
        max_length=None
    )

    class Meta:
        model = Manufacturer
        fields = ('name', 'category_ids')

    @staticmethod
    def validate_category_ids(category_ids: List[int]):
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


class ReadDeviceSerializer(ModelSerializer):
    seo_keywords = serializers.SerializerMethodField('format_seo_keywords')
    manufacturer = ReadManufacturerSerializer()

    class Meta:
        model = Device
        fields = (
            'id', 'name', 'description', 'manufacturer', 'buying_price',
            'sales_price', 'product_number', 'seo_title', 'seo_keywords',
            'seo_description', 'published', 'images', 'created_dt'
        )

    def format_seo_keywords(self, device: Device) -> List[str]:
        return device.seo_keywords.split(', ')
