from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from reporting_tool.models import User
from reporting_tool.permissions import IsCompanyAdmin
from reporting_tool.serializers import UserSerializer


class UserList(ListAPIView):
    permission_classes = (IsAuthenticated, IsCompanyAdmin)

    serializer_class = UserSerializer
    queryset = User.objects.all()
