import requests
import json
from requests.auth import HTTPBasicAuth
from os import environ
import ast
import os
import StringIO
import datetime
import logging

# from pandas import DataFrame
from raven.contrib.flask import Sentry

from flask import g, session, request, url_for, flash
from flask import redirect, render_template, jsonify
from flask_oauthlib.client import OAuth
from flask import Flask
from flask import redirect
from flask import request
from flask import send_file
from flask import url_for
from flask_mongoengine import MongoEngine
from flask_mongoengine.json import MongoEngineJSONEncoder
from flask_admin.contrib.mongoengine import ModelView
from flask_admin import expose, helpers
from flask_admin.actions import action
from flask_admin.babel import gettext
from flask_admin.contrib.mongoengine.filters import BaseMongoEngineFilter

from flask_mongorest import MongoRest
from flask_mongorest.authentication import AuthenticationBase
from flask_mongorest.views import ResourceView
from flask_mongorest.resources import Resource
from flask_mongorest import operators as ops
from flask_mongorest import methods

import flask_admin as admin
import flask_login as login
from flask_login import AnonymousUserMixin

from bson import ObjectId
from wtforms import form, fields, validators
from werkzeug.security import generate_password_hash, check_password_hash


class JSONEncoder(MongoEngineJSONEncoder):

    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super(MongoEngineJSONEncoder, self).default(self, o)


def get_db(app):
# Create models
    db = MongoEngine()
    db.init_app(app)
    login_manager.init_app(app)
    app.json_encoder = JSONEncoder

    return db

# Create application
app = Flask(__name__)
login_manager = login.LoginManager()

app.config['DEBUG'] = True

# Create dummy secrey key so we can use sessions
app.config['SECRET_KEY'] = '123456790'
app.config['MONGODB_SETTINGS'] = {
    'db': 'ai-aggregator',
    'host': os.environ.get('MONGODB_URL', 'mongodb://localhost:27017/ai-aggregator'),
}
app.config.update(
    CELERY_BROKER_URL=os.environ.get('REDIS_URL', 'redis://localhost:6379/0'),
    CELERY_RESULT_BACKEND=os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
)

db = get_db(app)


# Create user loader function
@login_manager.user_loader
def load_user(user_id):
    try:
        User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUserMixin()


# Create user model.
class User(db.Document):
    id = db.IntField()
    first_name = db.StringField()
    last_name = db.StringField()
    username = db.StringField()
    email = db.StringField()
    password = db.StringField()
    is_admin = db.BooleanField()
    is_activated = db.BooleanField()

    # Flask-Login integration
    def is_authenticated(self):
        return True

    def is_active(self):
        return self.is_activated

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id

    # Required for administrative interface
    def __unicode__(self):
        return self.username


# Define login and registration forms (for flask-login)
class LoginForm(form.Form):
    username = fields.TextField(validators=[validators.required()])
    password = fields.PasswordField(validators=[validators.required()])

    def validate_username(self, field):
        user = self.get_user()

        if user is None:
            raise validators.ValidationError('Invalid user')

        # we're comparing the plaintext pw with the the hash from the db
        if not check_password_hash(user.password, self.password.data):
        # to compare plain text passwords use
        # if user.password != self.password.data:
            raise validators.ValidationError('Invalid password')

    def get_user(self):
        return User.objects.filter(username=self.username.data).first()


class RegistrationForm(form.Form):
    username = fields.TextField(validators=[validators.required()])
    email = fields.TextField()
    password = fields.PasswordField(validators=[validators.required()])

    def validate_username(self, field):
        if User.objects.filter(username=self.username.data).count() > 0:
            raise validators.ValidationError('Duplicate username')


# Create customized index view class that handles login & registration
class MyAdminIndexView(admin.AdminIndexView):

    @expose('/')
    def index(self):
        if not login.current_user.is_authenticated():
            return redirect(url_for('.login_view'))
        return super(MyAdminIndexView, self).index()

    @expose('/login/', methods=('GET', 'POST'))
    def login_view(self):
        # handle user login
        form = LoginForm(request.form)
        if helpers.validate_form_on_submit(form):
            user = form.get_user()
            login.login_user(user)

        if login.current_user.is_authenticated():
            return redirect(url_for('.index'))
        link = '<p>Don\'t have an account? <a href="' + url_for('.register_view') + '">Click here to register.</a></p>'
        self._template_args['form'] = form
        self._template_args['link'] = link
        return super(MyAdminIndexView, self).index()

    @expose('/register/', methods=('GET', 'POST'))
    def register_view(self):
        form = RegistrationForm(request.form)
        if helpers.validate_form_on_submit(form):
            user = User()

            form.populate_obj(user)
            # we hash the users password to avoid saving it as plaintext in the db,
            # remove to use plain text:
            user.password = generate_password_hash(form.password.data)

            user.save()

            login.login_user(user)
            return redirect(url_for('.index'))
        link = '<p>Already have an account? <a href="' + url_for('.login_view') + '">Click here to log in.</a></p>'
        self._template_args['form'] = form
        self._template_args['link'] = link
        return super(MyAdminIndexView, self).index()

    @expose('/logout/')
    def logout_view(self):
        login.logout_user()
        return redirect(url_for('.index'))


# Define mongoengine documents
class CartoDbTable(db.Document):
    api_key = db.StringField()
    domain = db.StringField()
    table_name = db.StringField()
    site_type = db.StringField()
    name_col = db.StringField()
    code_col = db.StringField()
    target_list = db.StringField()


class Attribute(db.EmbeddedDocument):
    name = db.StringField()
    value = db.StringField()


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


class FilterByAttribute(BaseMongoEngineFilter):
    def apply(self, query, value):
        flt = {
            '__raw__':
                {'attributes':
                     {'$elemMatch': {self.column: value}}}}
        return query.filter(**flt)

    def operation(self):
        return gettext('value')


# Customized admin views
class AdminView(ModelView):

    def is_accessible(self):
        if login.current_user.is_authenticated():
            if login.current_user.is_admin:
                return True
        return False


class CartoDBTableView(AdminView):

    @action('update_ai', 'Update ActivityInfo')
    def update_locations(self, ids):
        from tasks import run_sites_update
        for id in ids:
            table = CartoDbTable.objects.get(id=id)
            run_sites_update.delay(
                table.api_key,
                table.domain,
                table.table_name,
                table.site_type,
                table.name_col,
                table.code_col,
                table.target_list
            )


class ReportView(ModelView):
    can_create = False
    can_delete = False
    can_edit = False
    list_template = 'list.html'
    page_size = 50

    column_filters = [
        'db_name',
        'date',
        'p_code',
        'category',
        'activity',
        'partner_name',
        'location_name',
        'indicator_name',
        'comments',
        'gov_code',
        'governorate',
        'district_code',
        'district',
        'cadastral_code',
        'cadastral',
        FilterByAttribute(
            'value',
            'RRP6 result',
            options=(
                ('Yes', u'Yes'),
                ('No', u'No'),
            ),
        ),
        FilterByAttribute(
            'value',
            'Funded by',
            options=(
                ('UNICEF', u'UNICEF'),
                ('UNHCR', u'UNHCR'),
                ('UNRWA', u'UNRWA'),
                ('UNHCR', u'UNHCR'),
                ('Independent', u'Independent'),
            ),
        ),
        FilterByAttribute(
            'value',
            'Location type',
            options=(
                ('Palestinian Camp', u'Palestinian Camp'),
                ('School', u'School'),
                ('ITS', u'ITS'),
                ('Other', u'Other'),
                ('Distribution Site', u'Distribution Site'),
            ),
        ),
    ]
    column_list = [
        'db_name',
        'date',
        'category',
        'activity',
        'partner_name',
        'location_name',
        'p_code',
        'indicator_name',
        'value',
        'comments',
    ]

    column_searchable_list = [
        'db_name',
        'date',
        'p_code',
        'category',
        'activity',
        'partner_name',
        'location_name',
        'indicator_name',
        'comments',
        'gov_code',
        'governorate',
        'district_code',
        'district',
        'cadastral_code',
        'cadastral'
    ]

    form_subdocuments = {
        'attributes': {
            'form_subdocuments': {
                None: {
                    'form_columns': ('name', 'value',)
                }
            }

        }
    }

    @expose('/export')
    def export(self):
        # Grab parameters from URL
        args = self._get_list_extra_args()
        page, sort_idx, sort_desc, search, filters = \
            args.page, args.sort, args.sort_desc, args.search, args.filters
        sort_column = self._get_column_by_idx(sort_idx)
        if sort_column is not None:
            sort_column = sort_column[0]

        # Get count and data
        self.page_size = request.args.get('count', 0, type=int)
        count, data = self.get_list(
            None,
            sort_column,
            sort_desc,
            search,
            filters
        )

        dicts = []
        for report in data:
            dict = report.to_mongo().to_dict()
            del dict['_id']
            del dict['attributes']
            for attr in report.attributes:
                dict[attr.name] = attr.value
            dicts.append(dict)
        df = DataFrame.from_records(dicts)

        buffer = StringIO.StringIO()  # use stringio for temp file
        df.to_csv(buffer, encoding='utf-8')
        buffer.seek(0)

        filename = "ai_reports_" + datetime.datetime.now().strftime("%Y_%m_%d_%H_%M") + ".csv"
        return send_file(
            buffer,
            attachment_filename=filename,
            as_attachment=True,
            mimetype='text/csv'
        )

    # def is_accessible(self):
    #     if login.current_user.is_authenticated():
    #         if login.current_user.is_activated:
    #             return True
    #     return False


# Create admin
admin = admin.Admin(app, 'ActivityInfo Reports', index_view=MyAdminIndexView(), base_template='my_master.html')

# Add views
admin.add_view(ReportView(Report))
admin.add_view(AdminView(User))
admin.add_view(CartoDBTableView(CartoDbTable))

# Add API
api = MongoRest(app)


class AttributeResource(Resource):
    document = Attribute


class NeNone(ops.Ne):
    def apply(self, queryset, field, value, negate=False):
        # convert nulls to python None
        if value == u'null':
            value = None
        return super(NeNone, self).apply(queryset, field, value)


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

    # def get_objects(self, all=False, qs=None, qfilter=None):
    #     return super(ReportResource, self).get_objects(
    #         all=True, qs=qs, qfilter=qfilter
    #     )


@api.register(name='reports', url='/reports/')
class ReportsView(ResourceView):
    resource = ReportResource
    methods = [methods.List]


oauth = OAuth()

twitter = oauth.remote_app(
    'twitter',
    base_url='https://api.twitter.com/1.1/',
    request_token_url='https://api.twitter.com/oauth/request_token',
    access_token_url='https://api.twitter.com/oauth/access_token',
    authorize_url='https://api.twitter.com/oauth/authorize',
    consumer_key=environ.get('TWITTER_CONSUMER_KEY', 'somekey'),
    consumer_secret=environ.get('TWITTER_CONSUMER_SECRET', 'somesecret'),
    access_token_method='GET'
)

@app.route('/tweets')
def tweets():
    tweets = None
    bearerToken = requests.post("https://api.twitter.com/oauth2/token",
                auth=HTTPBasicAuth(environ.get('TWITTER_CONSUMER_KEY', ''),
                                     environ.get('TWITTER_CONSUMER_SECRET', '')),
                data={"grant_type":"client_credentials"})
    access_token = json.loads(bearerToken.content)["access_token"]

    q = request.args.get('q')
    resp = requests.get("https://api.twitter.com/1.1/search/tweets.json?q=" + q,
                        headers={'Authorization': 'Bearer ' + access_token})
    if resp.status_code == 200:
        tweets = resp.json()
    else:
        flash('Unable to load tweets from Twitter.')
    return jsonify(tweets)

# below code is used for Oauth user authentication, not needed at the moment
@twitter.tokengetter
def get_twitter_token(token=None):
        return session.get('twitter_oauth')

@app.route('/')
def index():
    return render_template('spongemap.html')

@app.route('/login')
def login():
    callback_url = url_for('oauthorized', next=request.args.get('next'))
    return twitter.authorize(callback=callback_url or request.referrer or None)

@app.route('/oauthorized')
def oauthorized():
    resp = twitter.authorized_response()
    if resp is None:
        flash('You denied the request to sign in.')
    else:
        session['twitter_oauth'] = resp
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run()
