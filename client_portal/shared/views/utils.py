"""
Contains views helpers
"""
from typing import Optional

from django.forms import BaseForm
from django.http import JsonResponse
from django.utils.translation import gettext_lazy as _
from django.views.generic.edit import FormMixin as FormMixinBase
from rest_framework import status, mixins
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import Serializer

from shared.serializers import UserSerializer


class CheckTokenMixin:
    """
    Processes any check user token
    """

    check_token_form_class = None

    def check_token(self) -> JsonResponse:
        """
        Checks user token and returns appropriate response

        :rtype: JsonResponse
        """
        form = self.get_form(form_class=self.check_token_form_class)

        if form.is_valid():
            return JsonResponse({
                'message': _('Token is valid'),
                'data': UserSerializer(form.user).data
            }, status=status.HTTP_200_OK)

        return JsonResponse({
            'errors': form.errors
        }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class FormMixin(FormMixinBase):
    """
    Base form mixin for form views
    """

    def get_form_kwargs(self) -> dict:
        """
        :type: dict
        """
        return {
            'data': self.request.data
        }

    def save_or_error(self, success_message: str,
                      success_status: int = status.HTTP_200_OK,
                      form: BaseForm = None, **kwargs) -> JsonResponse:
        """
        Takes form and saves it if valid.
        Otherwise returns 422 response.

        :type success_message: str
        :type success_status: int
        :type form: Optional[BaseForm]

        :rtype: JsonResponse
        """
        if form is None:
            form = self.get_form()

        if form.is_valid():
            form.save(**kwargs)

            return JsonResponse({
                'message': success_message
            }, status=success_status)

        return JsonResponse({
            'errors': form.errors
        }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class SerializerMixin:
    """
    Generic save_or_error method
    """

    def save_or_error(self, success_message: str,
                      serializer: Optional[Serializer] = None) -> Response:
        """
        :type success_message: str
        :type serializer: Optional[Serializer]

        :rtype: Response
        """
        if serializer is None:
            try:
                instance = self.get_object()
            except AssertionError:
                instance = None

            serializer = self.get_serializer(
                instance,
                data=self.request.data
            )

        if serializer.is_valid():
            return Response({
                'message': success_message
            }, status=status.HTTP_200_OK)

        return Response({
            'errors': serializer.errors
        }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class UpdateModelMixin(SerializerMixin):
    """
    Generic update model mixin
    """

    update_success_message = ''

    def put(self, *args, **kwargs) -> Response:
        """
        Generic update view

        :rtype: Response
        """
        return self.save_or_error(self.update_success_message)


class DestroyModelMixin:
    """
    Generic delete model mixin
    """

    def delete(self, *args, **kwargs) -> Response:
        """
        Generic delete view

        :rtype: Response
        """
        self.get_object().delete()

        return Response({
            'message': 'Deleted successfully'
        }, status=status.HTTP_200_OK)


class RetrieveModelMixin:
    """
    Generic retrieve model mixin
    """

    def get(self, *args, **kwargs) -> Response:
        """
        :rtype: Response
        """
        instance = self.get_object()

        serializer = self.get_serializer(instance)

        return Response({
            'data': serializer.data
        })


class CreateModelMixin(SerializerMixin):
    """
    Generic create model mixin
    """

    create_success_message = ''

    def post(self, request: Request, *args, **kwargs) -> Response:
        """
        Generic create view

        :type request: Request

        :rtype: Response
        """
        return self.save_or_error(self.create_success_message)


class RetrieveAPIView(RetrieveModelMixin, GenericAPIView):
    """
    Generic retrieve API view
    """


class RetrieveUpdateDestroyAPIView(RetrieveModelMixin, UpdateModelMixin,
                                   DestroyModelMixin, GenericAPIView):
    """
    Generic retrieve, update and destroy API view
    """


class UpdateDestroyAPIView(UpdateModelMixin, DestroyModelMixin,
                           GenericAPIView):
    """
    Generic update and destroy API view
    """


class CreateAPIView(CreateModelMixin, GenericAPIView):
    """
    Generic create API view
    """


class ListCreateAPIView(mixins.ListModelMixin,
                        CreateModelMixin,
                        GenericAPIView):
    """
    List and create views set
    """

    def get(self, request, *args, **kwargs) -> Response:
        """
        Generic list view

        :type request: Request

        :rtype: Response
        """
        return self.list(request, *args, **kwargs)
