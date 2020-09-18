"""
Module containing tasks for reporting tool worker
"""

import gc

from celery import Task
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import QuerySet
from rest_framework.generics import GenericAPIView

from reporting_tool.filters import RelevantDataSensorFilter, \
    ExportRelevantDataFilterBackend
from reporting_tool.forms.utils import SendEmailMixin
from reporting_tool.serializers import RelevantDataGeneratorSeriralizer
from reporting_tool.utils import RelevantDataFileGenerator, \
    RelvantDataExportUploader
from reporting_tool.views.relevant_data import RelevantDataHandler


class ExportRelevantDataTask(Task, GenericAPIView,
                             RelevantDataHandler, SendEmailMixin):
    """
    Exports relevant data to file uploading it to s3
    """

    name = 'export-relevant-data'

    FORMAT_XML = 'xml'
    FORMAT_CSV = 'csv'

    filter_backend = ExportRelevantDataFilterBackend

    filterset_class = RelevantDataSensorFilter

    serializer_class = RelevantDataGeneratorSeriralizer

    uploader_class = RelvantDataExportUploader

    CHUNK_SIZE = 500

    queryset = RelevantDataHandler.queryset

    def __init__(self):
        super().__init__()

        self.query_params = dict()
        self.user = None
        self.export_format = None

    def run(self, user_id: int, export_format: str, query_params: dict):
        """
        :type user_id: int
        :type export_format: str
        :type query_params: dict
        """
        self.user = get_user_model().objects.get(pk=user_id)
        self.query_params = query_params

        serializer = self.serializer_class(
            self.queryset_iterator(self.CHUNK_SIZE), many=True
        )

        file_generator = RelevantDataFileGenerator.instantiate(
            export_format,
            serializer
        )

        file_uploader = self.uploader_class(file_generator, self.user)

        self.send_mail(
            [self.user.email],
            'emails/relevant_data_export_subject.txt',
            'emails/relevant_data_export.html',
            link=file_uploader.upload_and_get_link(),
            firstname=self.user.firstname,
            app_name=settings.APP_NAME
        )

    def get_email_context(self, *args, **kwargs) -> dict:
        return kwargs

    @property
    def query(self) -> QuerySet:
        """
        :rtype: QuerySet
        """
        return self.filter_queryset(self.queryset)

    def filter_queryset(self, queryset):
        """
        Given a queryset, filter it with whichever filter backend is in use.

        You are unlikely to want to override this method, although you may need
        to call it either from a list view, or from a custom `get_object`
        method if you want to apply the configured filtering backend to the
        default queryset.
        """
        queryset = self.filter_backend().filter_queryset(self.request,
                                                         queryset, self)

        queryset = queryset.filter(
            project__organization_id=self.user.organization.id
        )

        return super().filter_queryset(queryset)

    def queryset_iterator(self, chunksize: int = 500):
        """
        Lazy load iterator loading data by chunks

        :type chunksize: int
        """
        counter = 0
        count = chunksize
        while count == chunksize:
            offset = counter - counter % chunksize
            count = 0
            for item in self.query.all()[offset:offset + chunksize]:
                count += 1
                yield item
            counter += count
            gc.collect()
