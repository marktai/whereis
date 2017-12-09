FROM python:3.7-rc-alpine

ENV DJANGO_PRODUCTION=false
ENV PYTHONUNBUFFERED 1

RUN apk add --no-cache libpq postgresql-dev build-base zlib-dev jpeg-dev tiff-dev freetype-dev lcms-dev libwebp-dev 

RUN mkdir /logs
RUN mkdir /logs/gunicorn

WORKDIR /app

EXPOSE 80

ADD requirements.txt /app/
RUN pip3 install -r requirements.txt

ADD . /app/

CMD ["/bin/sh","/app/initialize.sh"]
