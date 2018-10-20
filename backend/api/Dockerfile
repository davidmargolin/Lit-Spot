FROM python:3.6.6
MAINTAINER Shawn Yang <shawnyang610@gmail.com>

# Create the group and user to be used in this container
RUN groupadd flaskgroup && useradd -m -g flaskgroup -s /bin/bash flask
RUN apt-get update

# Create the working directory (and set it as the working directory)
RUN mkdir -p /home/flask/app/api
WORKDIR /home/flask/app/api

# Install the package dependencies (this step is separated
# from copying all the source code to avoid having to
# re-install all python packages defined in requirements.txt
# whenever any source code change is made)
COPY requirements.txt /home/flask/app/api
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the source code into the container
COPY . /home/flask/app/api

RUN chown -R flask:flaskgroup /home/flask

USER flask

VOLUME /home/flask/app/api/rest_api/static