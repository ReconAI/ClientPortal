from celery import Task
from django_filters import rest_framework as filters

from reporting_tool.filters import RelevantDataSensorFilter
from reporting_tool.serializers import RelevantDataSerializer
from reporting_tool.views.relevant_data import RelevantDataHandler


class ExportRelevantDataTask(Task, RelevantDataHandler):
    name = 'export-relevant-data'

    serializer_class = RelevantDataSerializer

    filter_backends = (filters.DjangoFilterBackend,)

    filterset_class = RelevantDataSensorFilter

    def run(self, *args, **kwargs):
        print(self.request)
        print(len(self.query))
        print('------- !!!! ----------')

    @property
    def query(self):
        return self.filter_queryset(self.queryset)

    def filter_queryset(self, queryset):
        """
        Given a queryset, filter it with whichever filter backend is in use.

        You are unlikely to want to override this method, although you may need
        to call it either from a list view, or from a custom `get_object`
        method if you want to apply the configured filtering backend to the
        default queryset.
        """
        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(self.request, queryset, self)
        return super().filter_queryset(queryset)
