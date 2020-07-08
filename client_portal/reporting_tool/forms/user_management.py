from django import forms
from django.conf import settings
from django.contrib.auth.models import Group
from django.contrib.sites.shortcuts import get_current_site
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import EmailMultiAlternatives
from django.forms import ModelForm
from django.template import loader
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from requests import Request

from reporting_tool.forms.accounts import UserForm
from reporting_tool.forms.utils import CheckUserTokenForm
from reporting_tool.frontend.router import Router
from reporting_tool.models import User, Role, UserGroup
from reporting_tool.tokens import InvitationTokenGenerator
from reporting_tool.validators import InSetValidator


class UserInvitationForm(ModelForm):
    role = forms.CharField(
        label=_("User role"),
        validators=[
            InSetValidator(options=(Role.ADMIN, Role.DEVELOPER, Role.CLIENT))
        ]
    )

    def __init__(self, organization_id: int, *args, **kwargs):
        """
        :type organization_id: int
        :type args: tuple
        :type kwargs: dict
        """
        super().__init__(*args, **kwargs)

        self.__organization_id = organization_id

    class Meta:
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

        self.__send_invitation_mail(request, user)

        return user

    def clean_role(self) -> Group:
        """
        :rtype: Group

        :raise: ValidationError
        """
        role = self.data["role"]

        try:
            return Group.objects.get(name=role)
        except ObjectDoesNotExist:
            raise forms.ValidationError(_('Invalid role'))

    @staticmethod
    def __generate_username(firstname: str, lastname: str):
        # get a slug of the firstname and last name.
        # it will normalize the string and add dashes for spaces
        # i.e. 'HaRrY POTTer' -> 'harry-potter'
        u_username = slugify('{}{}'.format(firstname, lastname))

        # count the number of users that start with the username
        count = User.objects.filter(username__startswith=u_username).count()

        if count:
            return '{}{}'.format(u_username, count)

        return u_username

    @staticmethod
    def __send_invitation_mail(request: Request, user: User):
        message = render_to_string('emails/user_invitation.html', {
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
        })

        subject = loader.render_to_string(
            'emails/user_invitation_subject.txt',
            {
                'site_name': get_current_site(request)
            }
        )

        EmailMultiAlternatives(
            ''.join(subject.splitlines()),
            message,
            to=[user.email]
        ).send()


class CheckUserInvitationTokenForm(CheckUserTokenForm):
    @property
    def _token_generator(self) -> InvitationTokenGenerator:
        """
        :rtype: InvitationTokenGenerator
        """
        return InvitationTokenGenerator()


class FollowInvitationForm(UserForm, CheckUserInvitationTokenForm):
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
