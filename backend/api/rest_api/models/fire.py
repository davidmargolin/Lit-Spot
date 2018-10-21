from rest_api import db
from datetime import datetime

class FireModel(db.Model):
    __tablename__="firms"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    bright_ti4 = db.Column(db.Float)
    scan = db.Column(db.Float)
    track = db.Column(db.Float)
    acq_datetime = db.Column(db.String)
    satellite = db.Column(db.String)
    confidence = db.Column(db.String)
    version = db.Column(db.String)
    bright_ti5 = db.Column(db.Float)
    frp = db.Column(db.Float)
    daynight = db.Column(db.String)

    def __init__(
        self,
        latitude,
        longitude,
        bright_ti4,
        scan,
        track,
        acq_datetime,
        satellite,
        confidence,
        version,
        bright_ti5,
        frp,
        daynight
        ):
        self.latitude = latitude
        self.longitude = longitude
        self.bright_ti4 = bright_ti4
        self.scan= scan
        self.track = track
        self.acq_datetime = acq_datetime
        self.satellite = satellite
        self.confidence = confidence
        self.version = version
        self.bright_ti5 = bright_ti5
        self.frp=frp
        self.daynight = daynight

    # find a list of locations for the given position
    @classmethod
    def find_by_location(cls, latitude, longitude):
        pass

    @classmethod
    def find_by_datetime(cls, datetime):
        pass

    def json(self):
        return {
            "latitude": self.latitude,
            "longitude": self.longitude,
            "bright_ti4": self.bright_ti4,
            "scan":self.scan,
            "track":self.track,
            "acq_datetime":self.acq_datetime,
            "satellite":self.satellite,
            "confidence":self.confidence,
            "version":self.version,
            "bright_ti5":self.bright_ti5,
            "frp":self.frp,
            "daynight":self.daynight
        }

    def save_to_db (self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def delete_all(cls):
        cls.query.delete()

    @classmethod
    def find_all(cls):
        return cls.query.all()