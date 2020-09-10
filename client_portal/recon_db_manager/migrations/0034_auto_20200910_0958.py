# Generated by Django 3.0.6 on 2020-09-10 09:58

from django.db import migrations

from recon_db_manager.models import TypeCode

FIELD_NAMES = ('type_name', 'order', 'value', 'short_description', 'long_description', 'created_by')

DEFAULT_TYPE_CODES = [
    ('EnumPedestrianTransitMethod', 0, 'WLK', 'Walking', 'Walking', 'initial data'),
    ('EnumPedestrianTransitMethod', 1, 'RUN', 'Running', 'Running', 'initial data'),
    ('EnumPedestrianTransitMethod', 2, 'BCC', 'Bicycling', 'Bicycling', 'initial data'),
    ('EnumPedestrianTransitMethod', 3, 'SCO', 'Scootering', 'Scootering', 'initial data'),
]

def load_type_codes(*args, **kwargs):
    TypeCode.objects.bulk_create([
        TypeCode(**dict(zip(FIELD_NAMES, type_code_raw)))
        for type_code_raw
        in DEFAULT_TYPE_CODES
    ])


class Migration(migrations.Migration):
    dependencies = [
        ('recon_db_manager', '0033_auto_20200910_0821'),
    ]

    operations = [
        migrations.RunPython(load_type_codes)
    ]
