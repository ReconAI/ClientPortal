"""
Ordre portal views set
"""

from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from drf_yasg.utils import swagger_auto_schema
from requests import Request
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from order_portal.serizalizers import CategorySerializer, \
    ReadManufacturerSerializer, WriteManufacturerSerializer, \
    CategoryCollectionSerializer
from recon_db_manager.models import Category, Manufacturer
from shared.permissions import IsActive, IsSuperUser, PaymentRequired
from shared.swagger.headers import token_header
from shared.swagger.responses import get_responses, http401, http404, \
    http403, http405, DEFAULT_UNSAFE_REQUEST_RESPONSES, \
    DEFAULT_DELETE_REQUEST_RESPONSES, DEFAULT_GET_REQUESTS_RESPONSES
from shared.views.utils import RetrieveUpdateDestroyAPIView, \
    ListCreateAPIView


class CategoryOperator:
    """
    Base category views attributes
    """
    serializer_class = CategorySerializer

    permission_classes = (IsAuthenticated, IsActive,
                          IsSuperUser, PaymentRequired)

    queryset = Category.objects.all()


@method_decorator(name='post', decorator=swagger_auto_schema(
    responses=DEFAULT_UNSAFE_REQUEST_RESPONSES,
    tags=['Category'],
    operation_summary="Creates a category",
    manual_parameters=[
        token_header(),
    ]
))
@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=DEFAULT_GET_REQUESTS_RESPONSES,
    tags=['Category'],
    operation_summary="List of categories",
    manual_parameters=[
        token_header(),
    ]
))
class CategoryList(CategoryOperator, ListCreateAPIView):
    """
    User create and get list views set
    """
    create_success_message = _('Categories were added')

    def post(self, request, *args, **kwargs):
        return self.save_or_error(
            self.create_success_message,
            CategoryCollectionSerializer(data=request.data)
        )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        return JsonResponse({
            'data': self.get_serializer(queryset, many=True).data
        })


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses={
        status.HTTP_200_OK: CategorySerializer,
        status.HTTP_401_UNAUTHORIZED: http401(),
        status.HTTP_403_FORBIDDEN: http403(),
        status.HTTP_404_NOT_FOUND: http404(),
        status.HTTP_405_METHOD_NOT_ALLOWED: http405()
    },
    tags=['Category'],
    operation_summary="Gets a category",
    manual_parameters=[
        token_header(),
    ]
))
@method_decorator(name='put', decorator=swagger_auto_schema(
    responses=DEFAULT_UNSAFE_REQUEST_RESPONSES,
    tags=['Category'],
    operation_summary="Updates a category",
    manual_parameters=[
        token_header(),
    ]
))
@method_decorator(name='delete', decorator=swagger_auto_schema(
    responses=DEFAULT_DELETE_REQUEST_RESPONSES,
    tags=['Category'],
    operation_summary="Deletes a category",
    manual_parameters=[
        token_header(),
    ]
))
class CategoryItem(CategoryOperator, RetrieveUpdateDestroyAPIView):
    """
    Category retrieve, update and delete view
    """
    update_success_message = _('Category is updated successfully')


class ManufacturerOperator:
    """
    Base manufacturer views attributes
    """
    serializer_class = ReadManufacturerSerializer

    permission_classes = (IsAuthenticated, IsActive,
                          IsSuperUser, PaymentRequired)

    queryset = Manufacturer.objects.all()


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=DEFAULT_GET_REQUESTS_RESPONSES,
    tags=['Manufacturer'],
    operation_summary="List of manufacturers",
    operation_description='Returns list of manufacturers with categories',
    manual_parameters=[
        token_header(),
    ]
))
class ManufacturerList(ManufacturerOperator, ListCreateAPIView):
    """
    Manufacturer list view and create
    """

    serializer_class = ReadManufacturerSerializer

    write_serializer_class = WriteManufacturerSerializer

    queryset = Manufacturer.objects.prefetch_related('categories').all()

    create_success_message = _('Manufacturer is created successfully')

    @swagger_auto_schema(
        responses=DEFAULT_UNSAFE_REQUEST_RESPONSES,
        request_body=write_serializer_class,
        tags=['Manufacturer'],
        operation_summary="Creates a manufacturer",
        operation_description='Creates a manufacturer with categories',
        manual_parameters=[
            token_header(),
        ]
    )
    def post(self, request: Request, *args, **kwargs) -> Response:
        """
        :type request: Request

        :rtype: Response
        """
        return self.save_or_error(
            self.create_success_message,
            self.write_serializer_class(
                data=self.request.data
            )
        )


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses={
        status.HTTP_200_OK: ReadManufacturerSerializer,
        status.HTTP_401_UNAUTHORIZED: http401(),
        status.HTTP_403_FORBIDDEN: http403(),
        status.HTTP_404_NOT_FOUND: http404(),
        status.HTTP_405_METHOD_NOT_ALLOWED: http405()
    },
    tags=['Manufacturer'],
    operation_summary="Get a manufacturer",
    operation_description='Returns a manufacturer with categories',
    manual_parameters=[
        token_header(),
    ]
))
@method_decorator(name='put', decorator=swagger_auto_schema(
    responses=DEFAULT_UNSAFE_REQUEST_RESPONSES,
    tags=['Manufacturer'],
    operation_summary="Updates a manufacturer",
    operation_description='Updates a manufacturer with categories',
    manual_parameters=[
        token_header(),
    ]
))
@method_decorator(name='delete', decorator=swagger_auto_schema(
    responses=DEFAULT_DELETE_REQUEST_RESPONSES,
    tags=['Manufacturer'],
    operation_summary="Deletes a manufacturer",
    operation_description='Removes a manufacturer and related categories',
    manual_parameters=[
        token_header(),
    ]
))
class ManufacturerItem(ManufacturerOperator, RetrieveUpdateDestroyAPIView):
    """
    View for item retrieve, update and delete
    """
    serializer_class = WriteManufacturerSerializer

    read_serializer_class = ReadManufacturerSerializer

    update_success_message = _('Manufacturer is updated successfully')
