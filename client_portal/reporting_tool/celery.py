"""
Celery framework instantiation
"""

import os

import django
from celery import Celery

# set the default Django settings module for the 'celery' program.
# from django.conf import settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'reporting_tool.settings')
django.setup()

from reporting_tool.tasks import ExportRelevantDataTask

app = Celery('reporting_tool')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY', force=True)

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()
app.tasks.register(ExportRelevantDataTask())
