"""
Move daily http log to S3 bucket
"""

from argparse import ArgumentParser
from datetime import date, timedelta
from logging import error

import boto3
from botocore.exceptions import ClientError
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.core.management import BaseCommand


class Command(BaseCommand):
    """
    Exports daily tracked http logs to S3 bucket
    """

    help = 'Exports daily tracked http logs to S3 bucket'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.__s3 = boto3. \
            client('s3',
                   aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                   aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)

        self.__export_bucket = settings.AWS_EXPORT_HTTP_LOG_BUCKET
        if not self.__export_bucket:
            raise ValueError('AWS export bucket is not specified')

        self.__export_key = settings.AWS_EXPORT_HTTP_LOG_KEY
        if not self.__export_bucket:
            raise ValueError('AWS export key is not specified')

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
        fname = self.__file_name()

        try:
            filesystem = FileSystemStorage(location=settings.STORAGE_ROOT)
            file = filesystem.open(fname)

            self.__s3.upload_fileobj(
                file.file,
                self.__export_bucket,
                self.__destination(fname)
            )
        except (ClientError, FileNotFoundError) as exc:
            error(exc)
        else:
            file.close()
            filesystem.delete(fname)

    def __destination(self, filename: str) -> str:
        """
        :type filename: str

        :rtype: str
        """
        return '{}/{}'.format(
            self.__export_key,
            filename
        )

    @staticmethod
    def __file_name() -> str:
        """
        :rtype: str
        """
        return 'http_log_{}.csv'.format(
            (date.today() - timedelta(days=1)).isoformat()
        )
