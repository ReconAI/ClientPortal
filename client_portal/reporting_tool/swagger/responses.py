"""
Contains generic answers peculiar to the application acceptable for swagger
"""

from typing import List, Dict, Type, Union

from drf_yasg import openapi
from drf_yasg.openapi import TYPE_OBJECT, TYPE_STRING
from rest_framework import status
from rest_framework.serializers import Serializer


def _generic_success_message(message: str) -> openapi.Schema:
    """
    Swagger success response schema

    :rtype: openapi.Schema
    """
    return openapi.Schema(
        type=TYPE_OBJECT,
        read_only=True,
        properties={
            'message': openapi.Schema(message,
                                      type=openapi.TYPE_STRING
                                      )
        }
    )


def _generic_error(message: str) -> openapi.Schema:
    """
    Swagger error response schema

    :rtype: openapi.Schema
    """
    return openapi.Schema(
        type=TYPE_OBJECT,
        properties={
            'errors': openapi.Schema(message,
                                     type=openapi.TYPE_STRING
                                     )
        })


def http200() -> openapi.Schema:
    """
    Swagger 200 response schema

    :rtype: openapi.Schema
    """
    return _generic_success_message('Success message')


def http201() -> openapi.Schema:
    """
    Swagger 201 response schema

    :rtype: openapi.Schema
    """
    return _generic_success_message('Successfully created')


def http400() -> openapi.Schema:
    """
    Swagger 400 response schema

    :rtype: openapi.Schema
    """
    return _generic_error('Bad request error message')


def http401() -> openapi.Schema:
    """
    Swagger 401 response schema

    :rtype: openapi.Schema
    """
    return _generic_error('Unauthorized')


def http403() -> openapi.Schema:
    """
    Swagger 403 response schema

    :rtype: openapi.Schema
    """
    return _generic_error('Forbidden')


def http404() -> openapi.Schema:
    """
    Swagger 404 response schema

    :rtype: openapi.Schema
    """
    return _generic_error('Not found error message')


def http405() -> openapi.Schema:
    """
    Swagger 405 response schema

    :rtype: openapi.Schema
    """
    return _generic_error('Method is not allowed')


def http422() -> openapi.Schema:
    """
    Swagger 422 response schema

    :rtype: openapi.Schema
    """
    return openapi.Schema(
        type=TYPE_OBJECT,
        properties={
            'errors': openapi.Schema(
                type=TYPE_OBJECT,
                properties={
                    'attribute_name': openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            'Attribute validation error',
                            type=TYPE_STRING
                        )
                    )
                }
            ),
        }
    )


def data(schema: openapi.Schema) -> openapi.Schema:
    """
    Successful response with data

    :rtype: openapi.Schema
    """
    return openapi.Schema(
        type=TYPE_OBJECT,
        properties={
            'data': schema
        }
    )


def token() -> openapi.Schema:
    """
    Successful response with token

    :rtype: openapi.Schema
    """
    return data(openapi.Schema(
        type=TYPE_OBJECT,
        properties={
            'token': openapi.Schema(
                type=openapi.TYPE_STRING
            )
        }
    ))


def data_serializer(
        serializer: Type['Serializer']) -> Union[type, Type[Serializer]]:
    """
    Converts serializer to common response format

    :type serializer: Type['Serializer']

    :rtype: Type[Serializer]
    """
    return type(
        'Serializer',
        (Serializer, ),
        {
            'data': serializer()
        }
    )


_relations = {
    status.HTTP_200_OK: http200(),
    status.HTTP_201_CREATED: http201(),
    status.HTTP_400_BAD_REQUEST: http400(),
    status.HTTP_401_UNAUTHORIZED: http401(),
    status.HTTP_403_FORBIDDEN: http403(),
    status.HTTP_404_NOT_FOUND: http404(),
    status.HTTP_405_METHOD_NOT_ALLOWED: http405(),
    status.HTTP_422_UNPROCESSABLE_ENTITY: http422()
}


def get_responses(*http_statuses: List[int]) -> Dict[int, openapi.Schema]:
    """
    Returns set of requested responses

    :rtype: Dict[int, openapi.Schema]
    """
    return {
        http_status: _relations.get(http_status)
        for http_status
        in http_statuses
        if http_status in _relations
    }