from rest_framework.fields import CharField

from recon_db_manager.models import Organization
from shared.serializers import ReadOnlySerializer


class AttachPaymentMethodSerializer(ReadOnlySerializer):
    payment_method = CharField(
        required=True,
        allow_null=False,
        allow_blank=False
    )

    class Meta:
        model = Organization
        fields = ('payment_method', )

    def save(self):
        payment_method = self.validated_data.get('payment_method')

        return self.instance.customer.payment_methods().attach(payment_method)


class DetachPaymentMethodSerializer(AttachPaymentMethodSerializer):
    def save(self):
        payment_method = self.validated_data.get('payment_method')

        return self.instance.customer.payment_methods().detach(payment_method)
