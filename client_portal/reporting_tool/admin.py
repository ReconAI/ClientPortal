from django.contrib import admin
from django.contrib.admin import AdminSite


class Admin(AdminSite):
    pass


admin.site = Admin()
