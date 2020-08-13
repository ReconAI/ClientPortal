"""
Recurrent charges logic is enclosed in the module
"""

import datetime

from argparse import ArgumentParser
from django.conf import settings
from django.core.management import BaseCommand
from django.db.models.functions import Trim, TruncSecond
from django.db.models.query import QuerySet
from django.utils.timezone import now
from recon_db_manager.models import Organization, RecurrentCharge
from reporting_tool.forms.utils import SendEmailMixin
from reporting_tool.pdf import Invoice
from reporting_tool.serializers import UserInvoiceSerializer
from shared.helpers import MonthlyUsageCalculator, StripePrice, Price, \
    PriceWithTax, OrganizationCharger
from shared.models import UserGroup, Role


class Command(SendEmailMixin, BaseCommand):
    """
    Exports daily tracked http logs to S3 bucket
    """

    help = 'Charges user for the period passed'

    def __init__(self, stdout=None, stderr=None, no_color=False,
                 force_color=False):
        super().__init__(stdout=stdout, stderr=stderr,
                         no_color=no_color, force_color=force_color)

        self.__root_organization = Organization.root()
        self.__authorized_users_ids = list(UserGroup.objects.filter(
            group__name=Role.ADMIN
        ).values_list('user_id', flat=True))

    def add_arguments(self, parser: ArgumentParser):
        """
        No arguments are meant to be added

        :type parser: ArgumentParser
        """

    def handle(self, *args, **kwargs):
        """
        Peforms export and log deletion themselves

        :type args: tuple
        :type kwargs: dict
        """
        organizations = self.get_queryset()

        for organization in organizations:
            self.charge_organization(organization)

    def charge_organization(self, organization: Organization):
        """
        Charge organization if necessary

        :type organization: Organization
        """
        organization_charger = OrganizationCharger(
            organization,
            organization.last_payment_id,
            organization.last_payment_dt
        )

        if organization_charger.is_to_be_charged:
            users = organization.user_set.all()

            # todo implement aws costs retrieval
            monthly_usage_calculator = MonthlyUsageCalculator(
                users,
                len(organization.edgenode_set.all())
            )

            amount = StripePrice(PriceWithTax(
                Price(monthly_usage_calculator.total),
                settings.VAT
            )).as_price()

            payment_id = organization_charger.charge(amount)

            charge = self.__create_charge(organization, payment_id, amount)

            # Generate invoice
            invoice = Invoice(
                organization,
                self.__root_organization,
                monthly_usage_calculator,
                UserInvoiceSerializer(users, many=True),
                charge
            ).generate()

            # Send mail afterwards
            self.__send__mail(
                organization,
                invoice
            )

    @staticmethod
    def __create_charge(organization: Organization, payment_id: str,
                        amount: int) -> RecurrentCharge:
        """
        :type organization: Organization
        :type payment_id: str
        :type amount: int

        :rtype: RecurrentCharge
        """
        return RecurrentCharge.objects.create(
            organization=organization,
            payment_id=payment_id,
            device_license_fee=settings.DEVICE_LICENSE_FEE,
            user_license_fee=settings.USER_LICENSE_FEE,
            vat=settings.VAT,
            device_cnt=len(organization.edgenode_set.all()),  # todo adjust
            total=amount,
            invoice_data=''
        )

    def __send__mail(self, organization: Organization, invoice: bytearray):
        """
        Sends email to users with invoice

        :type organization: Organization
        :type invoice: bytearray
        """
        self.send_mail(
            organization.user_set.filter(
                pk__in=self.__authorized_users_ids
            ).all().values_list('email', flat=True),
            'emails/recurrent_invoice_subject',
            'emails/recurrent_invoice.html',
            attachments=[[
                'invoice.pdf',
                invoice,
                'application/pdf'
            ]],
            organization=organization
        )

    @staticmethod
    def get_queryset() -> QuerySet:
        """
        Companies are to be charged

        :rtype: QuerySet
        """
        return Organization.objects.exclude(
            name=Organization.ROOT
        ).annotate(
            last_payment_id=Trim('recurrentcharge__payment_id'),
            last_payment_dt=TruncSecond('recurrentcharge__created_dt')
        ).distinct(
            'id'
        ).filter(
            created_dt__lt=(now() - datetime.timedelta(
                settings.TRIAL_PERIOD_DAYS + settings.CHARGE_EACH_N_DAYS))
        ).order_by(
            '-id', '-created_dt'
        ).prefetch_related(
            'user_set', 'edgenode_set'
        ).all()

    def get_email_context(self, *args, **kwargs) -> dict:
        """
        :type args: tuple
        :type kwargs: dict

        :rtype: dict
        """
        return {
            'app_name': settings.APP_NAME,
            **kwargs
        }
