"""
Http handlers for user related operations
"""
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMultiAlternatives
from django.db.transaction import atomic
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.utils.decorators import method_decorator
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
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
    SetPasswordForm, PreSignupForm
from reporting_tool.models import User, Token
from reporting_tool.serializers import UserSerializer
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
    @atomic(using='recon_ai_db')
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
                'domain': get_current_site(request).domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token': TokenGenerator().make_token(user),
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


class ActivateView(APIView):
    """
    Perofrms activation of user's profile
    """

    @staticmethod
    @atomic(using='default')
    @atomic(using='recon_ai_db')
    def get(request: Request, uidb64: str, token: str) -> JsonResponse:
        """
        User account activation

        :type request: Request
        :type uidb64: str
        :type token: str

        :rtype: JsonResponse
        """
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and TokenGenerator().check_token(user, token):
            user.is_active = True
            user.save()

            return JsonResponse({
                'message': _('Activated')
            })

        return JsonResponse({
            'errors': _('Activation link is invalid')
        }, status=status.HTTP_400_BAD_REQUEST)


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


class PasswordResetConfirmView(APIView, FormMixin):
    """
    Password reset confirmation
    """
    form_class = SetPasswordForm

    @method_decorator(never_cache)
    @atomic(using=settings.RECON_AI_CONNECTION_NAME)
    def post(self, request: Request, *args, **kwargs) -> JsonResponse:
        """
        Password reset form

        :type request: Request
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
