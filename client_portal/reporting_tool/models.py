"""
Reporting tool models are located here
"""
import binascii
import os
import unicodedata
from typing import Tuple

from django.contrib.auth.hashers import make_password, check_password, \
    is_password_usable
from django.contrib.auth.models import Group
from django.db import models, router
from django.db.models.deletion import Collector
from django.db.transaction import atomic
from django.utils.crypto import salted_hmac
from django.utils.translation import gettext_lazy as _

from recon_db_manager.models import CommonUser, Organization
from reporting_tool.managers import UserManager
from reporting_tool.permissions import PermissionsMixin


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

    class Meta:
        """
        User model's Meta class specification
        Managed should be true cause its table is located in external db
        """
        managed = False
        db_table = 'Users'

    objects = UserManager()

    def __str__(self) -> str:
        return str.capitalize(self.username)

    @property
    def is_anonymous(self) -> bool:
        """
        Authenticated user is not anonymous

        :rtype: bool
        """
        return False

    @property
    def last_login(self):
        """
        Last login is required for client part but was not defined in db
        """
        return None

    @property
    def is_superuser(self) -> bool:
        """
        User is counted as superuser when his role is SUPER_ADMIN
        :rtype: bool
        """
        return UserGroup.objects.select_related('group').get(
            user_id=self.id).group.name == Role.SUPER_ADMIN

    @property
    def is_staff(self) -> bool:
        """
        :rtype: bool
        """
        return True

    @property
    def user_permissions(self) -> list:
        """
        :rtype: list
        """
        return []

    @property
    def is_authenticated(self) -> bool:
        """
        Always return True. This is a way to tell if the user has been
        authenticated in templates.
        """
        return True

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
    @atomic(using='recon_ai_db')
    def delete(self, using: str = None,
               keep_parents: bool = False) -> Tuple[int, dict]:
        """
        Deletes user apart from his/her related models

        :type using: str
        :type keep_parents: bool

        :rtype: Tuple[int, dict]
        """
        using = using or router.db_for_write(self.__class__, instance=self)
        assert self.pk is not None, (
            "%s object can't be deleted because its %s(pk) is set to None." %
            (self._meta.object_name, self._meta.pk.attname)
        )

        collector = Collector(using=using)
        collector.collect([self], collect_related=False,
                          keep_parents=keep_parents)
        return collector.delete()


class UserGroup(models.Model):
    """
    UserGroup model
    Responsible for one-to-one relation Group - User
    """
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user_id = models.IntegerField(unique=True, db_column='userId')


class Token(models.Model):
    """
    The default authorization token model.
    """
    key = models.CharField(_("Key"), max_length=40, primary_key=True)
    user_id = models.IntegerField(_("User"), db_column='user_id')
    created = models.DateTimeField(_("Created"), auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = self.generate_key()
        return super().save(*args, **kwargs)

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

    @property
    def user(self) -> User:
        """
        :rtype: User
        """
        return User.objects.get(pk=self.user_id)


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
