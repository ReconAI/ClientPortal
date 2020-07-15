from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from order_portal.serizalizers import CategorySerializer, \
    ReadManufacturerSerializer, WriteManufacturerSerializer, \
    CategoryCollectionSerializer
from recon_db_manager.models import Category, Manufacturer
from shared.permissions import IsActive, IsSuperUser, PaymentRequired
from shared.swagger.headers import token_header
from shared.swagger.responses import get_responses, http401, http404, \
    http403, http405
from shared.views.utils import RetrieveUpdateDestroyAPIView, \
    ListCreateAPIView


class CategoryOperator:
    serializer_class = CategorySerializer

    permission_classes = (IsAuthenticated, IsActive,
                          IsSuperUser, PaymentRequired)

    queryset = Category.objects.all()


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=get_responses(
        status.HTTP_401_UNAUTHORIZED,
        status.HTTP_404_NOT_FOUND,
        status.HTTP_403_FORBIDDEN,
        status.HTTP_405_METHOD_NOT_ALLOWED
    ),
    tags=['Category'],
    operation_summary="List of categories",
    manual_parameters=[
        token_header(),
    ]
))
@method_decorator(name='post', decorator=swagger_auto_schema(
    responses=get_responses(
        status.HTTP_200_OK,
        status.HTTP_400_BAD_REQUEST,
        status.HTTP_401_UNAUTHORIZED,
        status.HTTP_404_NOT_FOUND,
        status.HTTP_403_FORBIDDEN,
        status.HTTP_405_METHOD_NOT_ALLOWED,
        status.HTTP_422_UNPROCESSABLE_ENTITY
    ),
    tags=['Category'],
    operation_summary="Creates a category",
    manual_parameters=[
        token_header(),
    ]
))
class CategoryList(CategoryOperator, ListCreateAPIView):
    create_success_message = _('Categories were added')

    def create(self, request, *args, **kwargs):
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
    responses=get_responses(
        status.HTTP_200_OK,
        status.HTTP_401_UNAUTHORIZED,
        status.HTTP_404_NOT_FOUND,
        status.HTTP_403_FORBIDDEN,
        status.HTTP_405_METHOD_NOT_ALLOWED
    ),
    tags=['Category'],
    operation_summary="Updates a category",
    manual_parameters=[
        token_header(),
    ]
))
@method_decorator(name='delete', decorator=swagger_auto_schema(
    responses=get_responses(
        status.HTTP_200_OK,
        status.HTTP_401_UNAUTHORIZED,
        status.HTTP_404_NOT_FOUND,
        status.HTTP_403_FORBIDDEN,
        status.HTTP_405_METHOD_NOT_ALLOWED
    ),
    tags=['Category'],
    operation_summary="Deletes a category",
    manual_parameters=[
        token_header(),
    ]
))
class CategoryItem(CategoryOperator, RetrieveUpdateDestroyAPIView):
    update_success_message = _('Category is updated successfully')


class ManufacturerOperator:
    serializer_class = ReadManufacturerSerializer

    permission_classes = (IsAuthenticated, IsActive,
                          IsSuperUser, PaymentRequired)

    queryset = Manufacturer.objects.all()


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=get_responses(
        status.HTTP_401_UNAUTHORIZED,
        status.HTTP_404_NOT_FOUND,
        status.HTTP_403_FORBIDDEN,
        status.HTTP_405_METHOD_NOT_ALLOWED
    ),
    tags=['Manufacturer'],
    operation_summary="List of manufacturers",
    operation_description='Returns list of manufacturers with categories',
    manual_parameters=[
        token_header(),
    ]
))
class ManufacturerList(ManufacturerOperator, ListCreateAPIView):
    serializer_class = ReadManufacturerSerializer

    write_serializer_class = WriteManufacturerSerializer

    queryset = Manufacturer.objects.prefetch_related('categories').all()

    create_success_message = _('Manufacturer is created successfully')

    @swagger_auto_schema(
        responses=get_responses(
            status.HTTP_200_OK,
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_404_NOT_FOUND,
            status.HTTP_403_FORBIDDEN,
            status.HTTP_405_METHOD_NOT_ALLOWED,
            status.HTTP_422_UNPROCESSABLE_ENTITY
        ),
        request_body=write_serializer_class,
        tags=['Manufacturer'],
        operation_summary="Creates a manufacturer",
        operation_description='Creates a manufacturer with categories',
        manual_parameters=[
            token_header(),
        ]
    )
    def post(self, request, *args, **kwargs):
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
    responses=get_responses(
        status.HTTP_401_UNAUTHORIZED,
        status.HTTP_404_NOT_FOUND,
        status.HTTP_403_FORBIDDEN,
        status.HTTP_405_METHOD_NOT_ALLOWED
    ),
    tags=['Manufacturer'],
    operation_summary="Updates a manufacturer",
    operation_description='Updates a manufacturer with categories',
    manual_parameters=[
        token_header(),
    ]
))
@method_decorator(name='delete', decorator=swagger_auto_schema(
    responses=get_responses(
        status.HTTP_200_OK,
        status.HTTP_401_UNAUTHORIZED,
        status.HTTP_404_NOT_FOUND,
        status.HTTP_403_FORBIDDEN,
        status.HTTP_405_METHOD_NOT_ALLOWED
    ),
    tags=['Manufacturer'],
    operation_summary="Deletes a manufacturer",
    operation_description='Removes a manufacturer and related categories',
    manual_parameters=[
        token_header(),
    ]
))
class ManufacturerItem(ManufacturerOperator, RetrieveUpdateDestroyAPIView):
    serializer_class = WriteManufacturerSerializer

    read_serializer_class = ReadManufacturerSerializer

    update_success_message = _('Manufacturer is updated successfully')
