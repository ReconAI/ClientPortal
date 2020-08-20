"""
Reporting tool pdf compilers
"""

from datetime import timedelta
from typing import Dict, Any

from django.conf import settings

from recon_db_manager.models import Organization, RecurrentCharge
from shared.helpers import MonthlyUsageCalculator, PriceWithTax, Price
from shared.pdf import PDFDocument
from .serializers import UserInvoiceSerializer


class Invoice(PDFDocument):
    """
    Completes invoice pdf with monthly expenditures
    """
    def __init__(self,
                 organization: Organization,
                 root_organization: Organization,
                 usage_calculator: MonthlyUsageCalculator,
                 invoice_serializer: UserInvoiceSerializer,
                 charge: RecurrentCharge
                 ):
        """
        :param organization:
        :param usage_calculator:
        :param invoice_serializer:
        """
        self.__usage_calculator = usage_calculator
        self.__invoice_serializer = invoice_serializer
        self.__root_organization = root_organization
        self.__organization = organization
        self.__charge = charge

    def template_path(self) -> str:
        """
        :rtype: str
        """
        return 'pdf/invoice.html'

    def template_context(self) -> Dict[str, Any]:
        """
        :rtype: Dict[str, Any]
        """
        return {
            'organization': self.__organization,
            'root_organization': self.__root_organization,
            'app_name': settings.APP_NAME,
            'now': self.__charge.created_dt.date(),
            'due_date': (self.__charge.created_dt + timedelta(
                days=settings.TERMS_OF_PAYMENT_DAYS
            )).date(),
            'currency': settings.CURRENCY,
            'bank_reference_code': settings.BANK_REFERENCE_CODE,
            'iban': settings.IBAN,
            'bic': settings.BIC,
            'terms_of_payment_days': settings.TERMS_OF_PAYMENT_DAYS,
            'interest_rate': settings.INTEREST_RATE,
            'bank_connection': settings.BANK_CONNECTION,
            'domicile': settings.DOMICILE,
            'users': self.__invoice_serializer.data,
            'monthly_usage_calculator': self.__usage_calculator,
            'user_license_fee': settings.USER_LICENSE_FEE,
            'device_license_fee': settings.DEVICE_LICENSE_FEE,
            'vat': settings.VAT,
            'charge': self.__charge,
            'total_with_vat': PriceWithTax(
                Price(self.__usage_calculator.total), settings.VAT
            ).as_price()
        }
