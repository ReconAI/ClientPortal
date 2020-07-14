"""
Contains views helpers
"""
from django.forms import BaseForm
from django.http import JsonResponse
from django.utils.translation import gettext_lazy as _
from django.views.generic.edit import FormMixin as FormMixinBase
from rest_framework import status, mixins
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

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
    def save_or_error(self, success_message: str, serializer=None):
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
            serializer.save()

            return Response({
                'message': success_message
            }, status=status.HTTP_200_OK)

        return Response({
            'errors': serializer.errors
        }, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class RetrieveUpdateDestroyAPIView(SerializerMixin,
                                   mixins.RetrieveModelMixin,
                                   mixins.UpdateModelMixin,
                                   mixins.DestroyModelMixin,
                                   GenericAPIView):
    update_success_message = ''

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, *args, **kwargs):
        return self.save_or_error(self.update_success_message)

    def delete(self, request, *args, **kwargs):
        self.get_object().delete()

        return Response(status=status.HTTP_200_OK)


class ListCreateAPIView(SerializerMixin,
                        mixins.ListModelMixin,
                        mixins.CreateModelMixin,
                        GenericAPIView):
    create_success_message = ''

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.save_or_error(self.create_success_message)