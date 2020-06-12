"""
Http handlers are located here
"""

from django.contrib.auth import login
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMultiAlternatives
from django.db.transaction import atomic
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework.request import Request

from .forms import SignupForm
from .models import User
from .tokens import TokenGenerator


@atomic(using='default')
@atomic(using='recon_ai_db')
def signup(request: Request) -> HttpResponse:
    """
    User signup http handler

    :type request: Request

    :rtype: HttpResponse
    """
    form = SignupForm()

    if request.method == 'POST':
        form = SignupForm(request.POST)
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

            return redirect('/',
                            message='Please confirm your email '
                                    'address to complete the registration')

    return render(request, 'signup.html', {'form': form})


def profile(request: Request) -> HttpResponse:
    """
    User profile page

    :type request: Request

    :rtype: HttpResponse
    """
    return render(request, 'profile.html', {'user': request.user})


@atomic(using='default')
@atomic(using='recon_ai_db')
def activate(request: Request, uidb64: str, token: str) -> HttpResponse:
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
        login(request, user)

        return redirect('profile')

    return HttpResponse('Activation link is invalid!')
