# Generated by Django 3.0.6 on 2020-07-30 11:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recon_db_manager', '0020_remove_manufacturer_categories'),
    ]

    operations = [
        migrations.AddField(
            model_name='organization',
            name='created_dt',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
