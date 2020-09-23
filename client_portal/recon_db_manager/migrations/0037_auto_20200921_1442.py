# Generated by Django 3.0.6 on 2020-09-21 14:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('recon_db_manager', '0036_auto_20200918_1333'),
    ]

    operations = [
        migrations.AlterField(
            model_name='devicepurchase',
            name='purchase',
            field=models.ForeignKey(db_column='orderId', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='device_purchases', to='recon_db_manager.Purchase'),
        ),
        migrations.AlterField(
            model_name='purchase',
            name='payment_id',
            field=models.CharField(blank=True, db_column='paymentId', max_length=255, null=True),
        ),
    ]
