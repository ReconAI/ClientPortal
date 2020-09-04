import csv
import uuid
from abc import abstractmethod

import boto3
import dicttoxml
from botocore.config import Config
from django.conf import settings
from django.core.files.base import ContentFile
from django.utils.timezone import now
from rest_framework.serializers import Serializer

from reporting_tool.serializers import RelevantDataGeneratorSeriralizer
from shared.models import User


class RelevantDataFileGenerator:
    FORMAT_XML = 'xml'
    FORMAT_CSV = 'csv'

    def __init__(self, serializer: Serializer, export_format: str):
        self.export_format = export_format
        self._serializer = serializer

    @abstractmethod
    def __str__(self) -> str:
        pass

    @staticmethod
    def instantiate(extension: str, serializer) -> 'RelevantDataFileGenerator':
        if extension == RelevantDataFileGenerator.FORMAT_XML:
            cls = XMLRelevantDataFileGenerator
        elif extension == RelevantDataFileGenerator.FORMAT_CSV:
            cls = CSVRelevantDataFileGenerator

        return cls(serializer, extension)


class CSVRelevantDataFileGenerator(RelevantDataFileGenerator):
    def __init__(self, serializer: RelevantDataGeneratorSeriralizer,
                 export_format: str):
        super().__init__(serializer, export_format)

        self.__file = ContentFile('')

    def through(self):
        csv_writer = csv.DictWriter(self.__file, self._serializer.child.Meta.fields)
        csv_writer.writeheader()

        for rd_item in self._serializer.data:
            print(rd_item.get('id'))
            csv_writer.writerow(rd_item)

    def __str__(self):
        self.through()

        return self.__file.open('r').file.getvalue()


class XMLRelevantDataFileGenerator(RelevantDataFileGenerator):
    def __str__(self):
        return dicttoxml.dicttoxml(self._serializer.data).decode("utf-8")


class S3FileUploader:
    def __init__(self, file_generator: RelevantDataFileGenerator, user: User):
        self.__user = user
        self.__file_generator = file_generator
        self.__key = None
        self.__s3 = None

    @property
    def key(self) -> str:
        if self.__key is None:
            self.__key = 'relevant_data/organization_1/{}.{}'.format(
                uuid.uuid4().hex,
                self.__file_generator.export_format
            )

        return self.__key

    def upload_and_get_link(self) -> str:
        self.upload()

        return self.url

    def upload(self):
        return self.s3.put_object(
            Body=str(self.__file_generator),
            Bucket=settings.AWS_CLIENT_PORTAL_BUCKET,
            Key=self.key
        )

    @property
    def url(self) -> str:
        return self.s3.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': settings.AWS_CLIENT_PORTAL_BUCKET,
                'Key': self.key
            }
        )

    @property
    def s3(self):
        if self.__s3 is None:
            self.__s3 = boto3.client(
                's3',
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                config=Config(signature_version='s3v4')
            )

        return self.__s3