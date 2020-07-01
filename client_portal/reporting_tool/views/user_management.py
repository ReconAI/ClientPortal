from django.db.models.query import QuerySet
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from reporting_tool.models import User
from reporting_tool.permissions import IsCompanyAdmin
from reporting_tool.serializers import UserSerializer


class UserList(ListAPIView):
    permission_classes = (IsAuthenticated, IsCompanyAdmin)

    serializer_class = UserSerializer

    queryset = User.objects.prefetch_related('usergroup__group').all()

    def filter_queryset(self, queryset: QuerySet) -> QuerySet:
        """
        :type queryset: QuerySet

        :rtype: QuerySet
        """
        return queryset.filter(
            organization_id=self.request.user.organization_id
        )
