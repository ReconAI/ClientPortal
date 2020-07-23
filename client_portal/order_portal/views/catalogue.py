"""
Catalogue views set
"""

from django.db.models import Count
from django.db.models.query import QuerySet
from django.utils.decorators import method_decorator
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.openapi import Parameter, TYPE_STRING, IN_QUERY
from drf_yasg.utils import swagger_auto_schema
from rest_framework import filters
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.serializers import Serializer

from order_portal.serizalizers import DeviceListSerializer, \
    DeviceItemSerializer, CategoryDeviceSerializer, CategorySerializer
from recon_db_manager.models import Category
from recon_db_manager.models import Device
from shared.swagger.responses import DEFAULT_GET_REQUESTS_RESPONSES, \
    default_get_responses_with_custom_success, data_serializer_many
from shared.views.utils import RetrieveAPIView


class CategoryListMixin:
    """
    Device list utility
    """
    queryset = Category.objects.all()

    serializer_class = CategoryDeviceSerializer

    def list(self, *args, **kwargs) -> Serializer:
        """
        :rtype: Response
        """
        queryset = self.filter_queryset(self.get_queryset())

        return self.get_serializer(queryset, many=True).data

    @staticmethod
    def filter_queryset(queryset: QuerySet) -> QuerySet:
        """
        :type queryset: QuerySet

        :rtype: QuerySet
        """
        return queryset.annotate(
            device_count=Count('device')
        )


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=default_get_responses_with_custom_success(
        data_serializer_many(CategorySerializer)
    ),
    tags=['Category'],
    operation_summary="List of categories",
    operation_description='Categories list view with at '
                          'least one device attached'
))
class CategoryListView(CategoryListMixin, ListAPIView):
    """
    Categories list view with at least one device attached
    """
    serializer_class = CategorySerializer

    def get(self, request, *args, **kwargs):
        return Response({
            'data': self.list()
        })

    @staticmethod
    def filter_queryset(queryset: QuerySet) -> QuerySet:
        """
        :type queryset: QuerySet

        :rtype: QuerySet
        """
        return queryset.annotate(
            nchild=Count('device')
        ).filter(nchild__gt=0)


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=DEFAULT_GET_REQUESTS_RESPONSES,
    tags=['Device'],
    operation_summary="Device list",
    operation_description='Gets a list of devices',
    manual_parameters=[
        Parameter(
            'ordering', IN_QUERY,
            'Orders by (-)created_dt, (-)sales_price',
            required=False, type=TYPE_STRING
        ),
        Parameter(
            'category_id', IN_QUERY,
            'Filters by category id',
            required=False, type=TYPE_STRING
        )
    ]
))
class DeviceListView(ListAPIView):
    """
    Device list view with appropriate sorting and filtering
    """

    serializer_class = DeviceListSerializer

    queryset = Device.objects.prefetch_related(
        'images').filter(published=True).all()

    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]

    search_fields = ['created_dt', 'sales_price']

    filterset_fields = ['category_id']


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=DEFAULT_GET_REQUESTS_RESPONSES,
    tags=['Device'],
    operation_summary="Gets a device",
    operation_description='Retrieves a device with images and manufacturer',
))
class DeviceItemView(RetrieveAPIView):
    """
    Device item view
    """

    serializer_class = DeviceItemSerializer

    queryset = Device.objects.filter(published=True).all()
