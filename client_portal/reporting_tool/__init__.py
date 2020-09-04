"""
Reporting tool application
"""

import sys
from .celery import app as celery_app

sys.path.append('..')
sys.path.append('../recon_db_manager')
sys.path.append('../shared')

default_app_config = 'reporting_tool.apps.ReportingToolConfig'

__all__ = ('celery_app',)
