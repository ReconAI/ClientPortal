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
from django.contrib import admin
from django.urls import path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

from .views.accounts import SignupView, ActivateView, CurrentUserProfileView, \
    ObtainAuthToken, LogoutView, ResetPassword, PasswordResetConfirmView, \
    PreSignupValidationView, CheckResetPasswordTokenView, ChangePassword
from .views.new_features import NewFeatureView
from .views.orders import OrdersListView, OrderItemView, OrderItemDownload
from .views.payment_methods import CardListView, DefaultPaymentMethodView
from .views.relevant_data import RelevantDataView, \
    RelevantDataVehiclesView, \
    RelevantDataEventsVehiclesView, \
    RelevantDataProjectsView, RelevantDataRoadConditionsView, \
    ExportRelevantDataView, RouteGenerationView, RelevantDataHeatMapView, \
    RelevantDataLicensePlatesView, RelevantDataPedestrianTransitTypeView, \
    RelevantDataImportView
from .views.sensors import SensorSetGPSView, RelevantDataSensorView, \
    SensorsListView, SensorsItemView
from .views.user_management import UserList, UserItem, InvitationView

urlpatterns = [
    path('signup', SignupView.as_view(), name='signup'),
    path('pre-signup', PreSignupValidationView.as_view(), name='pre-signup'),
    path('activate', ActivateView.as_view(), name='activate'),
    path('api-token-auth', ObtainAuthToken.as_view(), name='api_token_auth'),
    path('profile', CurrentUserProfileView.as_view(), name='profile'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('cards', CardListView.as_view(), name='cards.list'),
    path('payment-methods', DefaultPaymentMethodView.as_view(), name='payment_methods.set_default'),
    path('orders', OrdersListView.as_view(), name='orders.list'),
    path('orders/<int:pk>', OrderItemView.as_view(), name='orders.item'),
    path('orders/<int:pk>/download', OrderItemDownload.as_view(), name='orders.item.download'),

    path('reset-password', ResetPassword.as_view(), name='password_reset'),
    path('change-password', ChangePassword.as_view(), name='password_change'),
    path('reset', PasswordResetConfirmView.as_view(),
         name='password_reset_confirm'),
    path('check-reset-password-token', CheckResetPasswordTokenView.as_view(),
         name='check_reset_password_token'),

    path('users', UserList.as_view(), name='users.list'),
    path('users/<int:pk>', UserItem.as_view(), name='users.item'),
    path('users/invitations', InvitationView.as_view(), name='users.invitation'),

    path('new-features', NewFeatureView.as_view(), name='new_feature.request'),

    path('relevant-data', RelevantDataView.as_view(), name='relevant_data.list'),
    path('relevant-data/vehicle-types', RelevantDataVehiclesView.as_view(), name='relevant_data.vehicle-types'),
    path('relevant-data/event-objects', RelevantDataEventsVehiclesView.as_view(), name='relevant_data.event-objects'),
    path('relevant-data/road-weather-conditions', RelevantDataRoadConditionsView.as_view(), name='relevant_data.roadn-weather-conditions'),
    path('relevant-data/pedestrian-transit-methods', RelevantDataPedestrianTransitTypeView.as_view(), name='relevant_data.pedestrian-transit-methods'),
    path('relevant-data/projects', RelevantDataProjectsView.as_view(), name='relevant_data.projects'),
    path('relevant-data/license-plates', RelevantDataLicensePlatesView.as_view(), name='relevant_data.license-plates'),
    path('relevant-data/export/<str:export_format>', ExportRelevantDataView.as_view(), name='relevant_data.export'),
    path('relevant-data/route/<str:license_plate_number>', RouteGenerationView.as_view(), name='relevant_data.route'),
    path('relevant-data/heat-map', RelevantDataHeatMapView.as_view(), name='relevant_data.heat_map'),
    path('relevant-data/import', RelevantDataImportView.as_view(), name='relevant_data.import'),

    path('sensors', SensorsListView.as_view(), name='sensror.list'),
    path('sensors/<int:pk>', SensorsItemView.as_view(), name='sensrors.item'),
    path('sensors/<int:pk>/relevant-data', RelevantDataSensorView.as_view(), name='sensrors.relevant-data'),
    path('sensors/<int:pk>/set-gps', SensorSetGPSView.as_view(), name='sensors.set_gps'),

    path('admin/', admin.site.urls)
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    schema_view = get_schema_view(
        openapi.Info(
            title="Snippets API",
            default_version='v1',
            description="Test description",
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
