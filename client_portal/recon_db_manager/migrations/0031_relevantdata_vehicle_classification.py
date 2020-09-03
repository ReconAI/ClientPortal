# Generated by Django 3.0.6 on 2020-09-01 06:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('recon_db_manager', '0030_auto_20200831_1202'),
    ]

    operations = [
        migrations.AddField(
            model_name='relevantdata',
            name='vehicle_classification',
            field=models.ForeignKey(blank=True, db_column='vehicleClassification', max_length=3, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='relevant_data_vehicle_classification', to='recon_db_manager.TypeCode', to_field='value'),
        ),
    ]