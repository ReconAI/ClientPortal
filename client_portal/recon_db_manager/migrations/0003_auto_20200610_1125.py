# Generated by Django 3.0.6 on 2020-06-10 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recon_db_manager', '0002_remove_user_time_created'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.CharField(max_length=255, unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]
