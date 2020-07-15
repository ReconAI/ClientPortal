"""
Stores classes describing access logic
"""
from urllib.request import Request

from django.contrib import auth
from rest_framework.permissions import BasePermission


def _user_get_permissions(user, obj, from_name):
    permissions = set()
    name = 'get_%s_permissions' % from_name
    for backend in auth.get_backends():
        if hasattr(backend, name):
            permissions.update(getattr(backend, name)(user, obj))
    return permissions


class PermissionsMixin:
    """
    Defines user permissions logic
    """
    def get_user_permissions(self, obj=None):
        """
        Return a list of permission strings that this user has directly.
        Query all available auth backends. If an object is passed in,
        return only permissions matching this object.
        """
        return _user_get_permissions(self, obj, 'user')

    def get_group_permissions(self, obj=None):
        """
        Return a list of permission strings that this user has through their
        groups. Query all available auth backends. If an object is passed in,
        return only permissions matching this object.
        """
        return _user_get_permissions(self, obj, 'group')

    def get_all_permissions(self, obj=None):
        """
        Returns list of all permissions
        """
        return _user_get_permissions(self, obj, 'all')

    def has_perm(self, *args, **kwargs) -> bool:
        """
        Return True if the user has the specified permission. Query all
        available auth backends, but return immediately if any backend returns
        True. Thus, a user who has permission from a single auth backend is
        assumed to have permission in general. If an object is provided, check
        permissions for that object.
        """
        # Active superusers have all permissions.
        return self.is_superuser

    def has_perms(self, *args, **kwargs) -> bool:
        """
        Return True if the user has each of the specified permissions. If
        object is passed, check if the user has all required perms for it.
        """
        return self.is_superuser

    def has_module_perms(self, *args) -> bool:
        """
        Return True if the user has any permissions in the given app label.
        Use similar logic as has_perm(), above.
        """
        # Active superusers have all permissions.
        return self.is_superuser


class IsNotAuthenticated(BasePermission):
    """
    Allows access only to non authenticated users.
    """

    def has_permission(self, request: Request, view) -> bool:
        return (
            not request.user
            or request.user.is_anonymous
            or not request.user.is_authenticated
        )


class IsActive(BasePermission):
    """
    User must be active to proceed
    """
    def has_permission(self, request: Request, view) -> bool:
        """
        :type request: Request
        :param view:

        :rtype: bool
        """
        return request.user.is_active


class IsCompanyAdmin(BasePermission):
    """
    User must be company admin to proceed
    """
    def has_permission(self, request: Request, view) -> bool:
        """
        :type request: Request
        :param view:

        :rtype: bool
        """
        user = request.user

        return user.is_superuser or user.is_admin


class IsSuperUser(BasePermission):
    """
    User must be company admin to proceed
    """
    def has_permission(self, request: Request, view) -> bool:
        """
        :type request: Request
        :param view:

        :rtype: bool
        """
        user = request.user

        return user.is_superuser


class PaymentRequired(BasePermission):
    """
    User must pay for the service
    """
    def has_permission(self, request: Request, view) -> bool:
        """
        :type request: Request
        :param view:

        :rtype: bool
        """
        user = request.user

        return user.is_superuser or user.is_on_trial
