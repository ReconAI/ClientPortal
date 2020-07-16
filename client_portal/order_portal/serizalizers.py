"""
Order portal serializers range
"""
import base64
from typing import List

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.core.validators import FileExtensionValidator
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.fields import ListField, CharField, ImageField
from rest_framework.serializers import ListSerializer, \
    Serializer
from rest_framework.serializers import ModelSerializer

from order_portal.fields import ImgField
from recon_db_manager.models import Category, Manufacturer, Device, DeviceImage


class CategorySerializer(ModelSerializer):
    """
    Category serializer for displays
    """

    manufacturers_count = serializers.SerializerMethodField('get_manufacturers_cnt')

    class Meta:
        """
        Id and name should be shown
        """
        model = Category
        fields = ('id', 'name', 'manufacturers_count')

    @staticmethod
    def get_manufacturers_cnt(category: Category) -> int:
        return category.manufacturers_count


class SynchronizeCategorySerializer(ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True, min_value=1)

    class Meta:
        """
        Id and name should be shown
        """
        model = Category
        fields = ('id', 'name')


class CategoryCollectionSerializer(Serializer):
    """
    Category collection `create` serializer
    """
    categories = ListSerializer(child=SynchronizeCategorySerializer(), allow_null=False,
                                allow_empty=False)

    def validate_categories(self, categories: List[dict]) -> List[dict]:
        incoming_ids = self.__categories_for_update_ids(categories)

        if incoming_ids and len(Category.objects.filter(pk__in=incoming_ids)) != len(incoming_ids):
            raise ValidationError('Not all categories passed are present')

        if self.__are_categories_assigned(categories):
            raise ValidationError('You try to delete categories attached to manufacturers')

        return categories

    def save(self, **kwargs):
        assert hasattr(self, '_errors'), (
            'You must call `.is_valid()` before calling `.save()`.'
        )

        assert not self.errors, (
            'You cannot call `.save()` on a serializer with invalid data.'
        )

        # Guard against incorrect use of `serializer.save(commit=False)`
        assert 'commit' not in kwargs, (
            "'commit' is not a valid keyword argument to the 'save()' method. "
            "If you need to access data before committing to the database then "
            "inspect 'serializer.validated_data' instead. "
            "You can also pass additional keyword arguments to 'save()' if you "
            "need to set extra attributes on the saved model instance. "
            "For example: 'serializer.save(owner=request.user)'.'"
        )

        assert not hasattr(self, '_data'), (
            "You cannot call `.save()` after accessing `serializer.data`."
            "If you need to access data before committing to the database then "
            "inspect 'serializer.validated_data' instead. "
        )

        validated_categories = self.validated_data['categories']

        self.delete(validated_categories)
        created = self.create(self.__categories_for_insert(validated_categories))
        updated = self.update(self.__categories_for_update(validated_categories))

        return created + updated

    def create(self, categories_list: List[dict]) -> List[Category]:
        """
        :rtype validated_data: Dict[str, List[dict]]

        :rtype: List[Category]
        """
        return Category.objects.bulk_create([
            Category(**category)
            for category
            in categories_list
        ])

    def update(self, categories_list: List[dict]):
        categories = []

        for category in categories_list:
            category = Category(**category)
            category.save()
            categories.append(category)

        return categories

    def delete(self, validated_data):
        ids_for_delete = self.__categories_for_delete_ids(validated_data)

        return Category.objects.filter(pk__in=ids_for_delete).delete()

    @property
    def errors(self) -> list:
        errors = {}
        category_errors = super().errors.get('categories', [])

        for category_error in category_errors:
            if category_error:
                for error_attr, error_msg in category_error.items():
                    attr_errors = errors.get(error_attr, [])
                    attr_errors += error_msg
                    errors[error_attr] = attr_errors

        return errors

    def __are_categories_assigned(self, categories):
        categories_for_delete = self.__categories_for_delete_ids(categories)

        return Category.objects.select_related(
            'manufacturer_set'
        ).filter(
            manufacturer__categories__in=categories_for_delete
        ).exists()

    @staticmethod
    def __categories_for_update(categories_list: List[dict]):
        return [
            category
            for category
            in categories_list
            if 'id' in category
        ]

    def __categories_for_update_ids(self, categories_list: List[dict]):
        return set([
            category['id']
            for category
            in self.__categories_for_update(categories_list)
        ])

    def __categories_for_delete_ids(self, categories_list: List[dict]):
        existing_ids = self.__categories_for_update_ids(categories_list)

        return list(Category.objects.exclude(pk__in=existing_ids).values_list('pk', flat=True))

    @staticmethod
    def __categories_for_insert(categories_list: List[dict]):
        return [
            category
            for category
            in categories_list
            if 'id' not in category
        ]


class ReadManufacturerSerializer(ModelSerializer):
    """
    Manufacturer serializer for show
    """
    categories = SynchronizeCategorySerializer(many=True, allow_null=True)
    category_ids = serializers.ListSerializer

    class Meta:
        """
        Manufacturer name and related categories must be displayed
        """
        model = Manufacturer
        fields = ('id', 'name', 'address', 'contact_person', 'order_email',
                  'phone', 'support_email', 'vat', 'categories')


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
        fields = ('name', 'address', 'contact_person', 'order_email', 'phone',
                  'support_email', 'vat', 'category_ids')

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


class WriteDeviceSerializer(ModelSerializer):
    manufacturer = serializers.PrimaryKeyRelatedField(
        queryset=Manufacturer.objects.all()
    )
    seo_keywords = serializers.ListSerializer(
        child=CharField(required=True, allow_blank=False)
    )
    images = serializers.ListSerializer(
        child=ImgField(
            allow_empty_file=False,
            validators=[
                FileExtensionValidator(allowed_extensions=['jpeg', 'jpg', 'png'])
            ]
        )
    )

    class Meta:
        model = Device
        fields = (
            'name', 'description', 'manufacturer', 'buying_price',
            'sales_price', 'product_number', 'seo_title', 'seo_keywords',
            'seo_description', 'images'
        )

    @staticmethod
    def validate_seo_keywords(keywords: List[str]) -> str:
        return ', '.join(keywords)

    def create(self, validated_data):
        images = validated_data.pop('images')
        device = super().create(validated_data)

        for image in images:
            dvi = DeviceImage(device=device)
            dvi.save()
            dvi.path = image
            dvi.save()

        return device


class DeviceImageSerializer(ModelSerializer):
    class Meta:
        model = DeviceImage
        fields = ('id', 'path')


class ReadDeviceSerializer(ModelSerializer):
    seo_keywords = serializers.SerializerMethodField('format_seo_keywords')
    manufacturer = ReadManufacturerSerializer()
    images = DeviceImageSerializer(many=True)

    class Meta:
        model = Device
        fields = (
            'id', 'name', 'description', 'manufacturer', 'buying_price',
            'sales_price', 'product_number', 'seo_title', 'seo_keywords',
            'seo_description', 'published', 'images', 'created_dt'
        )

    @staticmethod
    def format_seo_keywords(device: Device) -> List[str]:
        return device.seo_keywords.split(', ')
