from collections import OrderedDict

from drf_yasg import openapi
from drf_yasg.inspectors.query import \
    DjangoRestResponsePagination as DjangoRestResponsePaginationBase
from rest_framework.pagination import LimitOffsetPagination, \
    PageNumberPagination, CursorPagination


class DjangoRestResponsePagination(DjangoRestResponsePaginationBase):
    def get_paginated_response(self, paginator, response_schema):
        assert response_schema.type == openapi.TYPE_ARRAY, "array return " \
                                                           "expected for " \
                                                           "paged response"
        paged_schema = None
        if isinstance(paginator, (
                LimitOffsetPagination, PageNumberPagination,
                CursorPagination)):
            has_count = not isinstance(paginator, CursorPagination)
            paged_schema = openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties=OrderedDict((
                    (
                        'count',
                        openapi.Schema(type=openapi.TYPE_INTEGER)
                        if has_count
                        else None
                    ),
                    ('current', openapi.Schema(type=openapi.TYPE_INTEGER)),
                    ('page_size', openapi.Schema(type=openapi.TYPE_INTEGER)),
                    (
                        'next_page_number',
                        openapi.Schema(
                            type=openapi.TYPE_INTEGER,
                            x_nullable=True
                        )
                    ),
                    (
                        'previous_page_number',
                        openapi.Schema(
                            type=openapi.TYPE_INTEGER,
                            x_nullable=True
                        )
                    ),
                    (
                        'next',
                        openapi.Schema(
                            type=openapi.TYPE_STRING,
                            format=openapi.FORMAT_URI,
                            x_nullable=True
                        )
                    ),
                    (
                        'previous',
                        openapi.Schema(
                            type=openapi.TYPE_STRING,
                            format=openapi.FORMAT_URI,
                            x_nullable=True
                        )
                    ),
                    ('results', response_schema),
                )),
                required=['results', 'current', 'page_size']
            )

            if has_count:
                paged_schema.required.insert(0, 'count')

        return openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'data': paged_schema
            },
            required=['data']
        )
