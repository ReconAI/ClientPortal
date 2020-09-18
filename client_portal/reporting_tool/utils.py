"""
Reporting tool utils
"""


import csv
import uuid
from abc import abstractmethod
from typing import Any, Iterable, Optional

import boto3
import dicttoxml
from botocore.client import BaseClient
from botocore.config import Config
from django.conf import settings
from django.core.files.base import ContentFile
from django.utils.translation import gettext_lazy as _
from rest_framework.serializers import Serializer

from shared.models import User


class DictWriter(csv.DictWriter):
    def __init__(self, f, fieldnames, restval="", extrasaction="raise",
                 dialect="excel", header: Optional[Iterable[str]] = None,
                 *args, **kwds):
        super().__init__(f, fieldnames, restval, extrasaction, dialect, *args,
                         **kwds)

        self._header = header

    def writeheader(self) -> Any:
        if self._header:
            header = dict(zip(self.fieldnames, self._header))
            return self.writerow(header)

        return super().writeheader()


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
    COLUMNS_MAP = {
        'id': _('ID'),
        'sensor_GPS_lat': _('Sensor GPS Latitude'),
        'sensor_GPS_long': _('Sensor GPS Longitude'),
        'location_x': _('Location X'),
        'location_y': _('Location Y'),
        'location_z': _('Location Z'),
        'orient_theta': _('Orient theta'),
        'orient_phi': _('Orient phi'),
        'timestamp': _('Time stamp'),
        'project_name': _('Project name'),
        'sensor_id': _('Sensor ID'),
        'license_plate_number': _('License plate number'),
        'event_object': _('Object Type'),
        'object_class': _('Object class'),
        'vehicle_classification': _('Vehicle classification'),
        'ambient_weather': _('Ambient weather condition'),
        'road_weather': _('Road weather'),
        'stopped_vehicle_detection': _('Stopped vehicle detection'),
        'tagged_data': _('Tagged data'),
        'license_plate_location': _('License plate location'),
        'face_location': _('Face location'),
        'cad_file_tag': _('CAD file tag'),
        'road_temperature': _('Road temperature'),
        'ambient_temperature': _('Ambient temperature'),
        'pedestrian_flow_transit_method': _('Pedestrian Flow Transit Method'),
        'pedestrian_flow_number_of_objects': _('Pedestrian Flow '
                                               'Number Of Objects'),
        'traffic_flow_number_of_objects': _('Number of objects'),
        'traffic_flow_observation_end_dt': _('Observation end'),
        'traffic_flow_observation_start_dt': _('Observation start'),
        'traffic_flow_number_of_directions': _('Number of directions'),
        'traffic_flow_directions_statistics': _('Directions statistics')
    }

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
        csv_writer = DictWriter(
            f=self.__file,
            fieldnames=self._serializer.child.Meta.fields,
            header=self.header
        )
        csv_writer.writeheader()

        for rd_item in self._serializer.data:
            csv_writer.writerow(rd_item)

    def __str__(self):
        self.through()

        return self.__file.open('r').file.getvalue()

    @property
    def header(self) -> Iterable[str]:
        columns_map = getattr(self, 'COLUMNS_MAP')

        if columns_map:
            return [
                columns_map.get(field, field)
                for field
                in self._serializer.child.Meta.fields
            ]

        return self._serializer.child.Meta.fields


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
    def __init__(self, file: ContentFile, upload_key: str,
                 organization_id: int):
        super().__init__(file)

        self.__upload_key = upload_key
        self.__organization_id = organization_id

    def generate_key(self) -> str:
        return '{}/organization_{}/{}'.format(
            self.__upload_key,
            self.__organization_id,
            self._file.name
        )
