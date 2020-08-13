"""
Shared pdf report helpers
"""

from abc import abstractmethod, ABC
from typing import Dict, Any

from django.template.loader import render_to_string
from weasyprint import HTML


class PDFDocument(ABC):
    """
    Abstract pds helper
    """

    @abstractmethod
    def template_path(self) -> str:
        """
        :rtype: str
        """

    @abstractmethod
    def template_context(self) -> Dict[str, Any]:
        """
        :rtype: Dict[str, Any]
        """

    def generate(self) -> bytes:
        """
        Renders pdf report according to context

        :rtype: bytes
        """
        html_string = render_to_string(
            self.template_path(),
            self.template_context()
        )

        return HTML(string=html_string).write_pdf()
