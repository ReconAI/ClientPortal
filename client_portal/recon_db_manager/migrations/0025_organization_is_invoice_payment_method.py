# Generated by Django 3.0.6 on 2020-08-19 10:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recon_db_manager', '0024_merge_20200819_1030'),
    ]

    operations = [
        migrations.AddField(
            model_name='organization',
            name='is_invoice_payment_method',
            field=models.BooleanField(default=False),
        ),
    ]
