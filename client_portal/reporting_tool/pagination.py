from collections import OrderedDict

from django.http import JsonResponse
from rest_framework.pagination import \
    PageNumberPagination as PageNumberPaginationBase


class PageNumberPagination(PageNumberPaginationBase):
    def get_paginated_response(self, data):
        return JsonResponse({
            'data': OrderedDict([
                ('count', self.page.paginator.count),
                ('current', self.page.number),
                ('page_size', self.page_size),
                ('next_page_number', self.next_page_number()),
                ('previous_page_number', self.previous_page_number()),
                ('next_page_link', self.get_next_link()),
                ('previous_page_link', self.get_previous_link()),
                ('results', data)
            ])
        })

    def next_page_number(self):
        if not self.page.has_next():
            return None

        return self.page.next_page_number()

    def previous_page_number(self):
        if not self.page.has_previous():
            return None

        return self.page.previous_page_number()
