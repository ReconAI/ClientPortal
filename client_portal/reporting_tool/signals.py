"""
Application signals are defined here
"""
from django.conf import settings
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils.module_loading import import_string

from reporting_tool.managers import AbstractIaMUserManager
from reporting_tool.models import User, UserGroup
from reporting_tool.serializers import UserSerializer


@receiver(post_save, sender=User)
def sync_iam_user(instance: User, created: bool, **kwargs):
    """
    IaM user should be created/updated

    :type instance: User
    :type created: bool
    :type kwargs: dict
    """
    if created:
        return get_iam_user_manager().create(username=instance.username,
                                             **UserSerializer(instance).data)

    return get_iam_user_manager().update(username=instance.username,
                                         **UserSerializer(instance).data)


@receiver(post_delete, sender=User)
def delete_iam_user(instance: User, **kwargs):
    """
    Once user is deleted, IaM user should be deleted either

    :type instance: User
    :type kwargs: dict
    """
    return get_iam_user_manager().delete(username=instance.username)


@receiver(post_delete, sender=User)
def delete_usergroup(instance: User, **kwargs):
    """
    Since user's table is located in external db it's emulation of
    CASCADE deletion

    :type instance: User
    :type kwargs: dict
    """
    return UserGroup.objects.filter(user_id=instance.pk).delete()


def get_iam_user_manager() -> AbstractIaMUserManager:
    """
    :rtype: AbstractIaMUserManager
    """
    return import_string(settings.AWS_IAM_USER_MANAGER)()
