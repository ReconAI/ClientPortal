"""
Defines managers to manipulate data form diverse sources
"""
from abc import abstractmethod
from typing import Dict, List

import boto3
from django.conf import settings
from django.contrib.auth.models import UserManager as UserManagerBase, Group
from django.utils.module_loading import import_string

from recon_db_manager.models import Organization, User


class UserManager(UserManagerBase):
    """
    User's manager
    """

    def __create(self, organization: Organization, role: str, **extra_fields):
        """
        :type organization: Organization
        :type role: str
        :type extra_fields: dict

        :rtype: User

        :raise: NotFoundExcelption
        """
        from reporting_tool.models import UserGroup

        user = self._create_user(organization=organization, **extra_fields)

        super_admin_group = Group.objects.get(name=role)
        UserGroup.objects.create(user_id=user.id, group=super_admin_group)

        return user

    def create_admin(self, organization: Organization, **extra_fields):
        """
        :type organization: Organization

        :rtype: User
        """
        from reporting_tool.models import Role

        return self.__create(organization, Role.ADMIN, **extra_fields)

    def create_developer(self, organization: Organization, **extra_fields):
        """
        :type organization: Organization
        :type extra_fields: dict

        :rtype: User
        """
        from reporting_tool.models import Role

        return self.__create(organization, Role.DEVELOPER, **extra_fields)

    def create_client(self, organization: Organization, **extra_fields):
        """
        :type organization: Organization
        :type extra_fields: dict

        :rtype: User
        """
        from reporting_tool.models import Role

        return self.__create(organization, Role.CLIENT, **extra_fields)

    def create_superuser(self, **extra_fields):
        """
        :type extra_fields: dict

        :rtype: User

        :raise: NotFoundException
        """
        from reporting_tool.models import Role

        extra_fields.update({
            'is_active': True
        })

        return self.__create(Organization.root(), Role.SUPER_ADMIN,
                             **extra_fields)


class AbstractIaMUserManager:
    """
    Interface for user iam manager
    """

    def __init__(self, instance: User):
        """
        :type instance: User
        """
        self._instance = instance

    @abstractmethod
    def get(self):
        """
        Gets user from the service
        """

    @abstractmethod
    def create(self):
        """
        Creates a user within IaM
        """

    @abstractmethod
    def update(self):
        """
        Updates a user within IaM
        """

    @abstractmethod
    def delete(self):
        """
        Removes user from IaM. It's required to remove user from any
        group beforehand
        """

    @abstractmethod
    def add_user_to_group(self, group_name: str):
        """
        Attach user to group

        :type group_name: str
        """

    @abstractmethod
    def remove_user_from_group(self, group_name: str):
        """
        Removes user from group

        :type group_name: str
        """


class IaMUserManager(AbstractIaMUserManager):
    """
    Manages data from IaM service
    """
    __user_serializer = 'reporting_tool.serializers.UserSerializer'

    def __init__(self, instance: User):
        """
        :type instance: User
        """
        super().__init__(instance)

        self.__iam = boto3. \
            client('iam', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                   aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)

    def get(self):
        """
        Gets user from the service

        :type: str
        """
        return self.__iam.get_user(UserName=self._instance.username)

    def create(self):
        """
        Creates a user within IaM
        """
        self.__iam.create_user(UserName=self._instance.username,
                               Tags=self.__tags)
        self.add_user_to_group(settings.AWS_IAM_USER_GROUP)

    def update(self):
        """
        Updates a user within IaM
        """
        try:
            user = self.get()
            self.__iam.tag_user(UserName=self._instance.username,
                                Tags=self.__tags)
            return user
        except self.__iam.exceptions.NoSuchEntityException:
            return self.create()

    def delete(self):
        """
        Removes user from IaM. It's required to remove user from any
        group beforehand
        """
        try:
            self.remove_user_from_group(settings.AWS_IAM_USER_GROUP)
            return self.__iam.delete_user(UserName=self._instance.username)
        except self.__iam.exceptions.NoSuchEntityException:
            return True

    def add_user_to_group(self, group_name: str):
        """
        Attach user to group

        :type group_name: str
        """
        return self.__iam.add_user_to_group(
            UserName=self._instance.username,
            GroupName=group_name
        )

    def remove_user_from_group(self, group_name: str):
        """
        Removes user from group

        :type group_name: str
        """
        return self.__iam.remove_user_from_group(
            UserName=self._instance.username,
            GroupName=group_name
        )

    @property
    def __tags(self) -> List[Dict]:
        """
        Translates kwargs to user tags

        :rtype: List[Dict]
        """
        exclude = ['username']
        data = import_string(self.__user_serializer)(self._instance).data

        return [
            {'Key': key, 'Value': str(value)}
            for key, value
            in data
            if key not in exclude
        ]


class DummyIaMUserManager(AbstractIaMUserManager):
    """
    Implementation of dummy iam user manager.
    Doesn't send anything. Use it within local/testing environment.
    """

    def get(self):
        """
        Gets user from the service
        """

    def create(self):
        """
        Creates a user within IaM
        """

    def update(self):
        """
        Updates a user within IaM
        """

    def delete(self):
        """
        Removes user from IaM. It's required to remove user from any
        group beforehand
        """

    def add_user_to_group(self, group_name: str):
        """
        Attach user to group

        :type group_name: str
        """

    def remove_user_from_group(self, group_name: str):
        """
        Removes user from group

        :type group_name: str
        """
