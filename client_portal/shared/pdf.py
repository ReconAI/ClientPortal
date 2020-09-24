"""
Shared pdf report helpers
"""

from abc import abstractmethod, ABC
from datetime import timedelta
from typing import Dict, Any

from django.conf import settings
from django.template.loader import render_to_string
from weasyprint import HTML

from recon_db_manager.models import Organization, Purchase
from shared.serializers import OrderSerializer


class PDFDocument(ABC):
    """
    Abstract pds helper
    """

    @abstractmethod
    def template_path(self) -> str:
        """
        :rtype: str
        """

    @abstractmethod
    def template_context(self) -> Dict[str, Any]:
        """
        :rtype: Dict[str, Any]
        """

    def generate(self) -> bytes:
        """
        Renders pdf report according to context

        :rtype: bytes
        """
        html_string = render_to_string(
            self.template_path(),
            self.template_context()
        )

        return HTML(string=html_string).write_pdf()


class Order(PDFDocument):
    """
    Completes invoice pdf with monthly expenditures
    """
    def __init__(self,
                 organization: Organization,
                 root_organization: Organization,
                 order_serializer: OrderSerializer,
                 purchase: Purchase
                 ):
        """
        :param organization:
        :param order_serializer:
        """
        self.__order_serializer = order_serializer
        self.__root_organization = root_organization
        self.__organization = organization
        self.__purchase = purchase

    def template_path(self) -> str:
        """
        :rtype: str
        """
        return 'pdf/order.html'

    def template_context(self) -> Dict[str, Any]:
        """
        :rtype: Dict[str, Any]
        """
        return {
            'root_organization': self.__root_organization,
            'organization': self.__organization,
            'now': self.__purchase.created_dt.date(),
            'app_name': settings.APP_NAME,
            'currency': settings.CURRENCY,
            'due_date': (self.__purchase.created_dt + timedelta(
                days=settings.TERMS_OF_PAYMENT_DAYS
            )).date(),
            'bank_reference_code': settings.BANK_REFERENCE_CODE,
            'iban': settings.IBAN,
            'bic': settings.BIC,
            'device_unit': settings.DEVICE_UNIT,
            'terms_of_payment_days': settings.TERMS_OF_PAYMENT_DAYS,
            'interest_rate': settings.INTEREST_RATE,
            'bank_connection': settings.BANK_CONNECTION,
            'domicile': settings.DOMICILE,
            'device_purchases': self.__order_serializer.data,
            'purchase': self.__purchase
        }
