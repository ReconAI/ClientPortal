#!/bin/bash
set -e

bash check_db_readiness.sh -t "${WAIT_FOR_DB_TIMEOUT}" "${DJANGO_DB_HOST}:${DJANGO_DB_PORT}" -- echo "${DJANGO_DB_NAME} DB IS READY" || { echo "${DJANGO_DB_NAME} DB IS DOWN"; exit 1; }
bash check_db_readiness.sh -t "${WAIT_FOR_DB_TIMEOUT}" "${RECON_AI_DB_HOST}:${RECON_AI_DB_PORT}" -- echo "${RECON_AI_DB_NAME} DB IS READY" || { echo "${RECON_AI_DB_NAME} DB IS DOWN"; exit 1; }

python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8000