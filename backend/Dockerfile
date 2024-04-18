FROM python:3.10.12-alpine
ENV TZ=Asia/Bangkok

RUN apk add curl
RUN apk update && apk add gcc g++ unixodbc unixodbc-dev

COPY . /code
WORKDIR /code

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8888

CMD ["uvicorn", "app.main:app","--host","0.0.0.0","--port","8888","--reload"]
