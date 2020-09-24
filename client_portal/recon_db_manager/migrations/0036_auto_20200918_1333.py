# Generated by Django 3.0.6 on 2020-09-18 13:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('recon_db_manager', '0035_user_deleted_dt'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='devicepurchase',
            name='created_dt',
        ),
        migrations.RemoveField(
            model_name='devicepurchase',
            name='organization',
        ),
        migrations.RemoveField(
            model_name='devicepurchase',
            name='payment_id',
        ),
        migrations.RemoveField(
            model_name='devicepurchase',
            name='total',
        ),
        migrations.CreateModel(
            name='Purchase',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('payment_id', models.CharField(db_column='paymentId', max_length=255)),
                ('total', models.PositiveIntegerField()),
                ('vat', models.DecimalField(db_column='VAT', decimal_places=2, max_digits=16)),
                ('created_dt', models.DateTimeField(auto_now_add=True, null=True)),
                ('organization', models.ForeignKey(db_column='organizationId', null=True, on_delete=django.db.models.deletion.CASCADE, to='recon_db_manager.Organization')),
            ],
            options={
                'db_table': 'Purchases',
            },
        ),
        migrations.AddField(
            model_name='devicepurchase',
            name='purchase',
            field=models.ForeignKey(db_column='orderId', null=False, on_delete=django.db.models.deletion.CASCADE, related_name='device_purchases', to='recon_db_manager.Purchase'),
        ),
    ]