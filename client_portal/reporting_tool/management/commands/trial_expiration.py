"""
Sends mails to thosw whose trial is expiring before long
"""


from datetime import timedelta

from argparse import ArgumentParser
from django.conf import settings
from django.contrib.auth import get_user_model

from django.core.management import BaseCommand
from django.db.models.query import QuerySet
from django.utils.timezone import now
from requests import Request

from reporting_tool.forms.utils import SendEmailMixin
from shared.models import User


class Command(BaseCommand, SendEmailMixin):
    """
    Exports daily tracked http logs to S3 bucket
    """

    help = 'Notifies users about trial expiration'

    query_set = get_user_model().objects.all()

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

        for user in objects:
            self.send_mail(
                user.email,
                'emails/trial_expiration_subject.txt',
                'emails/trial_expiration.html',
                request=None,
                user=user
            )

            message = "{} is notified about ending trial".format(
                user.get_username()
            )

            self.stdout.write(message)


    @staticmethod
    def filter_query_set(query_set: QuerySet) -> QuerySet:
        """
        Applies appropriate filter to the query

        :rtype: QuerySet
        """
        now_ts = now()

        return query_set.filter(
            created_dt__lt=now_ts,
            created_dt__gt=(now_ts - timedelta(days=1))
        )

    def get_objects(self) -> QuerySet:
        """
        :rtype: QuerySet
        """
        return self.filter_query_set(self.query_set)

    def get_email_context(self, user: User, *args, **kwargs) -> dict:
        """
        :type user: User

        :rtype: dict
        """
        return {
            'app_name': settings.APP_NAME,
            'user': user
        }
