"""
Headers parameters for swagger documentation
"""

from drf_yasg.openapi import Parameter, IN_HEADER, TYPE_STRING


def token_header() -> Parameter:
    """
    :rtype: Parameter
    """
    return Parameter(
        'Authorization', IN_HEADER,
        'Token', required=True, type=TYPE_STRING
    )
