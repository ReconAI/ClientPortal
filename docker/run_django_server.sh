#!/bin/bash
set -e

bash check_db_readiness.sh -t "${WAIT_FOR_DB_TIMEOUT}" "${CLIENT_PORTAL_DB_HOST}:${CLIENT_PORTAL_DB_PORT}" -- echo "${CLIENT_PORTAL_DB_HOST} DB IS READY" || { echo "${CLIENT_PORTAL_DB_NAME} DB IS DOWN"; exit 1; }
bash check_db_readiness.sh -t "${WAIT_FOR_DB_TIMEOUT}" "${RECON_AI_DB_HOST}:${RECON_AI_DB_PORT}" -- echo "${RECON_AI_DB_NAME} DB IS READY" || { echo "${RECON_AI_DB_NAME} DB IS DOWN"; exit 1; }

python manage.py migrate --settings=reporting_tool.settings
python manage.py runserver 0.0.0.0:8000