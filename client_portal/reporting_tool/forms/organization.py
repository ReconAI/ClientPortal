from django.forms import ModelForm

from recon_db_manager.models import Organization


class OrganizationForm(ModelForm):
    """
    Organization model form
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        for _, field in self.fields.items():
            field.required = True

    class Meta:
        """
        All fields apart from id should be editable
        """
        model = Organization
        fields = (
            "name", "vat", "main_firstname", "main_lastname", "main_address",
            "main_phone", "main_email", "inv_firstname", "inv_lastname",
            "inv_address", "inv_phone", "inv_email"
        )
