"""
Url rules for frontend service
"""

from reporting_tool.frontend.router import url

urlpatterns = [
    url('activate/<str:uidb64>/<str:token>', name='activate'),
    url('reset/<str:uidb64>/<str:token>', name='reset_password')
]