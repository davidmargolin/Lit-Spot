from flask import Flask, render_template, request
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from os.path import abspath, dirname
from apscheduler.schedulers.background import BackgroundScheduler
import requests
import csv
import json

###########################
#### config flask app ####
###########################
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
app.config['PROPAGATE_EXCEPTIONS'] = True
app.config['SECRET_KEY'] = 'myappsecretkey'


scheduler = BackgroundScheduler()
scheduler.start()

fires = []

def fetchFires():
    global fires
    headers = {'Authorization': 'Bearer 78978166-D47B-11E8-A432-CF089B439298'}
    filesListURL = "https://nrt4.modaps.eosdis.nasa.gov/api/v2/files/details/FIRMS/viirs/USA_contiguous_and_Hawaii?fields=all&format=json"
    files = requests.get(filesListURL, headers=headers)
    newestFileURL = "https://nrt4.modaps.eosdis.nasa.gov" + files.json()["content"][0]["downloadsLink"]
    newestFile = requests.get(newestFileURL, headers=headers)
    dict_list = []
    reader = csv.DictReader(newestFile.text.splitlines())
    for line in reader:
        dict_list.append(line)
    fires = dict_list

fetchFires()

scheduler.add_job(fetchFires, 'interval', minutes=15)

#### web home ####
@app.route("/")
def home():
    return json.dumps(fires)


###########################
#### config database ######
##########################
basedir = abspath(dirname(__file__))

app.config['POSTGRES_USER'] = "shawn"
app.config["POSTGRES_DEFAULT_USER"] = "postgres"
app.config["POSTGRES_PASSWORD"] = "my_password"
app.config["POSTGRES_DB"]="youcmt-db"
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://'+ app.config['POSTGRES_USER']+":"+app.config["POSTGRES_PASSWORD"]+"@postgres:5432/"+app.config["POSTGRES_DB"]
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

########################
#### config jwt ########
#######################
app.config["JWT_SECRET_KEY"] = "myjwtsecretkey"
app.config["JWT_BLACKLIST_ENABLED"] =True
app.config["JWT_BLACKLIST_TOKEN_CHECKS"] = ["access", "refresh"]

jwt = JWTManager(app)


###########################
#### config api  ######
###########################
api = Api(app)


# from rest_api.resources.env import DateTime # noqa
# api.add_resource(DateTime, "/api/datetime")

# from rest_api.resources.user import UserRegister, UserInfo # noqa
# api.add_resource(UserRegister, "/api/user/register")
# api.add_resource(UserInfo, "/api/user/info")

# from rest_api.resources.video import VideoInfo # noqa
# api.add_resource(VideoInfo, "/api/video/info")

from rest_api.resources.litspot import Fires # noqa
api.add_resource(Fires, "/api/fires")

####################################
#### allow rest api request header
######################################
@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  response.headers.add('Content-Type', 'application/json; charset=utf-8')
  return response
