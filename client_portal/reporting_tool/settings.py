"""
Django settings for reporting_tool project.

Generated by 'django-admin startproject' using Django 3.0.6.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'jq)oglowie!vb8rz3h+zo(bc(*!_ops)7#5dbbe&88cc#^-(1-'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', 'True') not in ['False', '0']

ALLOWED_HOSTS = [os.environ.get('ALLOWED_HOSTS'), '127.0.0.1']

APP_NAME = 'Recon AI'

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'reporting_tool',
    'recon_db_manager',
    'drf_yasg',
    'shared'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'shared.middlewares.HTTPLogMiddleware'
]

EMAIL_BACKEND = 'django.core.mail.backends.{}.EmailBackend'.format(
    os.environ.get('EMAIL_BACKEND', 'console')  # console, dummy, firebased, locmem, smtp
)
EMAIL_HOST = os.environ.get('EMAIL_HOST')
EMAIL_PORT = os.environ.get('EMAIL_PORT')
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL')

ROOT_URLCONF = 'reporting_tool.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['{}/{}'.format(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'shared.authentication.TokenAuthentication',
    ],
    'EXCEPTION_HANDLER': 'shared.exception_handlers.exception_handler',
    'DEFAULT_PAGINATION_CLASS': 'shared.pagination.PageNumberPagination',
    'PAGE_SIZE': 3
}

SWAGGER_SETTINGS = {
    'DEFAULT_PAGINATOR_INSPECTORS': [
        'shared.swagger.inspectors.DjangoRestResponsePagination',
        'drf_yasg.inspectors.CoreAPICompatInspector',
    ],
}

AUTH_USER_MODEL = 'shared.User'

WSGI_APPLICATION = 'reporting_tool.wsgi.application'

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

RECON_AI_CONNECTION_NAME = 'recon_ai_db'

DATABASES = {
    'default': {
        'ENGINE': '{}.{}'.format('django.db.backends',
                                 os.environ.get('CLIENT_PORTAL_DB_ENGINE',
                                                'sqlite3')),
        'NAME': os.environ.get('CLIENT_PORTAL_DB_NAME', ''),
        'USER': os.environ.get('CLIENT_PORTAL_DB_USER', ''),
        'PASSWORD': os.environ.get('CLIENT_PORTAL_DB_PASSWORD', ''),
        'HOST': os.environ.get('CLIENT_PORTAL_DB_HOST', ''),
        'PORT': os.environ.get('CLIENT_PORTAL_DB_PORT', '')
    },
    RECON_AI_CONNECTION_NAME: {
        'ENGINE': '{}.{}'.format('django.db.backends',
                                 os.environ.get('RECON_AI_DB_ENGINE',
                                                'sqlite3')),
        'NAME': os.environ.get('RECON_AI_DB_NAME', ''),
        'USER': os.environ.get('RECON_AI_DB_USER', ''),
        'PASSWORD': os.environ.get('RECON_AI_DB_PASSWORD', ''),
        'HOST': os.environ.get('RECON_AI_DB_HOST', ''),
        'PORT': os.environ.get('RECON_AI_DB_PORT', '')
    }
}

DATABASE_ROUTERS = ['shared.db_routers.ReconDBRouter']

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
    {
        'NAME': 'shared.validators.TwoLowercasesPasswordValidator',
    },
    {
        'NAME': 'shared.validators.TwoUppercasesPasswordValidator',
    },
    {
        'NAME': 'shared.validators.TwoNumbersPasswordValidator',
    },
    {
        'NAME': 'shared.validators.SpecialCharacterPasswordValidator',
    },
]

AWS_IAM_USER_MANAGER = os.environ.get('AWS_IAM_SYNC_MANAGER',
                                      'shared.managers.DummyIaMUserManager')
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID', '')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY', '')
AWS_IAM_USER_GROUP = os.environ.get('AWS_IAM_USER_GROUP', '')

# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = '/static/'
STORAGE_ROOT = '{}/{}/'.format(BASE_DIR, 'data')

# Enable/Disable http requests service data capturing
LOG_HTTP = os.environ.get('LOG_HTTP', 'False') in ['True', '1']

# Export http log aws bucket and key accordingly
CLIENT_PORTAL_BUCKET = os.environ.get('AWS_CLIENT_PORTAL_BUCKET')
AWS_EXPORT_HTTP_LOG_KEY = os.environ.get('AWS_EXPORT_HTTP_LOG_KEY')

CLIENT_APP_SHEMA_HOST_PORT = os.environ.get(
    'CLIENT_APP_SHEMA_HOST_PORT')  # like http://127.0.0.1:8000

# Payments settings
TRIAL_PERIOD_DAYS = 30

STRIPE_PUBLISHABLE_KEY = os.environ.get('STRIPE_PUBLISHABLE_KEY')
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')

LOGGING = {
    'version': 1,
    'filters': {
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        }
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
        }
    },
    'loggers': {
        'django.db.backends': {
            'level': 'DEBUG',
            'handlers': ['console'],
        }
    }
}
