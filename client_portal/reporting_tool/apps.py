"""
Apps config are defined here
"""

from django.apps import AppConfig


class ReportingToolConfig(AppConfig):
    """
    Loads some libraries on application ready
    """
    name = 'reporting_tool'
    verbose_name = "Reporting Tool"

    def ready(self):
        """
        Imports signals on ready
        """
        import shared.signals
