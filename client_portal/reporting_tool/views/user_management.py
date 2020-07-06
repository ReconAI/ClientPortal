from django.db.models.query import QuerySet
from django.utils.decorators import method_decorator
from drf_yasg import openapi
from drf_yasg.openapi import Parameter, IN_HEADER
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.generics import RetrieveUpdateDestroyAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticated

from reporting_tool.models import User
from reporting_tool.permissions import IsCompanyAdmin, IsActive
from reporting_tool.serializers import UserSerializer
from reporting_tool.swagger.headers import token_header
from reporting_tool.swagger.responses import data_serializer, http401, http405, \
    http404, http403


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses={
        status.HTTP_401_UNAUTHORIZED: http401(),
        status.HTTP_404_NOT_FOUND: http404(),
        status.HTTP_403_FORBIDDEN: http403(),
        status.HTTP_405_METHOD_NOT_ALLOWED: http405()
    },
    tags=['User Management'],
    operation_summary="List with user data",
    operation_description='Returns list with user data '
                          'within current user organization',
    manual_parameters=[
        token_header(),
    ]
))
class UserList(ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsActive, IsCompanyAdmin)

    serializer_class = UserSerializer

    queryset = User.objects.prefetch_related('usergroup__group').all()

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
        """
        :type queryset: QuerySet

        :rtype: QuerySet
        """
        return queryset.filter(
            organization_id=self.request.user.organization_id
        )


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses={
        status.HTTP_200_OK: data_serializer(UserSerializer),
        status.HTTP_401_UNAUTHORIZED: http401(),
        status.HTTP_404_NOT_FOUND: http404(),
        status.HTTP_403_FORBIDDEN: http403(),
        status.HTTP_405_METHOD_NOT_ALLOWED: http405()
    },
    tags=['User Management'],
    operation_summary="User data",
    operation_description='Returns user data within current user organization',
    manual_parameters=[
        token_header(),
    ]
))
@method_decorator(name='delete', decorator=swagger_auto_schema(
    responses={

        status.HTTP_401_UNAUTHORIZED: http401(),
        status.HTTP_404_NOT_FOUND: http404(),
        status.HTTP_403_FORBIDDEN: http403(),
        status.HTTP_405_METHOD_NOT_ALLOWED: http405()
    },
    tags=['User Management'],
    operation_summary="Delete user",
    operation_description='Delete user within current user organization',
    manual_parameters=[
        token_header(),
    ]
))
class UserItem(RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsActive, IsCompanyAdmin)

    serializer_class = UserSerializer

    queryset = User.objects.prefetch_related('usergroup__group')

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
        """
        :type queryset: QuerySet

        :rtype: QuerySet
        """
        return queryset.filter(
            organization_id=self.request.user.organization_id
        )