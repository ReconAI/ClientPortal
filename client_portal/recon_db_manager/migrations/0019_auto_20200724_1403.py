# Generated by Django 3.0.6 on 2020-07-24 14:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recon_db_manager', '0018_devicepurchase'),
    ]

    operations = [
        migrations.AlterField(
            model_name='devicepurchase',
            name='total',
            field=models.PositiveIntegerField(),
        ),
    ]
