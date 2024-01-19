# Initialy
# FROM python:3.8.8

# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1
# ENV PYTHONWARNINGS ignore

# RUN apt-get -y update && apt-get -y upgrade
# RUN apt-get install -yq cron vim tzdata
# RUN  ln -fs /usr/share/zoneinfo/Asia/Bangkok /etc/localtime && \
#     dpkg-reconfigure -f noninteractive tzdata

FROM python:3.10.12-alpine
ENV TZ=Asia/Bangkok

RUN apk add curl
RUN apk update && apk add gcc g++ unixodbc unixodbc-dev

COPY . /code
WORKDIR /code

RUN pip install --no-cache-dir -r requirements.txt

COPY crontab /etc/cron.d/crontab
RUN chmod 0644 /etc/cron.d/crontab
RUN chmod 0777 /code/entry.sh
RUN chmod 0777 /code/runcron.sh
RUN /usr/bin/crontab /etc/cron.d/crontab
EXPOSE 8888

CMD ["/code/entry.sh"]