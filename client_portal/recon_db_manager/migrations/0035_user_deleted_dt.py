# Generated by Django 3.0.6 on 2020-09-16 10:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recon_db_manager', '0034_auto_20200910_0958'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='deleted_dt',
            field=models.DateTimeField(null=True),
        ),
    ]