from flask_restful import Resource, reqparse
from flask import request
import requests
import csv
import json
from rest_api.models.fire import FireModel

class Fires(Resource):
    def get(self):
        return {
            'data': [row.json() for row in FireModel.find_all()]
            }


class Verify(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument(
        "latitude", type=float, required=True, help="latitude missing"
    )
    parser.add_argument(
        "longitude", type=float, required=True, help="longitude missing"
    )

    def get(self):
        data = self.parser.parse_args()
        latitude_min = data['latitude']-2
        latitude_max = data['latitude']+2

        longitude_min =data['longitude']-2
        longitude_max =data['longitude']+2

        location = FireModel.find_by_location(
            latitude_min=latitude_min,
            latitude_max=latitude_max,
            longitude_min=longitude_min,
            longitude_max=longitude_max
            )
        if location:
            is_lit = location.bright_ti4>200
            return {
                "is_lit": str(is_lit)
            }, 200
        return {
            "message":"non found"
        },404

class Shelters(Resource):
    def get(self):
        return {
            "test": "test"
        }, 200



# def fetchDB():
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
#             latitude= float(fires['latitude']),
#             longitude= float(fires['longitude']),
#             bright_ti4 = float(fires['bright_ti4']),
#             scan = float(fires['scan']),
#             track = float(fires['track']),
#             acq_datetime = fires['acq_date']+fires['acq_time'],
#             satellite = fires['satellite'],
#             confidence = fires['confidence'],
#             version = fires['version'],
#             bright_ti5 = float(fires['bright_ti5']),
#             frp= float(fires['frp']),
#             daynight = fires['daynight'],
#         )
#         f.save_to_db()

