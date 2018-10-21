from flask import Flask, request
from flask_restful import Api
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

# scheduler = BackgroundScheduler()
# scheduler.start()

# fires = []

# def fetchFires():
#     global fires
#     headers = {'Authorization': 'Bearer 78978166-D47B-11E8-A432-CF089B439298'}
#     filesListURL = "https://nrt4.modaps.eosdis.nasa.gov/api/v2/files/details/FIRMS/viirs/USA_contiguous_and_Hawaii?fields=all&format=json"
#     files = requests.get(filesListURL, headers=headers)
#     newestFileURL = "https://nrt4.modaps.eosdis.nasa.gov" + files.json()["content"][-1]["downloadsLink"]
#     newestFile = requests.get(newestFileURL, headers=headers)
#     dict_list = []
#     reader = csv.DictReader(newestFile.text.splitlines())
#     for line in reader:
#         dict_list.append(line)
#     fires = dict_list

# fetchFires()

# scheduler.add_job(fetchFires, 'interval', minutes=15)

### web home ####
@app.route("/")
def home():
    return "hello world"


###########################
#### config database ######
##########################
basedir = abspath(dirname(__file__))

app.config['POSTGRES_USER'] = "shawn"
app.config["POSTGRES_DEFAULT_USER"] = "postgres"
app.config["POSTGRES_PASSWORD"] = "my_password"
app.config["POSTGRES_DB"]="litspot-db"
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://'+ app.config['POSTGRES_USER']+":"+app.config["POSTGRES_PASSWORD"]+"@postgres:5432/"+app.config["POSTGRES_DB"]
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False



db = SQLAlchemy(app)





########################
#### config jwt ########
#######################
# app.config["JWT_SECRET_KEY"] = "myjwtsecretkey"
# app.config["JWT_BLACKLIST_ENABLED"] =True
# app.config["JWT_BLACKLIST_TOKEN_CHECKS"] = ["access", "refresh"]

###########################
#### config api  ######
###########################
api = Api(app)

from rest_api.models.fire import FireModel # noqa

scheduler = BackgroundScheduler()
scheduler.start()

# @app.before_first_request
def fetchDB():
    FireModel.delete_all()
    headers = {'Authorization': 'Bearer 78978166-D47B-11E8-A432-CF089B439298'}
    filesListURL = "https://nrt4.modaps.eosdis.nasa.gov/api/v2/files/details/FIRMS/viirs/USA_contiguous_and_Hawaii?fields=all&format=json"
    files = requests.get(filesListURL, headers=headers)
    newestFileURL = "https://nrt4.modaps.eosdis.nasa.gov" + files.json()["content"][-1]["downloadsLink"]
    newestFile = requests.get(newestFileURL, headers=headers)
    dict_list = []
    reader = csv.DictReader(newestFile.text.splitlines())
    for line in reader:
        dict_list.append(line)
    fires = dict_list
    for line in fires:

        datetime= (
            line['acq_date'][0:4]+line['acq_date'][5:7]+line['acq_date'][8:10]+
            line['acq_time'][0:2]+line['acq_time'][3:5]
        )
        f = FireModel(
            latitude= float(line['latitude']),
            longitude= float(line['longitude']),
            bright_ti4 = float(line['bright_ti4']),
            scan = float(line['scan']),
            track = float(line['track']),
            # acq_datetime = line['acq_date']+line['acq_time'],
            acq_datetime = datetime,
            satellite = line['satellite'],
            confidence = line['confidence'],
            version = line['version'],
            bright_ti5 = float(line['bright_ti5']),
            frp= float(line['frp']),
            daynight = line['daynight']
        )
        f.save_to_db()
fetchDB()
scheduler.add_job(fetchDB, 'interval', minutes=15)
# from rest_api.resources.env import DateTime # noqa
# api.add_resource(DateTime, "/api/datetime")

# from rest_api.resources.user import UserRegister, UserInfo # noqa
# api.add_resource(UserRegister, "/api/user/register")
# api.add_resource(UserInfo, "/api/user/info")

# from rest_api.resources.video import VideoInfo # noqa
# api.add_resource(VideoInfo, "/api/video/info")

from rest_api.resources.litspot import Fires, Verify, DrillNYC# noqa
api.add_resource(Fires, "/api/fires")
api.add_resource(Verify,"/api/verify")
api.add_resource(DrillNYC, "/api/drillnyc")


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



