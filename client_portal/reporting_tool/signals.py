"""
Application signals are defined here
"""

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from reporting_tool.managers import IaMUserManager
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
        return IaMUserManager().create(username=instance.username,
                                       **UserSerializer(instance).data)

    return IaMUserManager().update(username=instance.username,
                                   **UserSerializer(instance).data)


@receiver(post_delete, sender=User)
def delete_iam_user(instance: User, **kwargs):
    """
    Once user is deleted, IaM user should be deleted either

    :type instance: User
    :type kwargs: dict
    """
    return IaMUserManager().delete(username=instance.username)


@receiver(post_delete, sender=User)
def delete_usergroup(instance: User, **kwargs):
    """
    Since user's table is located in external db it's emulation of
    CASCADE deletion

    :type instance: User
    :type kwargs: dict
    """
    return UserGroup.objects.filter(user_id=instance.pk).delete()
