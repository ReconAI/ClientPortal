"""reporting_tool URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.urls import path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

from order_portal.views import catalogue, management
from order_portal.views.payment import BasketOverviewView, BasketPayView

urlpatterns = [
    path('management/categories', management.SyncCategoriesView.as_view(), name='management.categories.list'),
    path('management/manufacturers', management.ManufacturerListView.as_view(), name='management.manufacturers.list'),
    path('management/manufacturers/<int:pk>', management.ManufacturerItemView.as_view(), name='management.manufacturers.item'),
    path('management/devices', management.CreateDeviceView.as_view(), name='management.devices.list'),
    path('management/devices/<int:pk>', management.DeviceItemView.as_view(), name='management.devices.item'),

    path('categories', catalogue.CategoryListView.as_view(), name='categories.list'),

    path('devices', catalogue.DeviceListView.as_view(), name='devices.list'),
    path('devices/<int:pk>', catalogue.DeviceItemView.as_view(), name='devices.item'),

    path('basket/overview', BasketOverviewView.as_view(), name='basket.overview'),
    path('basket/pay', BasketPayView.as_view(), name='basket.pay')
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEBUG:
    schema_view = get_schema_view(
        openapi.Info(
            title="Recon order portal API",
            default_version='v1',
            description="Set of API endpoint available "
                        "for shop entities management",
            terms_of_service="https://www.google.com/policies/terms/",
            contact=openapi.Contact(email="contact@snippets.local"),
            license=openapi.License(name="BSD License"),
        ),
        public=True,
        permission_classes=(permissions.AllowAny,),
    )

    urlpatterns.extend([
        url(r'^swagger(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0), name='schema-json'),
        url(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0),
            name='schema-swagger-ui'),
        url(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0),
            name='schema-redoc'),
    ])
