"""
Order portal serializers range
"""
from typing import List, Tuple

from django.core.files.base import ContentFile
from django.core.validators import FileExtensionValidator, MaxLengthValidator
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.exceptions import ValidationError, ErrorDetail
from rest_framework.fields import ListField, CharField, IntegerField
from rest_framework.serializers import ListSerializer, \
    Serializer
from rest_framework.serializers import ModelSerializer

from order_portal.fields import ImgField
from recon_db_manager.models import Category, Manufacturer, Device, DeviceImage


class CategorySerializer(ModelSerializer):
    """
    Category serializer for displays
    """

    manufacturers_count = serializers.SerializerMethodField(
        'get_manufacturers_cnt'
    )

    class Meta:
        """
        Id and name should be shown
        """
        model = Category
        fields = ('id', 'name', 'manufacturers_count')

    @staticmethod
    def get_manufacturers_cnt(category: Category) -> int:
        """
        :type category: Category

        :rtype: int
        """
        return category.manufacturers_count


class SynchronizeCategorySerializer(ModelSerializer):
    """
    Category serializer for create operation
    """

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
    categories = ListSerializer(
        child=SynchronizeCategorySerializer(),
        allow_null=False,
        allow_empty=False
    )

    def validate_categories(self, categories: List[dict]) -> List[dict]:
        """
        Validates incoming categories data

        :type categories: List[dict]

        :rtype: List[dict]
        """
        incoming_ids = self.__categories_for_update_ids(categories)

        len_incoming = len(Category.objects.filter(pk__in=incoming_ids))

        # All incoming categories should be present in db
        if incoming_ids and len_incoming != len(incoming_ids):
            raise ValidationError('Not all categories passed are present')

        if self.__are_categories_assigned(categories):
            raise ValidationError(
                'You try to delete categories attached to manufacturers',
                code='delete_prohibition'
            )

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
            "If you need to access data before committing to the database "
            "then inspect 'serializer.validated_data' instead. "
            "You can also pass additional keyword arguments to 'save()' if "
            "you need to set extra attributes on the saved model instance. "
            "For example: 'serializer.save(owner=request.user)'.'"
        )

        assert not hasattr(self, '_data'), (
            "You cannot call `.save()` after accessing `serializer.data`.If "
            "you need to access data before committing to the database then "
            "inspect 'serializer.validated_data' instead. "
        )

        validated_categories = self.validated_data['categories']

        self.delete(validated_categories)
        created = self.create(
            self.__categories_for_insert(validated_categories)
        )
        updated = self.update(
            self.__categories_for_update(validated_categories)
        )

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

    def delete(self, validated_data: dict) -> Tuple[int, dict]:
        """
        :type validated_data: dict

        :rtype: Tuple[int, dict]
        """
        ids_for_delete = self.__categories_for_delete_ids(validated_data)

        return Category.objects.filter(pk__in=ids_for_delete).delete()

    @property
    def errors(self) -> list:
        errors = {}
        category_errors = super().errors.get('categories', [])

        for category_error in category_errors:
            if isinstance(category_error, dict):
                for error_attr, error_msg in category_error.items():
                    attr_errors = errors.get(error_attr, [])
                    attr_errors += error_msg
                    errors[error_attr] = attr_errors
            elif isinstance(category_error, ErrorDetail):
                return super().errors

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
        return {
            category['id']
            for category
            in self.__categories_for_update(categories_list)
        }

    def __categories_for_delete_ids(self, categories_list: List[dict]):
        existing_ids = self.__categories_for_update_ids(categories_list)

        return list(Category.objects.exclude(
            pk__in=existing_ids
        ).values_list(
            'pk', flat=True
        ))

    @staticmethod
    def __categories_for_insert(categories_list: List[dict]):
        return [
            category
            for category
            in categories_list
            if 'id' not in category
        ]


class BaseManufacturerSerializer(ModelSerializer):
    """
    Condensed view of manufacturer
    """

    categories = SynchronizeCategorySerializer(many=True, allow_null=True)

    class Meta:
        """
        Manufacturer name and related categories must be displayed
        """
        model = Manufacturer
        fields = ('id', 'name', 'categories')


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


class DeviceListSerializer(ModelSerializer):
    """
    Device list serializer
    """

    images = DeviceImageSerializer(many=True)

    class Meta:
        """
        Limited range of fields can be shown on the list page
        """
        model = Device
        fields = ('id', 'name', 'description',
                  'sales_price', 'images', 'created_dt')


class DeviceItemSerializer(DeviceListSerializer):
    """
    Device item fields specification
    """

    images = DeviceImageSerializer(many=True)
    manufacturer = BaseManufacturerSerializer()

    class Meta:
        """
        List of attributes are to be shown on device item page
        """
        model = Device
        fields = ('id', 'name', 'description', 'sales_price', 'product_number',
                  'images', 'seo_title', 'seo_keywords', 'seo_description',
                  'manufacturer')


class CreateDeviceSerializer(ModelSerializer):
    """
    Create device serializer
    """

    MAX_IMAGES = 5

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
                FileExtensionValidator(
                    allowed_extensions=['jpeg', 'jpg', 'png']
                )
            ]
        ),
        validators=[
            MaxLengthValidator(MAX_IMAGES)
        ]
    )

    class Meta:
        """
        All of the device fields are updatable
        """
        model = Device
        fields = (
            'name', 'description', 'manufacturer', 'buying_price',
            'sales_price', 'product_number', 'seo_title', 'seo_keywords',
            'seo_description', 'images'
        )

    @staticmethod
    def validate_seo_keywords(keywords: List[str]) -> str:
        """
        Keywords list should be joined to string

        :type keywords: List[str]

        :rtype: str
        """
        return ', '.join(keywords)

    @staticmethod
    def _upload_images(device: Device, images: List[ContentFile]):
        for image in images:
            dvi = DeviceImage(device=device)
            dvi.save()
            dvi.path = image
            dvi.save()

    def create(self, validated_data):
        images = validated_data.pop('images')
        device = super().create(validated_data)

        self._upload_images(device, images)

        return device


class UpdateDeviceSerializer(CreateDeviceSerializer):
    """
    Device update serializer
    """

    delete_images = ListSerializer(
        child=IntegerField(min_value=1),
        allow_null=True,
        allow_empty=True,
        required=False
    )

    class Meta:
        """
        All of the device fields are updatable
        """
        model = Device
        fields = (
            'name', 'description', 'manufacturer', 'buying_price',
            'sales_price', 'product_number', 'seo_title', 'seo_keywords',
            'seo_description', 'images', 'delete_images'
        )

    def update(self, instance: Device, validated_data: dict) -> Device:
        """
        After instance update some images should be deleted if necessary
        and new ones are to be uploaded

        :type instance: Device
        :type validated_data: dict

        :rtype: Device
        """
        images = validated_data.pop('images')
        delete_images = validated_data.pop('delete_images')

        device = super().update(instance, validated_data)
        device.images.filter(pk__in=delete_images).delete()
        self._upload_images(device, images)

        return device

    def validate_delete_images(self, images: List[int]) -> List[int]:
        """
        After images deletion and new ones upload user can not have
        more than `MAX_IMAGES`

        :type images: List[int]

        :rtype: List[int]

        :raise: ValidationError
        """
        final_imgs_count = (
            len(self.initial_data.get('images', []))
            + len(self.instance.images.all())
            - len(images)
        )

        if final_imgs_count > self.MAX_IMAGES:
            error_msg = _('You can not load mor than {} image(s)').format(
                self.MAX_IMAGES
            )

            raise ValidationError(error_msg)

        return images


class FullViewDeviceSerializer(ModelSerializer):
    """
    Device serializer dedicated to device data modification
    """

    seo_keywords = serializers.SerializerMethodField('format_seo_keywords')
    images = DeviceImageSerializer(many=True)

    class Meta:
        """
        All of the fields are editable
        """
        model = Device
        fields = (
            'id', 'name', 'description', 'manufacturer_id', 'buying_price',
            'sales_price', 'product_number', 'seo_title', 'seo_keywords',
            'seo_description', 'images'
        )

    @staticmethod
    def format_seo_keywords(device: Device) -> List[str]:
        """
        Converts keyword string to list

        :type device: Device

        :rtype: List[str]
        """
        return device.seo_keywords.split(', ')
