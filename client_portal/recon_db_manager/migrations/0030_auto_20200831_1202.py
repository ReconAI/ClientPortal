# Generated by Django 3.0.6 on 2020-08-31 12:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recon_db_manager', '0029_auto_20200831_1202'),
    ]

    operations = [
        migrations.AlterField(
            model_name='relevantdata',
            name='license_plate_number',
            field=models.CharField(blank=True, db_column='licensePlateNumber', max_length=15, null=True),
        ),
    ]