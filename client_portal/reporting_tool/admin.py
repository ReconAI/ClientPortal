"""
This module sets custom admin site with settings overriden
"""

from django.contrib import admin
from django.contrib.admin.sites import DefaultAdminSite


class Admin(DefaultAdminSite):
    """
    Class describing admin site properties
    """


admin.site.index_template = 'admin/admin_index.html'
admin.site.site_header = 'Recon AI Admin'
admin.site.site_title = 'Recon AI Admin'
admin.site.index_title = 'Recon AI Admin'
admin.site.site_url = ""
