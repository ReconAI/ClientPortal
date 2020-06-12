"""
Set of forms made use of within applicatoin
"""

from django import forms
from django.contrib.auth.forms import UserCreationForm, UsernameField
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
