"""
Order portal management views set
"""

from django.conf import settings
from django.db.transaction import atomic
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from order_portal.serizalizers import ReadManufacturerSerializer, \
    WriteManufacturerSerializer, \
    CategoryCollectionSerializer, CreateDeviceSerializer, \
    UpdateDeviceSerializer, FullViewDeviceSerializer, CategoryDeviceSerializer
from order_portal.views.catalogue import CategoryListMixin
from recon_db_manager.models import Category, Manufacturer
from recon_db_manager.models import Device
from shared.permissions import IsActive, IsSuperUser, PaymentRequired
from shared.swagger.headers import token_header
from shared.swagger.responses import http401, http404, \
    http403, http405, DEFAULT_UNSAFE_REQUEST_RESPONSES, \
    DEFAULT_DELETE_REQUEST_RESPONSES, DEFAULT_GET_REQUESTS_RESPONSES, \
    data_serializer, http422, default_get_responses_with_custom_success, \
    data_serializer_many, \
    data_many_message_serializer
from shared.views.utils import RetrieveUpdateDestroyAPIView, \
    ListCreateAPIView, CreateAPIView


class SyncCategoriesView(CategoryListMixin, ListCreateAPIView):
    """
    User create and get list views set
    """
    permission_classes = (IsAuthenticated, IsActive,
                          IsSuperUser, PaymentRequired)

    queryset = Category.objects.all()

    @swagger_auto_schema(
        responses={
            status.HTTP_200_OK: data_many_message_serializer(
                CategoryDeviceSerializer
            ),
            status.HTTP_401_UNAUTHORIZED: http401(),
            status.HTTP_403_FORBIDDEN: http403(),
            status.HTTP_404_NOT_FOUND: http404(),
            status.HTTP_405_METHOD_NOT_ALLOWED: http405(),
            status.HTTP_422_UNPROCESSABLE_ENTITY: http422(),
        },
        request_body=CategoryCollectionSerializer,
        tags=['Category'],
        operation_summary='Creates a category',
        operation_description='Synchronize categories set',
        manual_parameters=[
            token_header(),
        ]
    )
    @atomic(settings.RECON_AI_CONNECTION_NAME)
    def post(self, request, *args, **kwargs):
        serializer = CategoryCollectionSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({
                'data': self.list(),
                'message': _('Categories were synchornized successfully')
            })

        return Response({
            'errors': serializer.errors
        }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

    @swagger_auto_schema(
        responses=default_get_responses_with_custom_success(
            data_serializer_many(CategoryDeviceSerializer)
        ),
        tags=['Category'],
        operation_summary="List of categories",
        operation_description='Categories list view with device attached flag'
    )
    def get(self, *args, **kwargs) -> Response:
        """
        Categories list view with device attached flag

        :rtype: Response
        """
        return Response({
            'data': self.list()
        })


class ManufacturerOperator:
    """
    Base manufacturer views attributes
    """
    serializer_class = ReadManufacturerSerializer

    permission_classes = (IsAuthenticated, IsActive,
                          IsSuperUser, PaymentRequired)

    queryset = Manufacturer.objects.all()


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=default_get_responses_with_custom_success(
        data_serializer(ReadManufacturerSerializer)
    ),
    tags=['Manufacturer'],
    operation_summary="List of manufacturers",
    operation_description='Returns list of manufacturers with categories',
    manual_parameters=[
        token_header(),
    ]
))
class ManufacturerListView(ManufacturerOperator, ListCreateAPIView):
    """
    Manufacturer list view and create
    """
    write_serializer_class = WriteManufacturerSerializer

    queryset = Manufacturer.objects.all()

    create_success_message = _('Manufacturer is created successfully')

    @swagger_auto_schema(
        responses=DEFAULT_UNSAFE_REQUEST_RESPONSES,
        request_body=write_serializer_class,
        tags=['Manufacturer'],
        operation_summary="Creates a manufacturer",
        manual_parameters=[
            token_header(),
        ],
        operation_description='Creates a manufacturer with categories',
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

    def get(self, request, *args, **kwargs) -> Response:
        """
        Generic list view

        :type request: Request

        :rtype: Response
        """
        queryset = self.filter_queryset(self.get_queryset())

        serializer = self.get_serializer(queryset, many=True)

        return Response({
            'data': serializer.data
        })


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=default_get_responses_with_custom_success(
        ReadManufacturerSerializer
    ),
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
class ManufacturerItemView(ManufacturerOperator, RetrieveUpdateDestroyAPIView):
    """
    View for item retrieve, update and delete
    """

    serializer_class = WriteManufacturerSerializer

    read_serializer_class = ReadManufacturerSerializer

    update_success_message = _('Manufacturer is updated successfully')


@method_decorator(name='post', decorator=swagger_auto_schema(
    responses=DEFAULT_UNSAFE_REQUEST_RESPONSES,
    request_body=CreateDeviceSerializer,
    tags=['Device'],
    operation_summary="Creates a device",
    operation_description='Creates a device with images',
    manual_parameters=[
        token_header(),
    ]
))
class CreateDeviceView(CreateAPIView):
    """
    Creates new device
    """

    serializer_class = CreateDeviceSerializer

    permission_classes = (IsAuthenticated, IsActive,
                          IsSuperUser, PaymentRequired)

    create_success_message = _('Device is created successfully')

    @atomic(settings.RECON_AI_CONNECTION_NAME)
    def post(self, request: Request, *args, **kwargs) -> Response:
        return super().post(request, *args, **kwargs)


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=DEFAULT_GET_REQUESTS_RESPONSES,
    tags=['Device'],
    operation_summary="Gets a device for modification",
    operation_description='Retrieves a device with images and manufacturer',
    manual_parameters=[
        token_header(),
    ]
))
@method_decorator(name='put', decorator=swagger_auto_schema(
    responses=DEFAULT_UNSAFE_REQUEST_RESPONSES,
    request_body=UpdateDeviceSerializer,
    tags=['Device'],
    operation_summary="Updates a device",
    operation_description='Updates a device with images',
    manual_parameters=[
        token_header(),
    ]
))
@method_decorator(name='delete', decorator=swagger_auto_schema(
    responses=DEFAULT_DELETE_REQUEST_RESPONSES,
    tags=['Device'],
    operation_summary="Deletes a device",
    operation_description='Deletes a device with images',
    manual_parameters=[
        token_header(),
    ]
))
class DeviceItemView(RetrieveUpdateDestroyAPIView):
    """
    Retrieves, updates and deletes device data
    """

    write_serializer_class = UpdateDeviceSerializer

    serializer_class = FullViewDeviceSerializer

    permission_classes = (IsAuthenticated, IsActive,
                          IsSuperUser, PaymentRequired)

    queryset = Device.objects.prefetch_related(
        'images').filter(published=True).all()

    update_success_message = _('Device is updated successfully')

    @atomic(settings.RECON_AI_CONNECTION_NAME)
    def put(self, *args, **kwargs) -> Response:
        return self.save_or_error(
            self.update_success_message,
            self.write_serializer_class(
                data=self.request.data,
                instance=self.get_object()
            )
        )

    @atomic(settings.RECON_AI_CONNECTION_NAME)
    def delete(self, *args, **kwargs) -> Response:
        return super().delete(*args, **kwargs)
