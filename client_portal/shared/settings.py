import os


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'jq)oglowie!vb8rz3h+zo(bc(*!_ops)7#5dbbe&88cc#^-(1-'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', 'True') not in ['False', '0']

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ALLOWED_HOSTS = [os.environ.get('ALLOWED_HOSTS'), '127.0.0.1']

APP_NAME = 'Recon AI'

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

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = '/static/'
MEDIA_URL = '/media/'

# Enable/Disable http requests service data capturing
LOG_HTTP = os.environ.get('LOG_HTTP', 'False') in ['True', '1']

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

SHARED_TEMPLATES_DIR = '{}/{}'.format(BASE_DIR, 'templates')

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'shared.authentication.TokenAuthentication',
    ],
    'EXCEPTION_HANDLER': 'shared.exception_handlers.exception_handler',
    'DEFAULT_PAGINATION_CLASS': 'shared.pagination.PageNumberPagination',
    'PAGE_SIZE': 15
}

SWAGGER_SETTINGS = {
    'DEFAULT_PAGINATOR_INSPECTORS': [
        'shared.swagger.inspectors.DjangoRestResponsePagination',
        'drf_yasg.inspectors.CoreAPICompatInspector',
    ],
}

AUTH_USER_MODEL = 'shared.User'

CLIENT_APP_SHEMA_HOST_PORT = os.environ.get(
    'CLIENT_APP_SHEMA_HOST_PORT')  # like http://127.0.0.1:8000

# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

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

# --- PAYMENTS SETTINGS --- #
CURRENCY = "eur"
VAT = 0                         # vat in %
TRIAL_PERIOD_DAYS = 30
CHARGE_EACH_N_DAYS = 30
STRIPE_PUBLISHABLE_KEY = os.environ.get('STRIPE_PUBLISHABLE_KEY')
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')
USER_LICENSE_FEE = 29.9         # eur
DEVICE_LICENSE_FEE = 5.9        # eur
INFRASTRUCTURE_USAGE_FEE = 1    # eur
INFRASTRUCTURE_USAGE_TAX = 20   # %
# --- PAYMENTS SETTINGS --- #


# --- INVOICE SETTINGS --- #
BANK_REFERENCE_CODE = 1038
IBAN = 'FI48 1778 3000 0065 95'
DEVICE_UNIT = 'pcs'

BIC = 'NDEAFIHH'
TERMS_OF_PAYMENT_DAYS = 14
INTEREST_RATE = 8  # in %
BANK_CONNECTION = ' Nordea FI48 1778 3000 0065 95 NDEAFIHH'
DOMICILE = 'Tampere'
# --- INVOICE SETTINGS --- #


EMAIL_BACKEND = 'django.core.mail.backends.{}.EmailBackend'.format(
    os.environ.get('EMAIL_BACKEND', 'console')  # console, dummy, firebased, locmem, smtp
)
EMAIL_HOST = os.environ.get('EMAIL_HOST')
EMAIL_PORT = os.environ.get('EMAIL_PORT')
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL')

INFO_EMAIL = os.environ.get('INFO_EMAIL')