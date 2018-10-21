from flask_restful import Resource, reqparse
# from flask import request
import requests
import json
from rest_api.models.fire import FireModel

# from exponent_server_sdk import DeviceNotRegisteredError
from exponent_server_sdk import PushClient
from exponent_server_sdk import PushMessage
# from exponent_server_sdk import PushResponseError
# from exponent_server_sdk import PushServerError
# from requests.exceptions import ConnectionError
# from requests.exceptions import HTTPError
# import rollbar
# import celery


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
    # gets called when there is fire

    
    # Basic arguments. You should extend this function with the push features you
    # want to use, or simply pass in a `PushMessage` object.
   


    @staticmethod
    def validate_notify(latitude, longitude):
        def send_push_message(token, message, extra=None):
            PushClient().publish(
                PushMessage(to=token,
                            body=message,
                            data=extra))
        # retrieve list
        filesListURL = "https://litspot-cd4d5.firebaseio.com/users.json"
        data = requests.get(filesListURL, headers=None).json()
        
        lat_max = latitude + 10
        lat_min = latitude - 10
        lon_max = longitude + 10
        lon_min = longitude - 10
        dev_list =[]
        # validate location
        if data:
            for row in data:
                if (
                    float(row["latitude"]) <= lat_max and 
                    float(row["latitude"]) >= lat_min and
                    float(row["longitude"]) <= lon_max and 
                    float(row["longitude"]) >= lon_min
                ):
                    dev_list.append(row)
        # push to Exponent
        message = "there is a possible wild fire nearby!"
        
        for dev in dev_list:
            send_push_message(token=dev["deviceid"], message=message, extra=None)

        return len(data)

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
        is_lit =False
        # msg=0
        if location and location.bright_ti4>200:
            is_lit = True
            self.validate_notify(latitude=data['latitude'], longitude=data['longitude'])

        return {
            "is_lit": str(is_lit)
        }, 200

class DrillNYC(Resource):
    def get(self):
        f = FireModel(
        latitude= float(40.723655),
        longitude= float(-73.976540),
        bright_ti4 = float(700),
        scan = float(0.47),
        track = float(0.47),
        acq_datetime = "201810211212",
        satellite = "N",
        confidence = "nominal",
        version = "1.0NRT",
        bright_ti5 = float(700),
        frp= float(700),
        daynight = "N"
        )
        f.save_to_db()
        return {
            "message":"Drill Sent"
        },200

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

