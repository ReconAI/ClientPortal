from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from recon_db_manager.models import RelevantData
from reporting_tool.serializers import RelevantDataSerializer
from shared.permissions import IsActive, PaymentRequired


class RelevantDataView(ListAPIView):
    serializer_class = RelevantDataSerializer

    permission_classes = (IsAuthenticated, IsActive, PaymentRequired)

    queryset = RelevantData.objects.all()