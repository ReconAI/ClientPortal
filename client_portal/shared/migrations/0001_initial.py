# Generated by Django 3.0.6 on 2020-07-10 16:56

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import shared.managers
import shared.permissions


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
                ('firstname', models.CharField(max_length=255, null=True)),
                ('lastname', models.CharField(max_length=255, null=True)),
                ('address', models.CharField(max_length=255, null=True)),
                ('phone', models.CharField(max_length=255, null=True)),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('created_dt', models.DateTimeField(auto_now_add=True, null=True)),
                ('username', models.CharField(max_length=255, unique=True)),
                ('password', models.CharField(blank=True, max_length=255, null=True)),
                ('user_level', models.CharField(blank=True, max_length=3, null=True)),
                ('is_active', models.BooleanField(db_column='isEmailVerified', default=False)),
            ],
            options={
                'db_table': 'Users',
                'managed': False,
            },
            bases=(models.Model, shared.permissions.PermissionsMixin),
            managers=[
                ('objects', shared.managers.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='UserGroup',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='auth.Group')),
                ('user', models.OneToOneField(db_column='user_id', db_constraint=False, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'UserGroups',
            },
        ),
        migrations.CreateModel(
            name='Token',
            fields=[
                ('key', models.CharField(max_length=40, primary_key=True, serialize=False, verbose_name='Key')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='Created')),
                ('user', models.OneToOneField(db_column='user_id', db_constraint=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='token', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'Tokens',
            },
        ),
    ]
