# Generated by Django 3.0.6 on 2020-08-06 14:31

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('recon_db_manager', '0022_auto_20200803_1329'),
    ]

    operations = [
        migrations.CreateModel(
            name='RecurrentCharge',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('payment_id', models.CharField(db_column='paymentId', max_length=255, null=True)),
                ('device_license_fee', models.DecimalField(db_column='deviceLicenseFee', decimal_places=2, max_digits=16)),
                ('user_license_fee', models.DecimalField(db_column='userLicenseFee', decimal_places=2, max_digits=16)),
                ('device_cnt', models.PositiveIntegerField(db_column='deviceCnt', default=0)),
                ('vat', models.DecimalField(db_column='VAT', decimal_places=2, max_digits=16)),
                ('total', models.PositiveIntegerField()),
                ('created_dt', models.DateTimeField(auto_now_add=True)),
                ('invoice_data', django.contrib.postgres.fields.jsonb.JSONField(db_column='invoiceData')),
                ('organization', models.ForeignKey(db_column='organizationId', on_delete=django.db.models.deletion.CASCADE, to='recon_db_manager.Organization')),
            ],
            options={
                'db_table': 'RecurrentCharges',
            },
        ),
    ]
