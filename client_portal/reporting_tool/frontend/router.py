"""
Contains utilities for frontend service endpoints configuration
"""

from typing import Optional
from urllib.parse import urlparse

from django.urls import reverse
from django.urls.resolvers import RoutePattern, URLPattern


def url(pattern: str, name: str) -> URLPattern:
    """
    :type pattern: str
    :type name: str

    :rtype: URLPattern
    """
    pattern = RoutePattern(pattern, name=name, is_endpoint=True)

    return URLPattern(pattern, lambda: None, name=name)


class Router:
    """
    Frontend router.
    Shceme and hostname are reruired.
    """
    def __init__(self, hoststring: str):
        """
        :type hoststring: str
        """
        self.__host = urlparse(hoststring)

        if not self.__host.scheme:
            raise ValueError('Scheme for frontend router is not provided')

        if not self.__host.netloc:
            raise ValueError(
                'Netloc {host}{:port?} for frontend router is not provided'
            )

    @staticmethod
    def reverse(viewname: str, args: Optional[tuple] = None,
                kwargs: Optional[dict] = None) -> str:
        """
        :type viewname:
        :type args:
        :type kwargs:

        :rtype: str
        """
        return reverse(viewname, 'reporting_tool.frontend.urls', args=args,
                       kwargs=kwargs, current_app=None)

    def reverse_full(self, viewname: str, args: Optional[tuple] = None,
                     kwargs: Optional[dict] = None) -> str:
        """
        :type viewname: str
        :type args: Optional[tuple]
        :type kwargs: Optional[dict]

        :rtype: str
        """
        uri = self.reverse(viewname, args, kwargs)

        return '{}://{}{}'.format(self.__host.scheme, self.__host.netloc, uri)
