import os

from flask import Flask, redirect, url_for, request, render_template
from flask_mongorest import methods
from flask_mongorest.views import ResourceView
from flask_mongorest.resources import Resource
from pymongo import MongoClient
from flask_mongorest import MongoRest
from flask_mongorest import methods
from flask_mongorest import operators as ops

from spongemap import ReportResource

from flask_mongoengine import MongoEngine

# Create application
app = Flask(__name__)

app.config['DEBUG'] = True

# Create dummy secrey key so we can use sessions
app.config['SECRET_KEY'] = '123456790'
app.config['MONGODB_SETTINGS'] = {
    'db': 'ai-aggregator',
    'host': ['DB_PORT_27017_TCP_ADDR'],
    'port': 27017
}
db = MongoEngine()
api = MongoRest(app)

@app.route('/')
def index():
    return render_template('spongemap.html')


class Attribute(db.EmbeddedDocument):
    name = db.StringField()
    value = db.StringField()

class NeNone(ops.Ne):
    def apply(self, queryset, field, value, negate=False):
        # convert nulls to python None
        if value == u'null':
            value = None
        return super(NeNone, self).apply(queryset, field, value)


class AttributeResource(Resource):
    document = Attribute

class Report(db.Document):
    db_name = db.StringField()
    date = db.StringField()
    site_id = db.IntField()
    p_code = db.StringField()
    category = db.StringField()
    activity_id = db.IntField()
    activity = db.StringField()
    partner_id = db.IntField()
    partner_name = db.StringField()
    location_id = db.IntField()
    location_name = db.StringField()
    location_type = db.StringField()
    location_x = db.DecimalField()
    location_y = db.DecimalField()
    gov_code = db.StringField()
    governorate = db.StringField()
    district_code = db.StringField()
    district = db.StringField()
    cadastral_code = db.StringField()
    cadastral = db.StringField()
    indicator_id = db.IntField()
    indicator_category = db.StringField()
    indicator_name = db.StringField()
    value = db.DecimalField()
    units = db.StringField()
    comments = db.StringField()
    attributes = db.ListField(
        db.EmbeddedDocumentField(Attribute)
    )

    meta = {
        'indexes': [
            'date',
            'db_name',
            'p_code',
            'category',
            'activity',
            'partner_name',
            'location_name',
            'indicator_category',
            'indicator_name',
            'gov_code',
            'governorate',
            'district_code',
            'district',
            'cadastral_code',
            'cadastral'
        ]
    }


class ReportResource(Resource):
    paginate = False
    document = Report
    related_resources = {
        'attributes': AttributeResource,
    }
    filters = {
        'p_code': [NeNone, ops.Exact, ops.Startswith],
        'partner_name': [ops.Exact, ops.IStartswith, ops.IContains],
        'db_name': [ops.Exact, ops.IStartswith, ops.IContains],
        'date': [ops.Exact, ops.IStartswith, ops.IContains],
        'category': [ops.Exact, ops.IStartswith, ops.IContains],
        'activity': [ops.Exact, ops.IStartswith, ops.IContains],
        'location_name': [ops.Exact, ops.IStartswith, ops.IContains],
        'indicator_name': [ops.Exact, ops.IStartswith, ops.IContains],
        'governorate': [ops.Exact, ops.IStartswith, ops.IContains],
        'district': [ops.Exact, ops.IStartswith, ops.IContains],
        'cadastral': [ops.Exact, ops.IStartswith, ops.IContains],
        'cadastral_code': [ops.Exact, ops.IStartswith, ops.IContains],
    }


@api.register(name='reports', url='/reports/')
class ReportsView(ResourceView):
    resource = ReportResource
    methods = [methods.List]


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
