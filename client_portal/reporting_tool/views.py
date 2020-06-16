"""
Http handlers are located here
"""

from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMultiAlternatives
from django.db.transaction import atomic
from django.http import HttpResponse, JsonResponse
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.views import APIView

from .forms import SignupForm
from .models import User
from .serializers import UserSerializer
from .tokens import TokenGenerator


class SignupView(APIView):
    @atomic(using='default')
    @atomic(using='recon_ai_db')
    def post(self, request: Request, *arg, **kwargs) -> HttpResponse:
        """
        User signup http handler

        :type request: Request

        :rtype: HttpResponse
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
                'Activate your blog account.',
                message,
                to=[form.cleaned_data.get('email')]
            ).send()

            return JsonResponse({
                'message': 'Please confirm your email address '
                           'to complete the registration'
            })

        return JsonResponse(form.errors)


class ActivateView(APIView):
    """
    Perofrms activation of user's profile
    """

    @staticmethod
    @atomic(using='default')
    @atomic(using='recon_ai_db')
    def get(request: Request, uidb64: str, token: str) -> HttpResponse:
        """
        User account activation

        :type request: Request
        :type uidb64: str
        :type token: str

        :rtype: HttpResponse
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
                'message': 'Activated'
            })

        return JsonResponse({
            'message': 'Activation link is invalid!'
        }, status=403)


class CurrentUserProfileView(APIView):
    """
    Returns user's data
    """
    permission_classes = (IsAuthenticated,)

    @staticmethod
    def get(request: Request, *args, **kwargs) -> JsonResponse:
        """
        :type request: Request

        :rtype: JsonResponse
        """
        serializer = UserSerializer(request.user)

        return JsonResponse(serializer.data)
