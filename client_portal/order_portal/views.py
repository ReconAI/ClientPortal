from rest_framework.generics import ListCreateAPIView, \
    RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated

from order_portal.serizalizers import CategorySerializer
from recon_db_manager.models import Category
from shared.permissions import IsActive, IsSuperUser, PaymentRequired


class CategoryOperator:
    serializer_class = CategorySerializer

    permission_classes = (IsAuthenticated, IsActive,
                          IsSuperUser, PaymentRequired)

    queryset = Category.objects.all()


class CategoryList(CategoryOperator, ListCreateAPIView):
    pass


class CategoryItem(CategoryOperator, RetrieveUpdateDestroyAPIView):
    pass
