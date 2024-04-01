#!/bin/bash
# This script initializes the Django project. It will be executed (from
# supervisord) every time the Docker image is run.

set -euxo pipefail

if [ ! -f src/whereis/keys.py ]; then
  echo "SECRET_KEY = '"$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)"'" > src/whereis/keys.py
  echo $(pwd)"/src/whereis/keys.py generated"
fi

while ! pg_isready -U postgres -h db -p 5432; do
  sleep 5
done

python3 src/manage.py makemigrations
python3 src/manage.py migrate --noinput

printf "from django.contrib.auth.models import User;\nif not User.objects.all().exists(): User.objects.create_superuser('root', 'mark@marktai.com', password='password')" | python3 src/manage.py shell

python3 src/manage.py runserver 0.0.0.0:80
