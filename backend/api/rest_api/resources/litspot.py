from flask_restful import Resource
from flask import request

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
