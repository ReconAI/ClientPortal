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


class SignupForm(UserCreationForm):
    """
    SignupForm with the next behavior:
        - when user signs up, he/she is attached to the ADMIN user group
    """
    email = forms.EmailField(
        label=_("Email"),
        required=True,
    )

    class Meta:
        """
        Fields username, email are required.
        """
        model = User
        fields = ('username', 'email')
        field_classes = {'username': UsernameField}

    def clean(self) -> dict:
        """
        Performs incoming data validation

        :rtype: dict
        """
        cleaned_data = super().clean()

        self.instance.validate_unique()

        return cleaned_data

    def save(self, commit: bool = True) -> User:
        """
        Saves a user data to db

        :type commit: bool

        :rtype: User
        """
        user = super().save(commit=False)

        password = self.cleaned_data["password1"]

        # fixme replace with newly created organization
        organization = Organization.objects.first()

        return self._meta.model.objects.create_admin(user.username,
                                                     organization,
                                                     self.data.get('email'),
                                                     password)


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


class SetPasswordForm(forms.Form):
    """
    A form that lets a user change set their password without entering the old
    password
    """
    token_generator = default_token_generator

    error_messages = {
        'password_mismatch': _('The two password fields didn’t match.'),
    }

    uidb64 = forms.CharField()
    token = forms.CharField()
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

    def __init__(self, *args, **kwargs):
        """
        :type args: list
        :type kwargs: dict
        """
        self.__user = None

        super().__init__(*args, **kwargs)

    @property
    def user(self) -> User:
        """
        :rtype: User
        """
        if self.__user is None:
            try:
                user_model = get_user_model()

                uid = urlsafe_base64_decode(
                    self.cleaned_data.get('uidb64')).decode()
                self.__user = user_model.objects.get(pk=uid)
            except (TypeError, ValueError,
                    OverflowError, user_model.DoesNotExist):
                raise ValidationError(_('No user found'))

        return self.__user

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

    def clean_token(self) -> str:
        """
        :rtype: str
        """
        token = self.cleaned_data.get('token')

        if not self.token_generator.check_token(self.user, token):
            raise forms.ValidationError(_('Token is invalid'))

        return token

    def save(self, commit: bool = True) -> User:
        """
        :type commit: bool

        :rtype: User
        """
        password = self.cleaned_data["new_password1"]
        self.__user.set_password(password)

        if commit:
            self.__user.save()

        return self.__user
