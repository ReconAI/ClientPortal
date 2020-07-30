"""
Sends mails to thosw whose trial is expiring before long
"""


from datetime import timedelta

from argparse import ArgumentParser
from django.conf import settings
from django.core.management import BaseCommand
from django.db.models.query import QuerySet
from django.utils.timezone import now

from recon_db_manager.models import Organization
from reporting_tool.forms.utils import SendEmailMixin
from shared.models import User, Role, UserGroup


class Command(BaseCommand, SendEmailMixin):
    """
    Exports daily tracked http logs to S3 bucket
    """

    help = 'Notifies users about trial expiration'

    query_set = Organization.objects.all()

    def add_arguments(self, parser: ArgumentParser):
        """
        No arguments are meant to be added

        :type parser: ArgumentParser
        """

    def handle(self, *args, **kwargs):
        """
        Takes users whose trial comes to an end and informs them by email

        :type args: tuple
        :type kwargs: dict
        """
        objects = self.get_objects()

        if not objects:
            self.stdout.write("No one's trial is expiring shortly")

        authorized_users_ids = list(UserGroup.objects.filter(
            group__name__in=[Role.SUPER_ADMIN, Role.ADMIN, Role.DEVELOPER]
        ).values_list('user_id', flat=True))

        for organization in objects:
            organization_users = User.objects.filter(
                id__in=authorized_users_ids,
                organization_id=organization.id
            ).values('email', 'firstname', 'lastname')

            if organization_users:
                for user in organization_users:
                    self.send_mail(
                        user.get('email'),
                        'emails/trial_expiration_subject.txt',
                        'emails/trial_expiration.html',
                        **user
                    )

            message = "{} is notified about ending trial".format(
                organization.name
            )

            self.stdout.write(message)

    @staticmethod
    def filter_query_set(query_set: QuerySet) -> QuerySet:
        """
        Applies appropriate filter to the query

        :rtype: QuerySet
        """
        now_ts = now() - timedelta(days=settings.TRIAL_PERIOD_DAYS)

        return query_set.filter(
            created_dt__lt=now_ts,
            created_dt__gt=(now_ts - timedelta(days=1))
        )

    def get_objects(self) -> QuerySet:
        """
        :rtype: QuerySet
        """
        return self.filter_query_set(self.query_set)

    def get_email_context(self, *args, **kwargs) -> dict:
        """
        :rtype: dict
        """
        return {
            'app_name': settings.APP_NAME,
            **kwargs
        }
