from typing import List

from rest_framework.serializers import ModelSerializer, ListSerializer, \
    Serializer

from recon_db_manager.models import Category


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ('name',)


class CategoryCollectionSerializer(Serializer):
    categories = ListSerializer(child=CategorySerializer(), allow_null=False,
                                allow_empty=False)

    def create(self, validated_data: List[dict]):
        return [
            Category.objects.create(**category_data)
            for category_data
            in validated_data.get('categories', [])
        ]
