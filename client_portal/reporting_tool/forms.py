"""
Set of forms made use of within applicatoin
"""
from typing import Dict, List, Tuple

from django import forms
from django.conf import settings
from django.contrib.auth import (
    get_user_model, password_validation,
)
from django.contrib.auth.forms import UserCreationForm, \
    PasswordResetForm as PasswordResetFormBase
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.core.exceptions import ObjectDoesNotExist
from django.forms import ModelForm
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode
from django.utils.http import urlsafe_base64_encode
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ParseError, NotFound

from reporting_tool.frontend.router import Router
from reporting_tool.models import Organization, User
from reporting_tool.tokens import TokenGenerator


class PreSignupForm(UserCreationForm):
    """
    Performs inital validation before signing a user up
    """
    username = forms.CharField(
        label=_("Username"),
        min_length=2,
        error_messages={'min_length': _('Incorrect login.')}
    )

    error_messages = {
        'password_mismatch': _('Passwords do not match'),
    }

    class Meta:
        """
        Fields username, email are required.
        """
        model = User
        fields = ('username',)

    def clean(self) -> dict:
        """
        Performs incoming data validation

        :rtype: dict
        """
        cleaned_data = super().clean()

        self.instance.validate_unique()

        return cleaned_data


class UserForm(PreSignupForm):
    """
    SignupForm with the next behavior:
        - when user signs up, he/she is attached to the ADMIN user group
    """
    email = forms.EmailField(label=_("Email"))
    firstname = forms.CharField(label=_("First name"))
    lastname = forms.CharField(label=_("Last name"))
    address = forms.CharField(label=_("Address"))
    phone = forms.CharField(label=_("Phone number"))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.__organization = None

    class Meta:
        """
        Fields username, email are required.
        """
        model = User
        fields = (
            'username', 'email', 'firstname', 'lastname', 'address', 'phone')

    def set_organization(self, organization: Organization):
        """
        :type organization: Organization
        """
        self.__organization = organization

    def save(self, commit: bool = True) -> User:
        """
        Saves a user data to db

        :type commit: bool

        :rtype: User
        """
        data = self.cleaned_data
        self.cleaned_data["password"] = data.pop("password1")
        data.pop('password2')

        return self._meta.model.objects.create_admin(self.__organization,
                                                     **data)


class OrganizationForm(ModelForm):
    """
    Organization model form
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        for _, field in self.fields.items():
            field.required = True

    class Meta:
        """
        All fields apart from id should be editable
        """
        model = Organization
        fields = (
            "name", "vat", "main_firstname", "main_lastname", "main_address",
            "main_phone", "main_email", "inv_firstname", "inv_lastname",
            "inv_address", "inv_phone", "inv_email"
        )


class SignupForm:
    """
    Signup form is a combination of Userform and Organizationform
    """
    user_form_class = UserForm
    organization_form_class = OrganizationForm

    def __init__(self, data: dict):
        """
        :type data: dict
        """
        self.__user_form = UserForm(data)
        self.__organization_form = OrganizationForm(data)

    def is_valid(self) -> bool:
        """
        Both forms should be valid to have the form data correct

        :rtype: bool
        """
        return (
            self.__organization_form.is_valid()
            and self.__user_form.is_valid()
        )

    @property
    def errors(self) -> Dict[str, List[str]]:
        """
        :rtype: Dict[str, List[str]]
        """
        return {
            **self.__user_form.errors,
            **self.__organization_form.errors
        }

    def save(self) -> Tuple[User, Organization]:
        """
        Wser with only just created organization will be inserted.

        :rtype: Tuple[User, Organization]
        """
        organization = self.__organization_form.save()

        self.__user_form.set_organization(organization)

        return (
            self.__user_form.save(),
            organization
        )


class PasswordResetForm(PasswordResetFormBase):
    """
    Password reset form implementation.
    On reset password user gets the link to password reset form
    """

    def clean_email(self) -> dict:
        """
        Performs incoming data validation

        :rtype: dict
        """

        email = self.data["email"]

        try:
            get_user_model().objects.get(email=email)
        except ObjectDoesNotExist:
            raise NotFound(_("No user found"))

        return email

    def save(self, domain_override=None,
             subject_template_name='registration/password_reset_subject.txt',
             email_template_name='registration/password_reset_email.html',
             use_https=False, token_generator=default_token_generator,
             from_email=None, request=None, html_email_template_name=None,
             extra_email_context=None):

        """
        Generate a one-use only link for resetting password and send it to the
        user.
        """
        email = self.cleaned_data["email"]
        email_field_name = get_user_model().get_email_field_name()

        for user in self.get_users(email):
            site_name = domain_override
            if not site_name:
                current_site = get_current_site(request)
                site_name = current_site.name

            user_email = getattr(user, email_field_name)

            context = {
                'email': user_email,
                'site_name': site_name,
                'reset_password_link':
                    self.__get_password_reset_link(user, token_generator),
                'user': user,
                'app_name': settings.APP_NAME,
                **(extra_email_context or {}),
            }

            self.send_mail(
                subject_template_name, email_template_name, context,
                from_email,
                user_email, html_email_template_name=html_email_template_name,
            )

    @staticmethod
    def __get_password_reset_link(user: User, token_generator) -> str:
        return Router(
            settings.CLIENT_APP_SHEMA_HOST_PORT
        ).reverse_full(
            'reset_password',
            args=(
                urlsafe_base64_encode(force_bytes(user.pk)),
                token_generator.make_token(user)
            )
        )


class CheckUserTokenForm(forms.Form):
    """
    Check up activation token form
    """
    uidb64 = forms.CharField(min_length=1)
    token = forms.CharField(min_length=2, max_length=33)

    @property
    def user(self) -> User:
        """
        :rtype: User
        """
        try:
            user_model = get_user_model()

            uidb64 = self.cleaned_data.get('uidb64')

            uid = urlsafe_base64_decode(uidb64).decode()
            return user_model.objects.get(pk=uid)
        except (AttributeError, TypeError, ValueError, OverflowError):
            raise ParseError('Request data is invalid')
        except ObjectDoesNotExist:
            raise NotFound(_('No user found'))

    def clean_token(self) -> str:
        """
        :rtype: str
        """
        token = self.cleaned_data.get('token')

        if not self._token_generator.check_token(self.user, token):
            raise forms.ValidationError(_('Token is invalid.'))

        return token

    @property
    def _token_generator(self):
        """
        :return: token generator should be returned
        """
        return default_token_generator


class CheckResetPasswordTokenForm(CheckUserTokenForm):
    """
    Checks wheter provided password reset token is valid
    """


class SetPasswordForm(CheckResetPasswordTokenForm):
    """
    A form that lets a user change set their password without entering the old
    password
    """

    error_messages = {
        'password_mismatch': _('Passwords do not match.'),
    }

    new_password1 = forms.CharField(
        label=_("New password"),
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
        strip=False
    )
    new_password2 = forms.CharField(
        label=_("New password confirmation"),
        strip=False
    )

    def clean_new_password2(self) -> str:
        """
        :rtype: str
        """
        password1 = self.cleaned_data.get('new_password1')
        password2 = self.cleaned_data.get('new_password2')
        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError(
                    self.error_messages['password_mismatch'],
                    code='password_mismatch',
                )
        password_validation.validate_password(password2, self.user)

        return password2

    def save(self, commit: bool = True) -> User:
        """
        :type commit: bool

        :rtype: User
        """
        password = self.cleaned_data["new_password1"]
        user = self.user
        user.set_password(password)

        if commit:
            user.save()

        return user


class UserActivationForm(CheckUserTokenForm):
    """
    Activates user if token is valid
    """

    @property
    def _token_generator(self) -> TokenGenerator:
        """
        :rtype: TokenGenerator
        """
        return TokenGenerator()

    def save(self) -> User:
        """
        :rtype: User
        """
        user = self.user

        user.is_active = True
        return user.save()
