"""
Contains forms associated with user management procedures
"""
from django import forms
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site
from django.core import validators
from django.forms import ModelForm
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from requests import Request

from reporting_tool.forms.accounts import UserForm
from reporting_tool.forms.utils import CheckUserTokenForm, RoleFieldMixin
from reporting_tool.frontend.router import Router
from reporting_tool.tokens import InvitationTokenGenerator
from shared.models import User, UserGroup
from shared.utils import SendEmailMixin


class UserEditForm(ModelForm):
    """
    Validate data coming to change user's data
    """
    class Meta:
        """
        Just four fields are editable for admin
        """
        model = get_user_model()
        fields = (
            "firstname", "lastname", "address", "phone"
        )


class UserInvitationForm(ModelForm, RoleFieldMixin, SendEmailMixin):
    """
    In order to be invited all the initial data must be valid
    """
    SLUG_ERROR_MSG = _('should consist of latin letters, '
                       'numbers, underscores or hyphens.')

    role = RoleFieldMixin.role
    firstname = forms.CharField(required=True, error_messages={
        'invalid': '{} {}'.format(_('First name'), SLUG_ERROR_MSG)
    }, validators=[validators.validate_slug])
    lastname = forms.CharField(required=True, error_messages={
        'invalid': '{} {}'.format(_('Last name'), SLUG_ERROR_MSG)
    }, validators=[validators.validate_slug])

    def __init__(self, organization_id: int, *args, **kwargs):
        """
        :type organization_id: int
        :type args: tuple
        :type kwargs: dict
        """
        super().__init__(*args, **kwargs)

        self.__organization_id = organization_id

    class Meta:
        """
        firstname, lastname, email must be filled and examined
        username is the string compiled from first and last names
        """
        model = get_user_model()
        fields = ('firstname', 'lastname', 'email')

    def save(self, request: Request) -> User:
        """
        :type request: Request

        :rtype: User
        """
        user = super().save(False)
        user.organization_id = self.__organization_id
        user.username = self.__generate_username(user.firstname, user.lastname)

        role = self.cleaned_data.get('role')

        user.save()
        UserGroup.objects.create(user=user, group=role)

        self.send_mail(
            [user.email],
            'emails/user_invitation_subject.txt',
            'emails/user_invitation.html',
            request=request,
            user=user
        )

        return user

    def get_email_context(self, request: Request, user: User) -> dict:
        """
        :type request: Request
        :type user: User

        :rtype: dict
        """
        return {
            'user': user,
            'app_name': settings.APP_NAME,
            'site_name': get_current_site(request),
            'invitation_link': Router(
                settings.CLIENT_APP_SHEMA_HOST_PORT
            ).reverse_full(
                'follow_invitation',
                args=(
                    urlsafe_base64_encode(force_bytes(user.pk)),
                    InvitationTokenGenerator().make_token(user)
                )
            )
        }

    def __generate_username(self, firstname: str, lastname: str):
        # get a slug of the firstname and last name.
        # it will normalize the string and add dashes for spaces
        # i.e. 'HaRrY POTTer' -> 'harry_potter'
        u_username = slugify('{}_{}'.format(firstname, lastname))

        # count the number of users that start with the username
        count = get_user_model().base_object.filter(
            username__startswith=u_username
        ).count()

        if not count:
            return u_username

        while self.Meta.model.base_object.filter(
                username__startswith='{}{}'.format(u_username, count)
        ).exists():
            count += 1

        return '{}{}'.format(u_username, count)


class CheckUserInvitationTokenForm(CheckUserTokenForm):
    """
    User invitation token must be check by means the form
    """

    @property
    def _token_generator(self) -> InvitationTokenGenerator:
        """
        :rtype: InvitationTokenGenerator
        """
        return InvitationTokenGenerator()


class FollowInvitationForm(UserForm, CheckUserInvitationTokenForm):
    """
    User invitation token
    and incoming user credentials must be check by means the form
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.instance = self.user

    class Meta:
        """
        All the fields are required.
        """
        model = get_user_model()
        fields = (
            'username', 'firstname', 'lastname', 'address', 'phone'
        )

    def save(self, commit: bool = True) -> User:
        """
        Saves a user data to db

        :type commit: bool

        :rtype: User
        """
        self.instance.set_password(self.cleaned_data['password2'])
        self.instance.is_active = True
        self.instance.save()

        return self.instance
