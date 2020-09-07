#!/bin/bash

mkdir -p /var/run/celery /var/log/celery
chown -R nobody:nogroup /var/run/celery /var/log/celery

celery -A reporting_tool worker \
  --loglevel=INFO --logfile=/var/log/celery/worker-example.log \
  --uid=nobody --gid=nogroup
