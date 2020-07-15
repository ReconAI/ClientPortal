from django.utils.decorators import method_decorator
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, \
    RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from order_portal.serizalizers import CategorySerializer, \
    CategoryCollectionSerializer
from recon_db_manager.models import Category
from shared.permissions import IsActive, IsSuperUser, PaymentRequired
from shared.swagger.headers import token_header
from shared.swagger.responses import get_responses, data_serializer, http400, \
    http401, http405, http404, http403


class CategoryOperator:
    serializer_class = CategorySerializer

    permission_classes = (IsAuthenticated, IsActive,
                          IsSuperUser, PaymentRequired)

    queryset = Category.objects.all()


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
    request_body=CategoryCollectionSerializer,
    operation_summary="Categories creation",
    operation_description='Creates list of categories',
    manual_parameters=[
        token_header(),
    ]
))
@method_decorator(name='get', decorator=swagger_auto_schema(
    responses={
        status.HTTP_200_OK: data_serializer(CategorySerializer),
        status.HTTP_400_BAD_REQUEST: http400(),
        status.HTTP_401_UNAUTHORIZED: http401(),
        status.HTTP_403_FORBIDDEN: http403(),
        status.HTTP_404_NOT_FOUND: http404(),
        status.HTTP_405_METHOD_NOT_ALLOWED: http405()
    },
    operation_summary="Categories retrieval",
    operation_description='Obtains list of categories',
    manual_parameters=[
        token_header(),
    ]
))
class CategoryList(CategoryOperator, ListCreateAPIView):
    def create(self, request, *args, **kwargs):
        serializer = CategoryCollectionSerializer(data=request.data)

        if serializer.is_valid():
            self.perform_create(serializer)

            return Response({
                'message': 'Categories were added'
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status.HTTP_422_UNPROCESSABLE_ENTITY)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        return Response({
            'data': self.get_serializer(queryset, many=True).data
        })


class CategoryItem(CategoryOperator, RetrieveUpdateDestroyAPIView):
    pass
