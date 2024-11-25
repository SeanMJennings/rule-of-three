import datetime
from datetime import timedelta

the_datetime = datetime.datetime.now()
the_updated_datetime = datetime.datetime.now() + timedelta(days=1)


class OldDateTimeNow(datetime.datetime):
    @classmethod
    def now(cls):
        return the_datetime


class NewDateTimeNow(datetime.datetime):
    @classmethod
    def now(cls):
        return the_updated_datetime
