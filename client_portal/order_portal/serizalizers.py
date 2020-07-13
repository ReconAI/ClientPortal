from rest_framework.serializers import ModelSerializer

from recon_db_manager.models import Category


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ('name',)
