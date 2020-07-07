from django.contrib.auth import get_user_model
from django.db.models.query import QuerySet
from django.db.transaction import atomic
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.generics import RetrieveUpdateDestroyAPIView, \
    ListCreateAPIView
from rest_framework.permissions import IsAuthenticated

from reporting_tool.forms import UserEditForm
from reporting_tool.permissions import IsCompanyAdmin, IsActive
from reporting_tool.serializers import UserSerializer, \
    form_to_formserializer, UserOrganizationSerializer
from reporting_tool.settings import RECON_AI_CONNECTION_NAME
from reporting_tool.swagger.headers import token_header
from reporting_tool.swagger.responses import data_serializer, http401, http405, \
    http404, http403, http200


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

    queryset = get_user_model().objects.prefetch_related('usergroup__group').all()

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
        status.HTTP_200_OK: data_serializer(UserOrganizationSerializer),
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
@method_decorator(name='patch', decorator=swagger_auto_schema(
    responses={
        status.HTTP_200_OK: http200(),
        status.HTTP_401_UNAUTHORIZED: http401(),
        status.HTTP_404_NOT_FOUND: http404(),
        status.HTTP_403_FORBIDDEN: http403(),
        status.HTTP_405_METHOD_NOT_ALLOWED: http405()
    },
    request_body=form_to_formserializer(UserEditForm),
    tags=['User Management'],
    operation_summary="User data update",
    operation_description='Updates user data within current user organization',
    manual_parameters=[
        token_header(),
    ]
))
@method_decorator(name='put', decorator=swagger_auto_schema(
    responses={
        status.HTTP_200_OK: http200(),
        status.HTTP_401_UNAUTHORIZED: http401(),
        status.HTTP_404_NOT_FOUND: http404(),
        status.HTTP_403_FORBIDDEN: http403(),
        status.HTTP_405_METHOD_NOT_ALLOWED: http405()
    },
    request_body=form_to_formserializer(UserEditForm),
    tags=['User Management'],
    operation_summary="User data update",
    operation_description='Updates user data within current user organization',
    manual_parameters=[
        token_header(),
    ]
))
class UserItem(RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsActive, IsCompanyAdmin)

    serializer_class = UserSerializer

    form_class = UserEditForm

    queryset = get_user_model().objects.prefetch_related('usergroup__group')

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
        """
        :type queryset: QuerySet

        :rtype: QuerySet
        """
        return queryset.filter(
            organization_id=self.request.user.organization_id
        )

    @atomic(using='default')
    @atomic(using=RECON_AI_CONNECTION_NAME)
    def update(self, request, *args, **kwargs) -> JsonResponse:
        form = self.form_class(request.data, instance=self.get_object())

        if form.is_valid():
            form.save()

            return JsonResponse({
                'message': _('User data is updated')
            })

        return JsonResponse({
            'errors': form.errors
        }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        return JsonResponse({
            'data': UserOrganizationSerializer(instance).data
        })
