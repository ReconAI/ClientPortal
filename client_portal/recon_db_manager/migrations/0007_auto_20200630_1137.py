# Generated by Django 3.0.6 on 2020-06-30 11:37

from django.db import migrations, models


# Schema itself is not affected. Email fields are just converted to Django's
# EmailField


class Migration(migrations.Migration):

    dependencies = [
        ('recon_db_manager', '0006_auto_20200612_1234'),
    ]

    operations = [
        migrations.AlterField(
            model_name='organization',
            name='inv_email',
            field=models.EmailField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='organization',
            name='main_email',
            field=models.EmailField(blank=True, max_length=255, null=True),
        ),
    ]
