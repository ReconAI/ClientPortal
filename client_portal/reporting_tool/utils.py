"""
Reporting tool utils
"""


import csv
import uuid
from abc import abstractmethod

import boto3
import dicttoxml
from botocore.client import BaseClient
from botocore.config import Config
from django.conf import settings
from django.core.files.base import ContentFile
from rest_framework.serializers import Serializer

from shared.models import User


class RelevantDataFileGenerator:
    """
    Generates diverse file from serializer data
    """
    FORMAT_XML = 'xml'
    FORMAT_CSV = 'csv'

    def __init__(self, serializer: Serializer, export_format: str):
        """
        :type serializer: Serializer
        :type export_format: str
        """
        self.export_format = export_format
        self._serializer = serializer

    @abstractmethod
    def __str__(self) -> str:
        """
        Returns generated data as string

        :rtype: str
        """

    @staticmethod
    def instantiate(extension: str,
                    serializer: Serializer) -> 'RelevantDataFileGenerator':
        """
        :type extension: str
        :type serializer: Serializer

        :rtype: RelevantDataFileGenerator
        """
        if extension == RelevantDataFileGenerator.FORMAT_XML:
            cls = XMLRelevantDataFileGenerator
        elif extension == RelevantDataFileGenerator.FORMAT_CSV:
            cls = CSVRelevantDataFileGenerator

        return cls(serializer, extension)


class CSVRelevantDataFileGenerator(RelevantDataFileGenerator):
    """
    Generates csv from serializer data
    """
    def __init__(self, serializer: 'RelevantDataGeneratorSeriralizer',
                 export_format: str):
        """
        :type serializer: RelevantDataGeneratorSeriralizer
        :type export_format: str
        """
        super().__init__(serializer, export_format)

        self.__file = ContentFile('')

    def through(self):
        """
        Puts rows to csv file row by row
        """
        csv_writer = csv.DictWriter(
            self.__file,
            self._serializer.child.Meta.fields
        )
        csv_writer.writeheader()

        for rd_item in self._serializer.data:
            print(rd_item.get('id'))
            csv_writer.writerow(rd_item)

    def __str__(self):
        self.through()

        return self.__file.open('r').file.getvalue()


class XMLRelevantDataFileGenerator(RelevantDataFileGenerator):
    """
    Generates xml from serializer data
    """
    def __str__(self) -> str:
        return dicttoxml.dicttoxml(self._serializer.data).decode("utf-8")


class S3FileUploader:
    """
    Uploads file to s3
    """

    def __init__(self, file, **kwargs):
        """
        :param file:
        :type user: User
        """
        self._file = file
        self.__key = None
        self.__s3 = None

    @property
    def key(self) -> str:
        """
        Generates remote storage file key

        :rtype: str
        """
        if self.__key is None:
            self.__key = self.generate_key()

        return self.__key

    @abstractmethod
    def generate_key(self) -> str:
        """
        Generates obj key

        :rtype: str
        """

    def upload_and_get_link(self) -> str:
        """
        Uploads file and returns the link to it

        :rtype: int
        """
        self.upload()

        return self.url

    def upload(self) -> dict:
        """
        Uploads file

        :rtype: dict
        """
        return self.s3_client.put_object(
            Body=str(self._file),
            Bucket=settings.AWS_CLIENT_PORTAL_BUCKET,
            Key=self.key
        )

    @property
    def url(self) -> str:
        """
        Uploaded file url

        :rtype: str
        """
        return self.s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': settings.AWS_CLIENT_PORTAL_BUCKET,
                'Key': self.key
            }
        )

    @property
    def s3_client(self) -> BaseClient:
        """
        Connection to S3 bucket

        :rtype: BaseClient
        """
        if self.__s3 is None:
            self.__s3 = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                config=Config(signature_version='s3v4')
            )

        return self.__s3


class RelvantDataExportUploader(S3FileUploader):
    """
    Relevant data file uplodaer
    """
    def __init__(self, file: RelevantDataFileGenerator, user: User):
        super().__init__(file)

        self.__user = user

    def generate_key(self) -> str:
        return 'relevant_data/organization_{}/{}.{}'.format(
            self.__user.organization.id,
            uuid.uuid4().hex,
            self._file.export_format
        )


class FeatureRequestUploader(S3FileUploader):
    """
    Feature request file uplodaer
    """
    def __init__(self, file: ContentFile, upload_key: str, organization_id: int):
        super().__init__(file)

        self.__upload_key = upload_key
        self.__organization_id = organization_id

    def generate_key(self) -> str:
        return '{}/organization_{}/{}'.format(
            self.__upload_key,
            self.__organization_id,
            self._file.name
        )



