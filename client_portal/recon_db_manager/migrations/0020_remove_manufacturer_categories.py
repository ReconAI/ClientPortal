# Generated by Django 3.0.6 on 2020-07-27 11:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('recon_db_manager', '0019_auto_20200724_1403'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='manufacturer',
            name='categories',
        ),
    ]
