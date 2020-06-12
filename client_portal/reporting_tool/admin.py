"""
This module sets custom admin site with settings overriden
"""

from django.contrib import admin
from django.contrib.admin.sites import DefaultAdminSite
from django.contrib.auth.models import Group


class Admin(DefaultAdminSite):
    """
    Class describing admin site properties
    """
    site_header = 'Recon AI Admin'
    site_title = 'Recon AI Admin'
    index_title = 'Recon AI Admin'
    site_url = ""
    index_template = 'admin/admin_index.html'


admin.site = Admin()
admin.site.register(Group)
