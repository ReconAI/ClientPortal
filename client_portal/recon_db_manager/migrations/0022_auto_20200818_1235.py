# Generated by Django 3.0.6 on 2020-08-18 12:35

from django.db import migrations

from recon_db_manager.models import TypeCode

FIELD_NAMES = ('type_name', 'order', 'value', 'short_description', 'long_description', 'created_by')

DEFAULT_TYPE_CODES = [
    ('EnumRoadEvents', 0, 'ACC', 'Traffic Accident', 'Traffic Accident', 'initial data'),
    ('EnumRoadEvents', 1, 'FIR', 'Fire', 'Fire', 'initial data'),
    ('EnumRoadEvents', 2, 'ROB', 'Robberie', 'Robberie', 'initial data'),

    ('EnumDObjectTypes', 0, 'CAR', 'Car', 'Regular Car', 'initial data'),
    ('EnumDObjectTypes', 1, 'VAN', 'Van', 'Van', 'initial data'),
    ('EnumDObjectTypes', 2, 'TRK', 'Truck', 'Truck', 'initial data'),
    ('EnumDObjectTypes', 3, 'TRL', 'Trailer', 'Trailer', 'initial data'),
    ('EnumDObjectTypes', 4, 'BUS', 'Bus', 'Bus', 'initial data'),
    ('EnumDObjectTypes', 5, 'MOT', 'Motorbike', 'Motorbike', 'initial data'),
    ('EnumDObjectTypes', 6, 'BIC', 'Bicycle', 'Bicycle', 'initial data'),
    ('EnumDObjectTypes', 7, 'HEQ', 'Heavy Equipment', 'Heavy Equipment', 'initial data'),
    ('EnumDObjectTypes', 8, 'CTR', 'Car Trailer', 'Car Trailer', 'initial data'),
    ('EnumDObjectTypes', 9, 'TRC', 'Tractor', 'Tractor', 'initial data'),
    ('EnumDObjectTypes', 10, 'PDS', 'Pedestrians', 'Pedestrians', 'initial data'),
    ('EnumDObjectTypes', 11, 'COU', 'Coupe', 'Coupe', 'initial data'),
    ('EnumDObjectTypes', 12, 'SUV', 'SUV', 'SUV', 'initial data'),
    ('EnumDObjectTypes', 13, 'LRG', 'Large Vehicle', 'Large Vehicle', 'initial data'),
    ('EnumDObjectTypes', 14, 'SED', 'Sedan', 'Sedan', 'initial data'),

    ('EnumRoadConditions', 0, 'DRY', 'Dry', 'Road is clear', 'initial data'),
    ('EnumRoadConditions', 1, 'MST', 'Moist', 'Road seems not to be dry nor wet and no water reflections', 'initial data'),
    ('EnumRoadConditions', 2, 'WET', 'Moist', 'All road is wet and visible water reflections', 'initial data'),
    ('EnumRoadConditions', 3, 'WAS', 'Wet & Salty', 'Road is wet and there are traces of after snowfall', 'initial data'),
    ('EnumRoadConditions', 4, 'FRS', 'Frost', 'Snow on road and you can find a special texture', 'initial data'),
    ('EnumRoadConditions', 5, 'SNW', 'Snow', 'All road area or majority of it is covered by snow', 'initial data'),
    ('EnumRoadConditions', 6, 'ICE', 'Ice', 'Visibile continues lines on snowy road', 'initial data'),
    ('EnumRoadConditions', 7, 'PMS', 'Probably moist/salty', 'Same as moist condition but with traces after snowfall', 'initial data'),
    ('EnumRoadConditions', 8, 'SLH', 'Slushy', 'Road is covered in mud like the Ice condition but when its brown', 'initial data'),

    ('EnumWeatherConditions', 0, 'CLR', 'Clear', 'Clear', 'initial data'),
    ('EnumWeatherConditions', 1, 'WRN', 'Weak rain', 'Weak rain', 'initial data'),
    ('EnumWeatherConditions', 2, 'MRN', 'Mediocre rain', 'Mediocre rain', 'initial data'),
    ('EnumWeatherConditions', 3, 'HRN', 'Heavy rain', 'Heavy rain', 'initial data'),
    ('EnumWeatherConditions', 4, 'WSN', 'Weak snow/sleet', 'Weak snow/sleet', 'initial data'),
    ('EnumWeatherConditions', 5, 'MSN', 'Mediocre snow/sleet', 'Mediocre snow/sleet', 'initial data'),
    ('EnumWeatherConditions', 6, 'HSN', 'Heavy snow/sleet', 'Heavy snow/sleet', 'initial data'),

    ('EnumVerificationResults', 0, 'POS', 'Positive', 'Positive', 'initial data'),
    ('EnumVerificationResults', 1, 'NEG', 'Negative', 'Negative', 'initial data'),

    ('EnumFileTypes', 0, 'IMG', 'Image', 'Image', 'initial data'),
    ('EnumFileTypes', 1, 'CAD', 'CAD Drawing', 'CAD Drawing', 'initial data'),

    ('EnumUserLevels', 0, 'ADM', 'Administrator', 'Administrator', 'initial data'),
    ('EnumUserLevels', 1, 'SUS', 'Super User', 'Super User', 'initial data'),
    ('EnumUserLevels', 2, 'USR', 'User', 'User', 'initial data'),

    ('EnumLicenseTypes', 0, 'REG', 'Regular License', 'Regular License', 'initial data'),

    ('EnumAlgorithmClasses', 0, 'NN', 'Neural Network', 'Neural Network', 'initial data'),
    ('EnumAlgorithmClasses', 1, 'ML', 'Machine Learning', 'Machine Learning', 'initial data'),

    ('EnumAlgorithmStatuses', 0, 'ITR', 'In Training', 'Training in progress', 'initial data'),
    ('EnumAlgorithmStatuses', 1, 'ERR', 'Error', 'Error', 'initial data'),
    ('EnumAlgorithmStatuses', 2, 'CMP', 'Training Completed', 'Training Completed', 'initial data'),
    ('EnumAlgorithmStatuses', 3, 'DPL', 'Deployed', 'Deployed', 'initial data'),

    ('EnumDeviceTypes', 0, 'ECU', 'ECU', 'ECU', 'initial data'),
    ('EnumDeviceTypes', 1, 'IDE', 'idev', 'idev', 'initial data'),
    ('EnumDeviceTypes', 2, 'MDE', 'mdev', 'mdev', 'initial data')
]


def load_type_codes(*args, **kwargs):
    TypeCode.objects.bulk_create([
        TypeCode(**dict(zip(FIELD_NAMES, type_code_raw)))
        for type_code_raw
        in DEFAULT_TYPE_CODES
    ])


class Migration(migrations.Migration):
    dependencies = [
        ('recon_db_manager', '0021_organization_created_dt'),
    ]

    operations = [
        migrations.RunPython(load_type_codes)
    ]
