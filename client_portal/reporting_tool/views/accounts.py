"""
Http handlers for user related operations
"""
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.db.transaction import atomic
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.utils.decorators import method_decorator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
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

from reporting_tool.forms import SignupForm, PasswordResetForm, \
    SetPasswordForm, PreSignupForm, CheckResetPasswordTokenForm, \
    UserActivationForm
from reporting_tool.frontend.router import Router
from reporting_tool.models import Token
from reporting_tool.serializers import UserSerializer
from reporting_tool.settings import RECON_AI_CONNECTION_NAME
from reporting_tool.tokens import TokenGenerator


class PreSignupValidationView(APIView):
    """
    Performs pre signup validation
    """

    @staticmethod
    def post(request: Request, *arg, **kwargs) -> JsonResponse:
        """
        User signup pre singup validation

        :type request: Request

        :rtype: JsonResponse
        """
        form = PreSignupForm(request.data)

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

    @staticmethod
    @atomic(using='default')
    @atomic(using=RECON_AI_CONNECTION_NAME)
    def post(request: Request, *arg, **kwargs) -> JsonResponse:
        """
        User signup http handler

        :type request: Request

        :rtype: JsonResponse
        """
        form = SignupForm(request.data)

        if form.is_valid():
            user = form.save()

            message = render_to_string('emails/acc_active_email.html', {
                'user': user,
                'activation_link': Router(
                    settings.CLIENT_APP_SHEMA_HOST_PORT
                ).reverse_full(
                    'activate',
                    args=(
                        urlsafe_base64_encode(force_bytes(user.pk)),
                        TokenGenerator().make_token(user)
                    )
                )
            })

            EmailMultiAlternatives(
                _('Activate your account'),
                message,
                to=[form.cleaned_data.get('email')]
            ).send()

            return JsonResponse({
                'message': _('Please confirm your email address '
                             'to complete the registration')
            })

        return JsonResponse({
            'errors': form.errors
        }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class ActivateView(APIView, FormMixin):
    """
    Perofrms activation of user's profile
    """

    form_class = UserActivationForm

    @atomic(using='default')
    @atomic(using=RECON_AI_CONNECTION_NAME)
    def post(self, *args, **kwargs) -> JsonResponse:
        """
        User account activation


        :rtype: JsonResponse
        """
        form = self.get_form()

        if form.is_valid():
            form.save()

            return JsonResponse({
                'message': _('Activated')
            })

        return JsonResponse({
            'errors': form.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def get_form_kwargs(self) -> dict:
        """
        :rtype: dict
        """
        return {
            'data': self.request.data
        }


class CurrentUserProfileView(APIView):
    """
    Returns user's data
    """
    permission_classes = (IsAuthenticated,)

    @staticmethod
    @swagger_auto_schema(
        responses={
            status.HTTP_200_OK: UserSerializer
        }
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

    @swagger_auto_schema(
        request_body=AuthTokenSerializer
    )
    def post(self, request: Request, *args, **kwargs) -> JsonResponse:
        """
        User token retrieval

        # User token retrieval
        ---
        ###
        :type request: Request
        :type args: list
        :type kwargs: dict

        :rtype: JsonResponse
        """
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user_id=user.pk)

            return JsonResponse({
                'data': {
                    'token': token.key
                }
            })

        return JsonResponse({
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    Performs user logout
    """
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request: Request, *args, **kwargs) -> JsonResponse:
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
    form_class = PasswordResetForm

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
                      email_template_name='emails/password_reset_email.html')
            return JsonResponse({
                'message': _('Password is reset')
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

    form_class = CheckResetPasswordTokenForm

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
                'msg': _('Token is valid')
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
    form_class = SetPasswordForm

    @method_decorator(never_cache)
    @atomic(using=settings.RECON_AI_CONNECTION_NAME)
    def post(self, *args, **kwargs) -> JsonResponse:
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
                'msg': _('Password is changed')
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
