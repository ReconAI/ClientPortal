"""
Set of forms made use of within applicatoin
"""

from django import forms
from django.contrib.auth import get_user_model, password_validation
from django.contrib.auth.forms import UserCreationForm, UsernameField, \
    PasswordResetForm as PasswordResetFormBase
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.utils.http import urlsafe_base64_decode
from django.utils.translation import gettext_lazy as _

from reporting_tool.models import Organization, User


class PreSignupForm(UserCreationForm):
    """
    Performs inital validation before signing a user up
    """

    class Meta:
        """
        Fields username, email are required.
        """
        model = User
        fields = ('username',)
        field_classes = {'username': UsernameField}

    def clean(self) -> dict:
        """
        Performs incoming data validation

        :rtype: dict
        """
        cleaned_data = super().clean()

        self.instance.validate_unique()

        return cleaned_data


class SignupForm(PreSignupForm):
    """
    SignupForm with the next behavior:
        - when user signs up, he/she is attached to the ADMIN user group
    """
    email = forms.EmailField(label=_("Email"))
    firstname = forms.CharField(label=_("First name"))
    lastname = forms.CharField(label=_("Last name"))

    class Meta:
        """
        Fields username, email are required.
        """
        model = User
        fields = ('username', 'email', 'firstname', 'lastname', 'password')
        field_classes = {'username': UsernameField}

    def save(self, commit: bool = True) -> User:
        """
        Saves a user data to db

        :type commit: bool

        :rtype: User
        """
        data = self.cleaned_data
        self.cleaned_data["password"] = data.pop("password1")
        data.pop('password2')

        # fixme replace with newly created organization
        organization = Organization.objects.first()

        return self._meta.model.objects.create_admin(organization, **data)


class PasswordResetForm(PasswordResetFormBase):
    """
    Password reset form implementation.
    On reset password user gets the link to password reset form
    """
    # fixme customize reset password link in accordance with client server

    def clean_email(self) -> dict:
        """
        Performs incoming data validation

        :rtype: dict
        """

        email = self.data["email"]

        try:
            get_user_model().objects.get(email=email)
        except ObjectDoesNotExist:
            raise ValidationError(_("No user found"))

        return email


class CheckResetPasswordTokenForm(forms.Form):
    """
    Checks wheter provided password reset token is valid
    """

    _token_generator = default_token_generator

    uidb64 = forms.CharField()
    token = forms.CharField()

    def __init__(self, *args, **kwargs):
        """
        :type args: list
        :type kwargs: dict
        """
        self._user = None

        super().__init__(*args, **kwargs)

    @property
    def user(self) -> User:
        """
        :rtype: User
        """
        if self._user is None:
            try:
                user_model = get_user_model()

                uid = urlsafe_base64_decode(
                    self.cleaned_data.get('uidb64')).decode()
                self._user = user_model.objects.get(pk=uid)
            except (TypeError, ValueError,
                    OverflowError, ObjectDoesNotExist):
                raise ValidationError(_('No user found'))

        return self._user

    def clean_token(self) -> str:
        """
        :rtype: str
        """
        token = self.cleaned_data.get('token')

        if not self._token_generator.check_token(self.user, token):
            raise forms.ValidationError(_('Token is invalid'))

        return token


class SetPasswordForm(CheckResetPasswordTokenForm):
    """
    A form that lets a user change set their password without entering the old
    password
    """

    error_messages = {
        'password_mismatch': _('The two password fields didn’t match.'),
    }

    new_password1 = forms.CharField(
        label=_("New password"),
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
        strip=False,
        help_text=password_validation.password_validators_help_text_html(),
    )
    new_password2 = forms.CharField(
        label=_("New password confirmation"),
        strip=False,
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
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
        self._user.set_password(password)

        if commit:
            self._user.save()

        return self._user
