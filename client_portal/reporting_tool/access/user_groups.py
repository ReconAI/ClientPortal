from django.contrib.auth.models import Group
from django.utils.functional import LazyObject


class RolesCollection(LazyObject):
    def _setup(self):
        self._wrapped = Group.objects.all()


# This global object represents the default admin site, for the common case.
# You can provide your own AdminSite using the (Simple)AdminConfig.default_site
# attribute. You can also instantiate AdminSite in your own code to create a
# custom admin site.
groups = RolesCollection()
