FROM python:3.10-slim-buster

# Отключает сохранение кеша питоном
ENV PYTHONDONTWRITEBYTECODE 1
# Если проект крашнется, выведется сообщение из-за какой ошибки это произошло
ENV PYTHONUNBUFFERED 1


WORKDIR /GoodProject/project/

RUN pip install fastapi uvicorn keras pandas tensorflow pillow jinja2 python-multipart
RUN pip install Cython --install-option="--no-cython-compile"

COPY . .