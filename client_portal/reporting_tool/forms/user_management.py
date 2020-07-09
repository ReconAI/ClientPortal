"""
Contains forms associated with user management procedures
"""
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.forms import ModelForm
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.utils.text import slugify
from requests import Request

from reporting_tool.forms.accounts import UserForm, \
    UserEditForm as ProfileEditForm
from reporting_tool.forms.utils import CheckUserTokenForm, RoleFieldMixin, \
    SendEmailMixin
from reporting_tool.frontend.router import Router
from reporting_tool.models import User, UserGroup
from reporting_tool.tokens import InvitationTokenGenerator


class UserEditForm(ProfileEditForm, RoleFieldMixin):
    """
    Validate data coming to change user's data
    """
    role = RoleFieldMixin.role

    class Meta:
        """
        All fields apart from id should be editable
        """
        model = User
        fields = (
            "username", "firstname", "lastname", "address", "phone"
        )

    def save(self, commit=True):
        saved = super().save()

        self.instance.usergroup.group = self.cleaned_data.get('role')
        self.instance.usergroup.save()

        return saved


class UserInvitationForm(ModelForm, RoleFieldMixin, SendEmailMixin):
    """
    In order to be invited all the initial data must be valid
    """
    role = RoleFieldMixin.role

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
        model = User
        fields = ('firstname', 'lastname', 'email')

    def save(self, request: Request) -> User:
        """
        :type request: Request

        :rtype: User
        """
        user = super().save(False)
        user.is_active = True
        user.organization_id = self.__organization_id
        user.username = self.__generate_username(user.firstname, user.lastname)

        role = self.cleaned_data.get('role')

        user.save()
        UserGroup.objects.create(user=user, group=role)

        self.send_mail(
            user.email,
            'emails/user_invitation_subject.txt',
            'emails/user_invitation.html',
            request,
            user
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

    @staticmethod
    def __generate_username(firstname: str, lastname: str):
        # get a slug of the firstname and last name.
        # it will normalize the string and add dashes for spaces
        # i.e. 'HaRrY POTTer' -> 'harry_potter'
        u_username = slugify('{}_{}'.format(firstname, lastname))

        # count the number of users that start with the username
        count = User.objects.filter(username__startswith=u_username).count()

        if count:
            return '{}{}'.format(u_username, count)

        return u_username


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
        model = User
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

        return self.instance.save()
