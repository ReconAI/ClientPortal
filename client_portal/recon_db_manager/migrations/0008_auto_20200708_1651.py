# Generated by Django 3.0.6 on 2020-07-08 16:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('recon_db_manager', '0007_auto_20200630_1137'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=255, unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='firstname',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='lastname',
            field=models.CharField(max_length=255, null=True),
        ),
    ]