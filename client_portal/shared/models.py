"""
Reporting tool models are located here
"""
import binascii
import os
import unicodedata
from typing import Tuple, Optional, Iterable, Type

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password, check_password, \
    is_password_usable
from django.contrib.auth.models import Group
from django.db import models
from django.db.models import QuerySet, Manager
from django.db.transaction import atomic
from django.utils.crypto import salted_hmac
from django.utils.module_loading import import_string
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _

from recon_db_manager.models import CommonUser, Organization
from shared.managers import AbstractIaMUserManager, UserManager
from shared.permissions import PermissionsMixin


class User(CommonUser, PermissionsMixin):
    """
    User model
    """
    REQUIRED_FIELDS = ['email']
    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'

    organization = models.ForeignKey(Organization, models.DO_NOTHING,
                                     db_column='organizationId',
                                     related_name='org')

    # Stores the raw password if set_password() is called so that it can
    # be passed to password_changed() after the model is saved.
    _password = None

    __iam = None

    is_anonymous = False

    # Last login is required for client part but was not defined in db
    last_login = None

    is_staff = True
    user_permissions = []
    is_authenticated = True

    class Meta:
        """
        User model's Meta class specification
        Managed should be true cause its table is located in external db
        """
        managed = False
        db_table = 'Users'
        base_manager_name = 'objects'

    objects = UserManager()
    base_object = Manager()

    def __str__(self) -> str:
        """
        :rtype: str
        """
        return str(self.username)

    @property
    def iam(self) -> AbstractIaMUserManager:
        """
        :rtype: AbstractIaMUserManager
        """
        if self.__iam is None:
            self.__iam = import_string(settings.AWS_IAM_USER_MANAGER)(self)

        return self.__iam

    @property
    def group(self) -> Group:
        """
        :rtype: Group
        """
        return self.usergroup.group

    @property
    def is_admin(self) -> bool:
        """
        User is counted as company admin when his role is ADMIN

        :rtype: bool
        """
        return self.group.name == Role.ADMIN

    @property
    def is_developer(self) -> bool:
        """
        User is counted as company developer when his role is DEVELOPER

        :rtype: bool
        """
        return self.group.name == Role.DEVELOPER

    @property
    def is_superuser(self) -> bool:
        """
        User is counted as superuser when his role is SUPER_ADMIN

        :rtype: bool
        """
        return self.group.name == Role.SUPER_ADMIN

    def set_password(self, raw_password: str):
        """
        Hashes and sets password for user

        :type raw_password: str
        """
        self.password = make_password(raw_password)
        self._password = raw_password

    def check_password(self, raw_password: str) -> bool:
        """
        Return a boolean of whether the raw_password was correct. Handles
        hashing formats behind the scenes.
        """

        def setter(raw_pass):
            self.set_password(raw_pass)
            # Password hash upgrades shouldn't be considered password changes.
            self._password = None
            self.save(update_fields=["password"])

        return check_password(raw_password, self.password, setter)

    def set_unusable_password(self):
        """
        Set a value that will never be a valid hash
        """
        self.password = make_password(None)

    def has_usable_password(self) -> bool:
        """
        Return False if set_unusable_password() has been called for this user.

        :rtype: bool
        """
        return is_password_usable(self.password)

    def get_session_auth_hash(self) -> str:
        """
        Return an HMAC of the password field.

        :rtype: str
        """
        key_salt = "django.contrib.auth.models." \
                   "AbstractBaseUser.get_session_auth_hash"

        return salted_hmac(key_salt, self.password).hexdigest()

    @classmethod
    def get_email_field_name(cls) -> str:
        """
        :rtype: str
        """
        try:
            return cls.EMAIL_FIELD
        except AttributeError:
            return 'email'

    @classmethod
    def normalize_username(cls, username: str) -> str:
        """
        :type username: str

        :rtype: str
        """
        if isinstance(username, str):
            return unicodedata.normalize('NFKC', username)

        return username

    def get_username(self) -> str:
        """
        :rtype: str
        """
        return self.username

    @atomic(using='default')
    @atomic(using=settings.RECON_AI_CONNECTION_NAME)
    def delete(self, using: str = None,
               keep_parents: bool = False) -> Tuple[int, dict]:
        """
        Deletes user apart from his/her related models

        :type using: str
        :type keep_parents: bool

        :rtype: Tuple[int, dict]
        """
        self.deleted_dt = now()

        return self.save(using=using)

    def unique_error_message(self, model_class: Type['User'],
                             unique_check: tuple) -> str:
        """
        :type model_class: Type['User']
        :type unique_check: tuple

        :rtype: str
        """
        try:
            attribute_name = unique_check[0]
            aliases = {
                'username': 'login'
            }
            alias = aliases.get(attribute_name, attribute_name)
        except (IndexError, AttributeError):
            alias = 'data'

        return _('{} you entered is not available'.format(alias.capitalize()))


class UserGroup(models.Model):
    """
    UserGroup model

    Responsible for one-to-one relation Group - User
    """

    class Meta:
        """
        User group model's meta specification
        """
        db_table = 'UserGroups'

    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.OneToOneField(User, models.CASCADE, db_column='user_id',
                                null=True, db_constraint=False)


class Token(models.Model):
    """
    The default authorization token model.
    """

    class Meta:
        """
        Token model's meta specification
        """
        db_table = 'Tokens'

    key = models.CharField(_("Key"), max_length=40, primary_key=True)
    created = models.DateTimeField(_("Created"), auto_now_add=True)
    user = models.OneToOneField(User, models.CASCADE, db_column='user_id',
                                related_name='token', null=True,
                                db_constraint=False)

    def save(self, force_insert: bool = False, force_update: bool = False,
             using: str = None, update_fields: Optional[Iterable] = None):
        """
        :type force_insert: bool
        :type force_update: bool
        :type using: str
        :type update_fields: Optional[Iterable]
        """
        if not self.key:
            self.key = self.generate_key()

        return super().save(force_insert, force_update, using, update_fields)

    @staticmethod
    def generate_key() -> str:
        """
        :rtype: str
        """
        return binascii.hexlify(os.urandom(20)).decode()

    def __str__(self) -> str:
        """
        :rtype: str
        """
        return self.key


class Role:
    """
    Describes all possible roles
    """
    SUPER_ADMIN = 'super_admin'
    ADMIN = 'admin'
    DEVELOPER = 'developer'
    CLIENT = 'client'

    ROLES = [
        SUPER_ADMIN,
        ADMIN,
        DEVELOPER,
        CLIENT
    ]

    @staticmethod
    def admins(organization: Organization,
               among: Optional[list] = None) -> QuerySet:
        """
        Returns all admins for the company

        :type organization: Organization
        :type among: Optional[list]

        :rtype: QuerySet
        """
        if among is None:
            among = list(UserGroup.objects.filter(
                group__name=Role.ADMIN
            ).values_list('user_id', flat=True))

        return get_user_model().objects.filter(
            pk__in=among,
            organization_id=organization.id
        ).all()
