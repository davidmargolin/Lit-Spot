from flask_restful import Resource
from flask import request
import requests
import csv
import json
from rest_api.models.fire import FireModel

class Fires(Resource):
    def get(self):
        return {
            "test": "test"
        }, 200

class Verify(Resource):
    def post(self):
        return {
            "test": "test"
        }, 200

class Shelters(Resource):
    def get(self):
        return {
            "test": "test"
        }, 200


# def fetchFiresDB():
#     fires =[]
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
#     for line in fires:
#         f = FireModel(
#             latitude= fires['latitude'],
#             longitude= fires['longitude'],
#             bright_ti4 = fires['bright_ti4'],
#             scan = fires['scan'],
#             track = fires['track'],
#             acq_datetime = fires['acq_date']+fires['acq_time'],
#             satellite = fires['satellite'],
#             confidence = fires['confidence'],
#             version = fires['version'],
#             bright_ti5 = fires['bright_ti5'],
#             frp= fires['frp'],
#             daynight = fires['daynight'],
#         )
#         f.save_to_db()

