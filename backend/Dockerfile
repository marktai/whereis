FROM python:3-slim

# Enable production settings by default; for development, this can be set to 
# `false` in `docker run --env`
ENV DJANGO_PRODUCTION=true
ENV PYTHONUNBUFFERED 1

# Set terminal to be noninteractive
ENV DEBIAN_FRONTEND noninteractive

# Enable MySQL root user creation without interactive input
#RUN echo 'mysql-server mysql-server/root_password password devrootpass' | debconf-set-selections
#RUN echo 'mysql-server mysql-server/root_password_again password devrootpass' | debconf-set-selections

# Install packages
#RUN apt-get update && apt-get install -y \
#    git \
#    libmysqlclient-dev \
#    mysql-server \
#    nginx \
#    python-dev \
#    python-mysqldb \
#    python-setuptools \
#    supervisor \
#    vim \
#    curl
#RUN easy_install pip

# Handle urllib3 InsecurePlatformWarning
#RUN apt-get install -y libffi-dev libssl-dev libpython2.7-dev
#RUN pip install urllib3[security] requests[security] ndg-httpsclient pyasn1

# Configure Django project
RUN mkdir /code
#RUN mkdir /djangomedia
#RUN mkdir /static
RUN mkdir /logs
#RUN mkdir /logs/nginx
RUN mkdir /logs/gunicorn
WORKDIR /code

# Expose ports
# 80 = Nginx
# 8000 = Gunicorn
# 3306 = MySQL
EXPOSE 80 8000


# Configure Nginx
#RUN ln -s /code/nginx.conf /etc/nginx/sites-enabled/django_docker.conf
#RUN rm /etc/nginx/sites-enabled/default

# Run Supervisor (i.e., start MySQL, Nginx, and Gunicorn)
#COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

ADD requirements.txt /code/
RUN pip3 install -r requirements.txt

ADD . /code
#RUN chmod ug+x /code/initialize.sh

CMD ["/bin/sh","/code/initialize.sh"]
