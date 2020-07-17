"""
Catalogue views set
"""

from django.db.models import Count
from django.db.models.query import QuerySet
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.openapi import Parameter, TYPE_STRING, IN_QUERY
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, filters
from rest_framework.generics import ListAPIView

from order_portal.serizalizers import CategorySerializer, \
    DeviceListSerializer, \
    DeviceItemSerializer
from recon_db_manager.models import Category
from recon_db_manager.models import Device
from shared.swagger.responses import http401, http404, \
    http403, http405, DEFAULT_GET_REQUESTS_RESPONSES, \
    data_serializer
from shared.views.utils import RetrieveAPIView


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses={
        status.HTTP_200_OK: data_serializer(CategorySerializer),
        status.HTTP_401_UNAUTHORIZED: http401(),
        status.HTTP_403_FORBIDDEN: http403(),
        status.HTTP_404_NOT_FOUND: http404(),
        status.HTTP_405_METHOD_NOT_ALLOWED: http405()
    },
    tags=['Category'],
    operation_summary="List of categories",
))
class CategoryListView(ListAPIView):
    """
    Categories list view
    """

    queryset = Category.objects.all()

    serializer_class = CategorySerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        return JsonResponse({
            'data': self.get_serializer(queryset, many=True).data
        })

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
        return queryset.annotate(
            manufacturers_count=Count('manufacturer')
        )


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
            'manufacturer__categories__id', IN_QUERY,
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

    filterset_fields = ['manufacturer__categories__id']


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

    queryset = Device.objects.prefetch_related(
        'manufacturer__categories', 'images').filter(published=True).all()
