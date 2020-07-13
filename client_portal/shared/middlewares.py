"""
Reporting tool custom middlewares
"""

import re
from datetime import date, datetime
from pathlib import Path

from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.utils.deprecation import MiddlewareMixin
from requests import Response
from rest_framework.request import Request


class HTTPLogMiddleware(MiddlewareMixin):
    """
    Middleware logs incoming http requests
    """
    __except = r'.*\.ico'

    def process_response(self, request: Request,
                         response: Response) -> Response:
        """
        :type request: Request
        :type response: Response

        :rtype: Response
        """
        if self.__not_skip(request):
            Path(settings.STORAGE_ROOT).mkdir(parents=True, exist_ok=True)

            file = FileSystemStorage(
                location=settings.STORAGE_ROOT
            ).open(
                self.__file_name(),
                'a+'
            )

            try:
                file.write(self.__get_line(request, response))
            except Exception as exc:
                file.close()
                raise exc

        return response

    @staticmethod
    def __get_line(request: Request, response: Response) -> str:
        """
        :type request: Request
        :type response: Response

        :rtype: str
        """
        return '{},{},{},{},{}\n'.format(
            datetime.now().isoformat(),
            request.method,
            request.path_info,
            request.content_type,
            response.status_code
        )

    @staticmethod
    def __file_name() -> str:
        """
        :rtype: str
        """
        return 'http_log_{}.csv'.format(
            date.today().isoformat()
        )

    def __not_skip(self, request: Request) -> bool:
        """
        Checks whether http log should be performed

        :type request: Request

        :rtype: bool
        """
        try:
            return not re.compile(self.__except).search(
                request.path_info
            ) and settings.LOG_HTTP
        except TypeError:
            return settings.LOG_HTTP
