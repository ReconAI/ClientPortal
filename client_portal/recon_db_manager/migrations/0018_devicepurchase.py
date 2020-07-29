# Generated by Django 3.0.6 on 2020-07-24 13:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('recon_db_manager', '0017_device_category'),
    ]

    operations = [
        migrations.CreateModel(
            name='DevicePurchase',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('payment_id', models.CharField(db_column='paymentId', max_length=255)),
                ('device_name', models.CharField(db_column='deviceName', max_length=255)),
                ('device_price', models.DecimalField(db_column='devicePrice', decimal_places=2, max_digits=16)),
                ('device_cnt', models.PositiveIntegerField(db_column='deviceCount')),
                ('total', models.DecimalField(decimal_places=2, max_digits=16)),
                ('created_dt', models.DateTimeField(auto_now_add=True, null=True)),
                ('device', models.ForeignKey(db_column='deviceId', null=True, on_delete=django.db.models.deletion.SET_NULL, to='recon_db_manager.Device')),
                ('organization', models.ForeignKey(db_column='organizationId', null=True, on_delete=django.db.models.deletion.CASCADE, to='recon_db_manager.Organization')),
            ],
            options={
                'db_table': 'DevicePurchases',
            },
        ),
    ]
