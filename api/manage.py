#!/usr/bin/python
# -*- coding: utf-8 -*-
__author__ = 'jcranwellward'

import logging
import os, re
import random
import datetime
import requests
import json

from flask_script import (
    Manager,
    Server
)

from requests.auth import HTTPBasicAuth

from pymongo import MongoClient
from activityinfo_client import ActivityInfoClient
from cartodb import CartoDBAPIKey, CartoDBException

from spongemap import app, Report, Attribute

manager = Manager(app)


# db = MongoClient(
#     os.environ.get('MONGODB_URL', 'mongodb://localhost:27017'))['ai-aggregator']

## FIXME - what if the host is remote??
mongo_client = MongoClient(os.environ['DB_PORT_27017_TCP_ADDR'], 27017)
ai = mongo_client['ai-aggregator']


def send_message(message):
    logging.info('[MESSAGE] :%s', message)
    # requests.post(
    #     os.environ.get('SLACK_WEBHOOK'),
    #     data=json.dumps({'text': message})
    # )


@manager.command
def update_levels(country_code='LB'):
    """
    Updates local admin level lookup tables from AI.
    These lookup tables are used when creating sites for AI.
    """

    client = ActivityInfoClient()

    for level in client.get_admin_levels(country_code):
        entities = client.get_entities(level['id'])
        for entity in entities:
            ai[level['name']].update(
                {'_id': entity['id']}, entity, upsert=True)
            print 'Updated entity {}: {}'.format(
                level['name'], entity['name'].encode('UTF-8')
            )

    for site_type in client.get_location_types(country_code):
        locations = client.get_locations(site_type['id'])
        for location in locations:
            ai.locations.update(
                {'_id': location['id']}, location, upsert=True)
            print 'Updated {}: {}'.format(
                site_type['name'].encode('UTF-8'), location['name'].encode('UTF-8')
            )

@manager.command
# def import_ai(dbs, username='', password='', date=''):
def import_ai(dbs, username='', password=''):
    """
    Imports data from Activity Info
    """

    # FIXME - dont hardcode this -- check out activity info wrapper
    # for info on how the date is handled
    date = '2017-10'

    db_ids = dbs.split(',')
    client = ActivityInfoClient(username, password)

    for db_id in db_ids:
        reports_created = 0
        db_info = client.get_database(db_id)

        send_message('AI import started for database: {}'.format(db_info['name']))

        # 'store the whole database for future reference'
        db_info['_id'] = db_id
        ai[db_id].update({'_id': db_id}, db_info, upsert=True)

        # 'split out all the attribute groups into a separate collection'
        attribs = ai[db_id].aggregate([
            {'$project': {'groups': '$activities.attributeGroups'}},
            {'$unwind': '$groups'},
            {'$unwind': '$groups'},
            {'$group': {'_id': "$_id", 'groups': {'$push': '$groups'}}},
        ])

        for attr_row in attribs: # ['result'][0]['groups']:
            attribs = attr_row.get('groups')

            if len(attribs) == 0:
                continue

            ## not sure why / if i need two loops here
            for attrib in attribs:
                attrib['_id'] = attrib['id']
                ai.attributeGroups.update({'_id': attrib['id']}, attrib, upsert=True)

        try:
            ai_client_sites = client.get_sites(database=db_id)
        except Exception:
            continue

        # 'create an index of sites by id'
        sites = dict(
            (site['id'], dict(site, index=i))
            for (i, site) in enumerate(ai_client_sites)
        )

        # 'create an index of activities by id'
        activities = dict(
            (activity['id'], dict(activity, index=i))
            for (i, activity) in enumerate(
                ai[db_id].aggregate([
                    {'$match': {'_id': db_id}},
                    {'$unwind': '$activities'},
                    {'$project': {
                        '_id': 0,
                        'id': '$activities.id',
                        'name': '$activities.name',
                        'category': '$activities.category',
                        'location': '$activities.locationType'
                    }},
                ])
            )
        )

        # 'get all reports for these activities: {}'.format(activities.keys())
        if not date:  # if no date provided get for the current month
            date = datetime.date.today().strftime('%Y-%m')
        send_message('Pulling reports for date: {}'.format(date))

        form_request_string = get_cube(activities.keys(), month=date)
        response = requests.get(
            'https://www.activityinfo.org/' +  form_request_string,
            params={},
            auth=HTTPBasicAuth(os.getenv('AI_USERNAME'), os.getenv('AI_PASSWORD')),
        )
        try:
            forms = response.json()
        except Exception:
            continue

        for indicator in forms:

            ## need help looking at validity of the data / logic..
            ## i see this in the "sites" dict, so using for now
            indicator_id = indicator['key']['Site']['id']
            site = sites.get(indicator_id)

            if not site:
                print '==-=-= no site =-=-=-='
                continue

            attributes = []
            if 'attributes' in site:
                attributes = [
                    attr for attr in ai.attributeGroups.find(
                        {'attributes.id': {'$in': site['attributes']}},
                        {'name': 1, 'mandatory': 1, "attributes.$": 1}
                    )
                ]

            if indicator['sum']:

                date_info = indicator.get('key', {}).get('DateDimension.MONTH')
                year, month = date_info.get('year'), date_info.get('month')

                created = False

                report_data = {
                    'db_name':db_info['name'],
                    'date':'{year}-{month}'.format(year=year, month=month),
                    'site_id':site['id'],
                    'activity_id':site['activity'],
                    'partner_id':site['partner']['id'],
                    'indicator_id':indicator['key']['Indicator']['id'],
                }

                try:
                    report = Report.objects.get(**report_data)
                    # http://docs.mongoengine.org/guide/querying.html#retrieving-unique-results
                except Report.DoesNotExist:
                    report = Report.objects.create(**report_data)
                    created = True

                report.save()

                try:
                    activity = activities[report.activity_id]
                except Exception as er:
                    print 'activity exception'
                    print err
                    continue

                report.value = indicator['sum']
                report.category = activity['category']
                report.activity = activity['name']
                report.partner_name = site['partner']['name']
                report.p_code = site['location']['code']
                report.location_name = site['location']['name']
                report.location_id = site['location']['id']
                report.location_x = site['location'].get('longitude', None)
                report.location_y = site['location'].get('latitude', None)
                report.indicator_name = indicator['key']['Indicator']['label']
                report.comments = site.get('comments', None)

                location = ai.locations.find_one({'id': report.location_id})
                if location and 'adminEntities' in location:
                    try:
                        report.gov_code = str(location['adminEntities']['1370']['id'])
                        report.governorate = location['adminEntities']['1370']['name']
                        report.district_code = str(location['adminEntities']['1521']['id'])
                        report.district = location['adminEntities']['1521']['name']
                        report.cadastral_code = str(location['adminEntities']['1522']['id'])
                        report.cadastral = location['adminEntities']['1522']['name']
                    except Exception as exp:
                        pass
                if created:
                    for a in attributes:
                        report.attributes.append(
                            Attribute(
                                name=a['name'],
                                value=a['attributes'][0]['name']
                            )
                        )
                    reports_created += 1

                print '=save report at bottom='
                report.save()

        send_message('AI import finished, {} site reports created'.format(reports_created))


# https://github.com/HCDX/ActivityInfoPython/blob/master/activityinfo_client.py#L102
def get_cube(form_ids, month=None):
    return (
        'resources/sites/cube?'
        'dimension=indicator'
        '&dimension=site'
        '&dimension=month'
        '{}'
        '&form={}'.format(
            '&month='+month if month is not None else '',
            '&form='.join([str(id) for id in form_ids])
        ))


# Turn on debugger by default and reloader
manager.add_command("runserver", Server(
    use_debugger=True,
    use_reloader=True,
    host='0.0.0.0')
)

if __name__ == "__main__":
    manager.run()
