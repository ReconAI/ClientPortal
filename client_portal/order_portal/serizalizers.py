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


class SynchronizeCategorySerializer(CategorySerializer):
    id = serializers.IntegerField(required=False, allow_null=True, min_value=1)


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
        self.create(self.__categories_for_insert(validated_categories))
        self.update(self.__categories_for_update(validated_categories))

        return self.validated_data.items()

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
        return Category.objects.bulk_update([
            Category(**category)
            for category
            in categories_list
        ], ['name'])


    def delete(self, validated_data):
        ids_for_delete = self.__categories_for_delete_ids(validated_data)

        return Category.objects.filter(pk__in=ids_for_delete).delete()

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
