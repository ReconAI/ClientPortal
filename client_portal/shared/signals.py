"""
Application signals are defined here
"""
from django.core.exceptions import ObjectDoesNotExist
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import User


@receiver(post_save, sender=User)
def sync_iam_user(instance: User, created: bool, **kwargs):
    """
    IaM user should be created/updated

    :type instance: User
    :type created: bool
    :type kwargs: dict
    """
    if created:
        return instance.iam.get_or_create()

    return instance.iam.update()


@receiver(post_delete, sender=User)
def delete_iam_user(instance: User, **kwargs):
    """
    Once user is deleted, IaM user should be deleted either

    :type instance: User
    :type kwargs: dict
    """
    return instance.iam.delete()


@receiver(post_delete, sender=User)
def delete_usergroup(instance: User, **kwargs):
    """
    Since user's table is located in external db it's emulation of
    CASCADE deletion

    :type instance: User
    :type kwargs: dict
    """
    try:
        return instance.usergroup.delete()
    except ObjectDoesNotExist:
        return True


@receiver(post_delete, sender=User)
def delete_token(instance: User, **kwargs):
    """
    Since user's table is located in external db it's emulation of
    CASCADE deletion

    :type instance: User
    :type kwargs: dict
    """
    try:
        return instance.token.delete()
    except ObjectDoesNotExist:
        return True
