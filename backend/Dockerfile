FROM python:3.11.9-slim-bookworm
ENV TZ=Asia/Bangkok

ARG TARGETPLATFORM

COPY . /code
WORKDIR /code
COPY ./requirements.txt /code/requirements.txt

RUN \
  ARCH=$(case ${TARGETPLATFORM:-linux/amd64} in \
  "linux/amd64")   echo "x86-64bit" ;; \
  "linux/arm64")   echo "aarch64"   ;; \
  *)               echo ""          ;; esac) && \
  echo "ARCH=$ARCH" && \
  # Install build dependencies
  apt-get update && \
  apt-get install -y curl build-essential unixodbc-dev g++ apt-transport-https && \
  curl -sSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /usr/share/keyrings/microsoft-prod.gpg && \
  curl -sSL https://packages.microsoft.com/config/debian/12/prod.list | tee /etc/apt/sources.list.d/mssql-release.list && \
  apt-get update && \
  # Install MySQL ODBC driver
  curl -L https://dev.mysql.com/get/Downloads/Connector-ODBC/8.3/mysql-connector-odbc-8.3.0-linux-glibc2.28-${ARCH}.tar.gz -o mysql_connector.tar.gz && \
  gunzip mysql_connector.tar.gz && tar xvf mysql_connector.tar && \
  mv mysql-connector-odbc-8.3.0-linux-glibc2.28-${ARCH} mysql_connector && \
  cp -r mysql_connector/bin/* /usr/local/bin && cp -r mysql_connector/lib/* /usr/local/lib && \
  myodbc-installer -a -d -n "MySQL ODBC 8.3 Unicode Driver" -t "Driver=/usr/local/lib/libmyodbc8w.so" && \
  myodbc-installer -a -d -n "MySQL ODBC 8.3 ANSI Driver" -t "Driver=/usr/local/lib/libmyodbc8a.so" && \
  myodbc-installer -d -l && \
  rm -rf mysql_connector* && \
  # Install ODBC Driver for SQL Server and PostgreSQL
  ACCEPT_EULA='Y' apt-get install -y msodbcsql17 odbc-postgresql && \
  # Install dependencies (pyobdc)
  pip install --upgrade pip && \
  pip install -r requirements.txt && rm requirements.txt && \
  # Cleanup build dependencies
  apt-get remove -y curl apt-transport-https debconf-utils g++ gcc rsync unixodbc-dev build-essential gnupg2 && \
  apt-get autoremove -y && apt-get autoclean -y

EXPOSE 8000

CMD ["uvicorn", "app.main:app","--host","0.0.0.0","--port","8000","--reload"]
