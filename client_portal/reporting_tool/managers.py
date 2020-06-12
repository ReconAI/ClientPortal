"""
Defines managers to manipulate data form diverse sources
"""
from typing import Dict, List

import boto3
from django.conf import settings
from django.contrib.auth.models import UserManager as UserManagerBase, Group
from django.db.transaction import atomic

from recon_db_manager.models import Organization


class UserManager(UserManagerBase):
    """
    User's manager
    """

    def __create(self, username: str, organization: Organization,
                 role: str, email: str = None,
                 password: str = None, **extra_fields):
        """
        :type username: str
        :type organization: Organization
        :type role: str
        :type email: str
        :type password: str
        :type extra_fields: dict

        :rtype: User

        :raise: NotFoundExcelption
        """
        from reporting_tool.models import UserGroup

        user = self._create_user(username, email, password,
                                 organization=organization, **extra_fields)

        super_admin_group = Group.objects.get(name=role)
        UserGroup.objects.create(user_id=user.id, group=super_admin_group)

        return user

    def create_admin(self, username: str, organization: Organization,
                     email: str = None, password: str = None, **extra_fields):
        """
        :type username: str
        :type organization: Organization
        :type email: str
        :type password: str
        :type extra_fields: dict

        :rtype: User
        """
        from reporting_tool.models import Role

        return self.__create(username, organization,
                             Role.ADMIN, email, password, **extra_fields)

    def create_developer(self, username: str, organization: Organization,
                         email: str = None, password: str = None,
                         **extra_fields):
        """
        :type username: str
        :type organization: Organization
        :type email: str
        :type password: str
        :type extra_fields: dict

        :rtype: User
        """
        from reporting_tool.models import Role

        return self.__create(username, organization, Role.DEVELOPER,
                             email, password, **extra_fields)

    def create_client(self, username: str, organization: Organization,
                      email: str = None, password: str = None, **extra_fields):
        """
        :type username: str
        :type organization: Organization
        :type email: str
        :type password: str
        :type extra_fields: dict

        :rtype: User
        """
        from reporting_tool.models import Role

        return self.__create(username, organization, Role.CLIENT, email,
                             password, **extra_fields)

    @atomic
    def create_superuser(self, username: str, email: str = None,
                         password: str = None, **extra_fields):
        """
        :type username: str
        :type email: str
        :type password: str
        :type extra_fields: dict

        :rtype: User

        :raise: NotFoundException
        """
        from reporting_tool.models import Role

        return self.__create(username, Organization.root(),
                             Role.SUPER_ADMIN, email, password,
                             **extra_fields)


class IaMUserManager:
    """
    Manages data from IaM service
    """

    def __init__(self):
        self.__iam = boto3. \
            client('iam', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                   aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)

    def get(self, username: str):
        """
        Gets user from the service

        :type: str
        """
        return self.__iam.get_user(UserName=username)

    def create(self, username: str, **kwargs: dict):
        """
        Creates a user within IaM

        :type username: str
        :type kwargs: dict
        """
        self.__iam.create_user(UserName=username,
                               Tags=self.__kwargs_to_tags(**kwargs))
        self.add_user_to_group(username, settings.AWS_IAM_USER_GROUP)

    def update(self, username: str, **kwargs: dict):
        """
        Updates a user within IaM

        :type username: str
        :type kwargs: dict
        """
        try:
            user = self.get(username)
            self.__iam.tag_user(UserName=username,
                                Tags=self.__kwargs_to_tags(**kwargs))
            return user
        except self.__iam.exceptions.NoSuchEntityException:
            return self.create(username, **kwargs)

    def delete(self, username: str):
        """
        Removes user from IaM. It's required to remove user from any
        group beforehand

        :type username: str
        """
        try:
            self.remove_user_from_group(username, settings.AWS_IAM_USER_GROUP)
            return self.__iam.delete_user(UserName=username)
        except self.__iam.exceptions.NoSuchEntityException:
            return True

    def add_user_to_group(self, username: str, group_name: str):
        """
        Attach user to group

        :type username: str
        :type group_name: str
        """
        return self.__iam.add_user_to_group(
            UserName=username,
            GroupName=group_name
        )

    def remove_user_from_group(self, username: str, group_name: str):
        """
        Removes user from group

        :type username: str
        :type group_name: str
        """
        return self.__iam.remove_user_from_group(
            UserName=username,
            GroupName=group_name
        )

    @classmethod
    def __kwargs_to_tags(cls: 'IaMUserManager', **kwargs: dict) -> List[Dict]:
        """
        Translates kwargs to user tags

        :type kwargs: dict

        :rtype: List[Dict]
        """
        return [{'Key': key, 'Value': str(value)} for key, value in
                kwargs.items()]
