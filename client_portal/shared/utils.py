"""
Utils made use accorss the projects
"""

from abc import abstractmethod

from django.core.mail import EmailMultiAlternatives
from django.template import loader
from django.template.loader import render_to_string


class SendEmailMixin:
    """
    Class allowing client to send an email
    """
    def send_mail(self, to_email: list, subject_location: str,
                  body_location: str, attachments=None, from_email=None,
                  *args, **kwargs):
        """
        Sends email on invocation

        :type to_email: list
        :type subject_location: str
        :type body_location: str
        :type attachments: Optional[List]
        :type from_email: str
        """
        context = self.get_email_context(*args, **kwargs)

        message = render_to_string(body_location, context)

        subject = loader.render_to_string(subject_location, context)

        EmailMultiAlternatives(
            ''.join(subject.splitlines()),
            message,
            to=to_email,
            from_email=from_email,
            attachments=attachments
        ).send()

    @abstractmethod
    def get_email_context(self, *args, **kwargs) -> dict:
        """
        Email context for template loader

        :rtype: dict
        """
