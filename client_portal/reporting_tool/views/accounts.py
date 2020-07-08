"""
Http handlers for user related operations
"""
from django.conf import settings
from django.db.transaction import atomic
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _
from django.views.decorators.cache import never_cache
from django.views.generic.edit import FormMixin
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.authtoken.views import \
    ObtainAuthToken as ObtainAuthTokenBase
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.views import APIView

from reporting_tool.forms.accounts import PreSignupForm, SignupForm,\
    UserForm, UserActivationForm, PasswordResetForm, \
    CheckResetPasswordTokenForm, SetPasswordForm
from reporting_tool.forms.organization import OrganizationForm
from reporting_tool.models import Token
from reporting_tool.permissions import IsNotAuthenticated, IsActive
from reporting_tool.serializers import UserSerializer, \
    form_to_formserializer, forms_to_formserializer
from reporting_tool.settings import RECON_AI_CONNECTION_NAME
from reporting_tool.swagger.headers import token_header
from reporting_tool.swagger.responses import get_responses, token, http400, \
    http405, http403, http401, data_serializer
from reporting_tool.tokens import PasswordResetTokenGenerator


class PreSignupValidationView(APIView):
    """
    Performs pre signup validation
    """
    form_class = PreSignupForm

    permission_classes = (IsNotAuthenticated,)

    @swagger_auto_schema(
        request_body=form_to_formserializer(form_class),
        responses=get_responses(status.HTTP_200_OK,
                                status.HTTP_400_BAD_REQUEST,
                                status.HTTP_403_FORBIDDEN,
                                status.HTTP_405_METHOD_NOT_ALLOWED,
                                status.HTTP_422_UNPROCESSABLE_ENTITY),
        tags=['Accounts'],
        operation_summary="User pre singup validation",
        operation_description='Checks whether data initially provided is vaid',
    )
    def post(self, request: Request, *arg, **kwargs) -> JsonResponse:
        """
        User pre singup validation

        :type request: Request

        :rtype: JsonResponse
        """
        form = self.form_class(request.data)

        if form.is_valid():
            return JsonResponse({
                'message': _('Data is valid')
            })

        return JsonResponse({
            'errors': form.errors
        }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class SignupView(APIView):
    """
    Signs user up
    """
    form_class = SignupForm

    permission_classes = (IsNotAuthenticated,)

    @atomic(using='default')
    @atomic(using=RECON_AI_CONNECTION_NAME)
    @swagger_auto_schema(
        request_body=forms_to_formserializer(UserForm, OrganizationForm),
        responses=get_responses(status.HTTP_201_CREATED,
                                status.HTTP_400_BAD_REQUEST,
                                status.HTTP_403_FORBIDDEN,
                                status.HTTP_405_METHOD_NOT_ALLOWED,
                                status.HTTP_422_UNPROCESSABLE_ENTITY),
        tags=['Accounts'],
        operation_summary="Signup request",
        operation_description='Registers an organization and '
                              'user as the company\'s admin',
    )
    def post(self, request: Request, *arg, **kwargs) -> JsonResponse:
        """
        User signup http handler

        :type request: Request

        :rtype: JsonResponse
        """
        form = self.form_class(request.data)

        if form.is_valid():
            form.save(request)

            return JsonResponse({
                'message': _('Please confirm your email address '
                             'to complete the registration')
            }, status=status.HTTP_201_CREATED)

        return JsonResponse({
            'errors': form.errors
        }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class ActivateView(APIView):
    """
    Perofrms activation of user's profile
    """
    form_class = UserActivationForm

    permission_classes = (IsNotAuthenticated,)

    @atomic(using='default')
    @atomic(using=RECON_AI_CONNECTION_NAME)
    @swagger_auto_schema(
        responses=get_responses(status.HTTP_200_OK,
                                status.HTTP_400_BAD_REQUEST,
                                status.HTTP_403_FORBIDDEN,
                                status.HTTP_404_NOT_FOUND,
                                status.HTTP_405_METHOD_NOT_ALLOWED,
                                status.HTTP_422_UNPROCESSABLE_ENTITY),
        tags=['Accounts'],
        operation_summary="Activates user account",
        operation_description='User account activation',
        request_body=form_to_formserializer(form_class),
    )
    def put(self, request: Request, *args, **kwargs) -> JsonResponse:
        """
        User account activation

        :rtype: JsonResponse
        """
        form = self.form_class(request.data)

        if form.is_valid():
            form.save()

            return JsonResponse({
                'message': _('Activated')
            })

        return JsonResponse({
            'errors': form.errors
        }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class CurrentUserProfileView(APIView):
    """
    Returns user's data
    """
    permission_classes = (IsAuthenticated, IsActive)

    @staticmethod
    @swagger_auto_schema(
        responses={
            status.HTTP_200_OK: data_serializer(UserSerializer),
            status.HTTP_401_UNAUTHORIZED: http401(),
            status.HTTP_405_METHOD_NOT_ALLOWED: http405()
        },
        tags=['Accounts'],
        operation_summary="Current user data",
        operation_description='Returns current user data',
        manual_parameters=[
            token_header()
        ]
    )
    def get(request: Request, *args, **kwargs) -> JsonResponse:
        """
        Current user data

        :type request: Request

        :rtype: JsonResponse
        """
        serializer = UserSerializer(request.user)

        return JsonResponse({
            'data': serializer.data
        })


class ObtainAuthToken(ObtainAuthTokenBase):
    """
    Returns user token by credential provided
    """

    permission_classes = (IsNotAuthenticated,)

    @swagger_auto_schema(
        request_body=AuthTokenSerializer,
        responses={
            status.HTTP_201_CREATED: token(),
            status.HTTP_400_BAD_REQUEST: http400(),
            status.HTTP_403_FORBIDDEN: http403(),
            status.HTTP_405_METHOD_NOT_ALLOWED: http405()
        },
        tags=['Accounts'],
        operation_summary="Logs user in",
        operation_description='Returns authentication token '
                              'as a successful result of loging',
    )
    def post(self, request: Request, *args, **kwargs) -> JsonResponse:
        """
        User token retrieval

        :type request: Request
        :type args: list
        :type kwargs: dict

        :rtype: JsonResponse
        """
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            user_token, created = Token.objects.get_or_create(user_id=user.pk)

            return JsonResponse({
                'data': {
                    'token': user_token.key
                }
            }, status=status.HTTP_201_CREATED)

        return JsonResponse({
            'errors': _('Sorry, the information you entered '
                        'does not match what we have on file. '
                        'Please try again')
        }, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    Performs user logout
    """
    permission_classes = (IsAuthenticated, IsActive)

    @staticmethod
    @swagger_auto_schema(
        responses=get_responses(
            status.HTTP_200_OK,
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_401_UNAUTHORIZED,
            status.HTTP_405_METHOD_NOT_ALLOWED
        ),
        tags=['Accounts'],
        operation_summary="Logs user out",
        operation_description='Logs user out deleting his auth token',
        manual_parameters=[
            token_header()
        ]
    )
    def put(request: Request, *args, **kwargs) -> JsonResponse:
        """
        Logout HTTP handler

        :type request: Request
        :type args: tuple
        :type kwargs: dict

        :rtype: JsonResponse
        """
        Token.objects.filter(user_id=request.user.pk).delete()

        return JsonResponse({
            'message': _('User is logged out')
        }, status=status.HTTP_200_OK)


class ResetPassword(APIView, FormMixin):
    """
    Reset password view
    """
    permission_classes = (IsNotAuthenticated,)

    form_class = PasswordResetForm

    @swagger_auto_schema(
        request_body=form_to_formserializer(form_class),
        responses=get_responses(
            status.HTTP_200_OK,
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_403_FORBIDDEN,
            status.HTTP_405_METHOD_NOT_ALLOWED,
            status.HTTP_422_UNPROCESSABLE_ENTITY
        ),
        tags=['Accounts'],
        operation_summary="Reset user password",
        operation_description='Sends link to page with password reset form',
    )
    def post(self, request: Request, *args, **kwargs) -> JsonResponse:
        """
        Password reset request

        :type request: Request
        :type args: tuple
        :type kwargs: dict

        :rtype: JsonResponse
        """
        form = self.get_form()

        if form.is_valid():
            form.save(request=request,
                      email_template_name='emails/password_reset.html',
                      token_generator=PasswordResetTokenGenerator()
                      )
            return JsonResponse({
                'message': _('Instructions for resetting your password have'
                             ' been sent to your email')
            })

        return JsonResponse({
            'errors': form.errors
        }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

    def get_form_kwargs(self) -> dict:
        """
        :rtype: dict
        """
        return {
            'data': self.request.data
        }


class CheckResetPasswordTokenView(APIView, FormMixin):
    """
    Checks whether provided password reset token is valid
    """
    permission_classes = (IsNotAuthenticated,)

    form_class = CheckResetPasswordTokenForm

    @swagger_auto_schema(
        request_body=form_to_formserializer(form_class),
        responses=get_responses(
            status.HTTP_200_OK,
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_403_FORBIDDEN,
            status.HTTP_404_NOT_FOUND,
            status.HTTP_405_METHOD_NOT_ALLOWED,
            status.HTTP_422_UNPROCESSABLE_ENTITY
        ),
        tags=['Accounts'],
        operation_summary='Check password reset token',
        operation_description='Checks whether password reset token is valid',
    )
    @method_decorator(never_cache)
    def post(self, *args, **kwargs) -> JsonResponse:
        """
        Check password reset token

        :type args: tuple
        :type kwargs: dict

        :rtype: JsonResponse
        """
        form = self.get_form()

        if form.is_valid():
            return JsonResponse({
                'message': _('Token is valid')
            }, status=status.HTTP_200_OK)

        return JsonResponse({
            'errors': form.errors
        }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

    def get_form_kwargs(self) -> dict:
        """
        :type: dict
        """
        return {
            'data': self.request.data
        }

    def get_initial(self) -> dict:
        """
        :type: dict
        """
        return {}


class PasswordResetConfirmView(APIView, FormMixin):
    """
    Password reset confirmation
    """
    permission_classes = (IsNotAuthenticated,)

    form_class = SetPasswordForm

    @method_decorator(never_cache)
    @atomic(using=settings.RECON_AI_CONNECTION_NAME)
    @swagger_auto_schema(
        request_body=form_to_formserializer(form_class),
        responses=get_responses(
            status.HTTP_200_OK,
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_403_FORBIDDEN,
            status.HTTP_404_NOT_FOUND,
            status.HTTP_405_METHOD_NOT_ALLOWED,
            status.HTTP_422_UNPROCESSABLE_ENTITY
        ),
        tags=['Accounts'],
        operation_summary='Check password reset token',
        operation_description='Checks whether password reset token is valid',
    )
    def put(self, *args, **kwargs) -> JsonResponse:
        """
        Password reset form

        :type args: tuple
        :type kwargs: dict

        :rtype: JsonResponse
        """
        form = self.get_form()

        if form.is_valid():
            form.save()

            return JsonResponse({
                'message': _('New password was updated successfully')
            }, status=status.HTTP_200_OK)

        return JsonResponse({
            'errors': form.errors
        }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

    def get_form_kwargs(self) -> dict:
        """
        :type: dict
        """
        return {
            'data': self.request.data
        }

    def get_initial(self) -> dict:
        """
        :type: dict
        """
        return {}
