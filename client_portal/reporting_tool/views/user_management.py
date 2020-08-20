"""
Views associated with user management. There are actions admin can
perform over users within admin's company.
"""
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models.query import QuerySet
from django.db.transaction import atomic
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import never_cache
from drf_yasg.utils import swagger_auto_schema
from requests import Request
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from reporting_tool.forms.user_management import UserInvitationForm, \
    FollowInvitationForm, CheckUserInvitationTokenForm, UserEditForm
from shared.models import User
from shared.permissions import IsCompanyAdmin, IsActive, \
    IsNotAuthenticated, PaymentRequired
from shared.serializers import UserSerializer, \
    form_to_formserializer, UserOrganizationSerializer, TrialSerializer
from shared.swagger.headers import token_header
from shared.swagger.responses import data_serializer, http401, \
    http405, http404, http403, data_message_serializer, \
    http400, DEFAULT_UNSAFE_REQUEST_RESPONSES, \
    DEFAULT_DELETE_REQUEST_RESPONSES, DEFAULT_GET_REQUESTS_RESPONSES, \
    default_unsafe_responses_with_custom_success
from shared.views.utils import CheckTokenMixin, FormMixin


@method_decorator(name='get', decorator=swagger_auto_schema(
    responses=DEFAULT_GET_REQUESTS_RESPONSES,
    tags=['User Management'],
    operation_summary="List with user data",
    operation_description='Returns list with user data '
                          'within current user organization',
    manual_parameters=[
        token_header(),
    ]
))
@method_decorator(name='post', decorator=swagger_auto_schema(
    responses=DEFAULT_UNSAFE_REQUEST_RESPONSES,
    request_body=form_to_formserializer(UserInvitationForm),
    tags=['User Management'],
    operation_summary="Invites a user",
    operation_description='Admin invites user to join the application',
    manual_parameters=[
        token_header(),
    ]
))
class UserList(ListCreateAPIView, FormMixin):
    """
    Shows set of users.
    Sends invitation to a new user.
    """
    permission_classes = (IsAuthenticated, IsActive,
                          IsCompanyAdmin, PaymentRequired)

    serializer_class = UserSerializer

    queryset = get_user_model().objects.prefetch_related(
        'usergroup__group').order_by('-created_dt').all()

    form_class = UserInvitationForm

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
        """
        :type queryset: QuerySet

        :rtype: QuerySet
        """
        return queryset.filter(
            organization_id=self.request.user.organization_id
        )

    @atomic(using='default')
    @atomic(using=settings.RECON_AI_CONNECTION_NAME)
    def create(self, request: Request, *args, **kwargs) -> JsonResponse:
        """
        :type request: Request

        :rtype: JsonResponse
        """
        form = self.form_class(request.user.organization_id, data=request.data)

        return self.save_or_error(
            _('User is invited'),
            success_status=status.HTTP_201_CREATED,
            form=form,
            request=request
        )


class UserItem(GenericAPIView, FormMixin):
    """
    Returns and updates user data.
    Deletes a user.
    """
    permission_classes = (IsAuthenticated, IsActive,
                          IsCompanyAdmin, PaymentRequired)

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
        ).exclude(id=self.request.user.pk)

    @swagger_auto_schema(
        responses={
            status.HTTP_200_OK: data_serializer(UserOrganizationSerializer),
            status.HTTP_401_UNAUTHORIZED: http401(),
            status.HTTP_404_NOT_FOUND: http404(),
            status.HTTP_403_FORBIDDEN: http403(),
            status.HTTP_405_METHOD_NOT_ALLOWED: http405()
        },
        tags=['User Management'],
        operation_summary="User data",
        operation_description='Returns user data within '
                              'current user organization',
        manual_parameters=[
            token_header(),
        ]
    )
    def get(self, *args, **kwargs) -> JsonResponse:
        """
        :rtype: JsonResponse
        """
        instance = self.get_object()

        return JsonResponse({
            'data': UserOrganizationSerializer(instance).data
        })

    @swagger_auto_schema(
        responses=DEFAULT_UNSAFE_REQUEST_RESPONSES,
        request_body=form_to_formserializer(UserEditForm),
        tags=['User Management'],
        operation_summary="User data update",
        operation_description='Updates user data '
                              'within current user organization',
        manual_parameters=[
            token_header(),
        ]
    )
    @atomic(using='default')
    @atomic(using=settings.RECON_AI_CONNECTION_NAME)
    def put(self, request, *args, **kwargs) -> JsonResponse:
        """
        :rtype: JsonResponse
        """
        form = self.form_class(
            request.data,
            instance=self.get_object()
        )

        return self.save_or_error(
            _('User data is updated'),
            form=form
        )

    @swagger_auto_schema(
        responses=DEFAULT_DELETE_REQUEST_RESPONSES,
        tags=['User Management'],
        operation_summary="Delete user",
        operation_description='Delete user within current user organization',
        manual_parameters=[
            token_header(),
        ]
    )
    def delete(self, request, *args, **kwargs) -> JsonResponse:
        """
        :rtype: JsonResponse
        """
        self.get_object().delete()

        return JsonResponse({
            'message': _('User is deleted')
        }, status=status.HTTP_200_OK)


class InvitationView(APIView, FormMixin, CheckTokenMixin):
    """
    Checks whether provided password reset token is valid
    """
    permission_classes = (IsNotAuthenticated,)

    form_class = FollowInvitationForm

    check_token_form_class = CheckUserInvitationTokenForm

    response_serializer = TrialSerializer

    @swagger_auto_schema(
        responses={
            status.HTTP_200_OK: data_message_serializer(UserSerializer),
            status.HTTP_400_BAD_REQUEST: http400(),
            status.HTTP_403_FORBIDDEN: http403(),
            status.HTTP_404_NOT_FOUND: http404(),
            status.HTTP_405_METHOD_NOT_ALLOWED: http405()
        },
        request_body=form_to_formserializer(CheckUserInvitationTokenForm),
        tags=['User Management'],
        operation_summary='Checks user invitation token',
        operation_description='Checks whether '
                              'user invitation token is still valid',
    )
    @method_decorator(never_cache)
    def post(self, *args, **kwargs) -> JsonResponse:
        """
        Check user invitation token

        :type args: tuple
        :type kwargs: dict

        :rtype: JsonResponse
        """
        return self.check_token()

    @swagger_auto_schema(
        responses=default_unsafe_responses_with_custom_success(
            data_message_serializer(response_serializer)
        ),
        request_body=form_to_formserializer(form_class),
        tags=['User Management'],
        operation_summary='Register by invitation',
        operation_description='Checks whether user invitation '
                              'token is still valid and registers the user',
    )
    @method_decorator(never_cache)
    def put(self, *args, **kwargs) -> JsonResponse:
        """
        :rtype: JsonResponse
        """
        return self.save_or_error(
            _('You are successfully registered')
        )

    def response_data(self, instance: User) -> dict:
        return self.response_serializer(instance.organization).data
