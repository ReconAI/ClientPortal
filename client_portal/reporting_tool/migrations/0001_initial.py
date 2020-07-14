# Generated by Django 3.0.6 on 2020-06-10 11:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0011_update_proxy_permissions'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('firstname', models.CharField(blank=True, max_length=255, null=True)),
                ('lastname', models.CharField(blank=True, max_length=255, null=True)),
                ('address', models.CharField(blank=True, max_length=255, null=True)),
                ('phone', models.CharField(blank=True, max_length=255, null=True)),
                ('email', models.CharField(max_length=255, unique=True)),
                ('created_dt', models.DateTimeField(auto_now_add=True, null=True)),
                ('username', models.CharField(max_length=255, unique=True)),
                ('password', models.CharField(blank=True, max_length=255, null=True)),
                ('user_level', models.CharField(blank=True, max_length=3, null=True)),
            ],
            options={
                'db_table': 'Users',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='UserGroup',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('user_id', models.IntegerField(db_column='userId', unique=True)),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='auth.Group')),
            ],
        ),
    ]