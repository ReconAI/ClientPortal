"""
Recurrent charges logic is enclosed in the module
"""

import datetime
from typing import List, Dict

from argparse import ArgumentParser
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management import BaseCommand
from django.db.models import Count
from django.db.models.expressions import F
from django.db.models.functions import TruncSecond
from django.db.models.query import QuerySet
from django.db.transaction import atomic
from django.utils.timezone import now

from recon_db_manager.models import Organization, RecurrentCharge, \
    DeviceInstance
from reporting_tool.pdf import Invoice
from reporting_tool.serializers import UserInvoiceSerializer
from shared.helpers import MonthlyUsageCalculator, StripePrice, Price, \
    PriceWithTax, RecurrentCharger
from shared.models import UserGroup, Role
from shared.utils import SendEmailMixin


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

    @atomic(settings.RECON_AI_CONNECTION_NAME)
    def charge_organization(self, organization: Organization):
        """
        Charge organization if necessary

        :type organization: Organization
        """
        organization_charger = RecurrentCharger(
            organization,
            organization.last_payment_id,
            organization.last_payment_dt,
            organization.is_invoice
        )

        if organization_charger.is_to_be_charged:
            users = get_user_model().objects.filter(
                organization_id=organization.id
            ).all()

            monthly_usage_calculator = MonthlyUsageCalculator(
                users,
                organization_charger.device_license_fee,
                organization_charger.user_license_fee,
                getattr(organization, 'device_cnt', 0)
            )

            amount = StripePrice(PriceWithTax(
                Price(monthly_usage_calculator.total),
                settings.VAT
            )).as_price()

            payment_id = organization_charger.charge(amount)

            charge = self.__create_charge(organization, payment_id,
                                          amount, organization_charger)

            user_invoice_serializer = UserInvoiceSerializer(
                users,
                user_license_fee=organization_charger.user_license_fee,
                many=True
            )

            # Generate invoice
            invoice = Invoice(
                organization,
                self.__root_organization,
                monthly_usage_calculator,
                user_invoice_serializer,
                charge
            ).generate()

            # Send mail afterwards
            self.__send__mail(
                organization,
                invoice
            )

            self.stdout.write('Organization {}({}) is successfully charged'.format(
                organization.name,
                organization.id
            ))

    @staticmethod
    def __create_charge(organization: Organization, payment_id: str,
                        amount: float,
                        organization_charger: RecurrentCharger
                        ) -> RecurrentCharge:
        """
        :type organization: Organization
        :type payment_id: str
        :type amount: float
        :type organization_charger: OrganizationCharger

        :rtype: RecurrentCharge
        """
        return RecurrentCharge.objects.create(
            organization=organization,
            payment_id=payment_id,
            device_license_fee=organization_charger.device_license_fee,
            user_license_fee=organization_charger.user_license_fee,
            vat=settings.VAT,
            device_cnt=getattr(organization, 'device_cnt', 0),
            total=amount,
            is_invoice=organization_charger.is_invoice,
            invoice_data=''
        )

    def __send__mail(self, organization: Organization, invoice: bytearray):
        """
        Sends email to users with invoice

        :type organization: Organization
        :type invoice: bytearray
        """
        self.send_mail(
            Role.admins(
                organization,
                self.__authorized_users_ids
            ).values_list('email', flat=True),
            'emails/recurrent_invoice_subject',
            'emails/recurrent_invoice.html',
            attachments=[[
                'invoice.pdf',
                invoice,
                'application/pdf'
            ]],
            organization_name=organization.name
        )

    def get_queryset(self) -> QuerySet:
        """
        Companies are to be charged

        :rtype: QuerySet
        """
        organizations = Organization.objects.exclude(
            name=Organization.ROOT
        ).annotate(
            last_payment_id=F('recurrentcharge__payment_id'),
            last_payment_dt=TruncSecond('recurrentcharge__created_dt'),
            is_invoice=F('recurrentcharge__is_invoice')
        ).distinct(
            'id'
        ).filter(
            created_dt__lt=(now() - datetime.timedelta(
                settings.TRIAL_PERIOD_DAYS
            ))
        ).order_by(
            '-id', '-recurrentcharge__created_dt'
        ).prefetch_related('edgenode_set').all()

        device_cnt = self.__device_cnt_query(
            list(organizations.values_list('id', flat=True))
        )

        for organization in organizations:
            organization.device_cnt = device_cnt.get(organization.id, 0)

        return organizations

    @staticmethod
    def __device_cnt_query(organization_ids: List) -> Dict[int, int]:
        device_cnt_query = DeviceInstance.objects.filter(
            edge_nodes__ecosystems__organization_id__in=organization_ids
        ).values('edge_nodes__organization_id').annotate(
            cnt=Count('edge_nodes__organization_id')
        ).all()

        return {
            item.get('edge_nodes__organization_id'): item.get('cnt', 0)
            for item
            in device_cnt_query
        }

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
