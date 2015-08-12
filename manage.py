#!/usr/bin/python
# -*- coding: utf-8 -*-
__author__ = 'jcranwellward'

import logging
import os, re
import random
import datetime
import requests
import json

from flask.ext.script import (
    Manager,
    Server
)

from pymongo import MongoClient
from activtyinfo_client import ActivityInfoClient
from cartodb import CartoDBAPIKey, CartoDBException

from spongemap import app, Report, Attribute

manager = Manager(app)

ai = MongoClient(
    os.environ.get('MONGODB_URL', 'mongodb://localhost:27017'))['ai-aggregator']


def send_message(message):
    requests.post(
        os.environ.get('SLACK_WEBHOOK'),
        data=json.dumps({'text': message})
    )


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
def update_sites(
        api_key='',
        domain='',
        username='',
        password='',
        list_name='',
        site_type='',
        name_col='',
        code_col='',
        target_list=''
):
    carto_client = CartoDBAPIKey(api_key, domain)

    ai_client = ActivityInfoClient(username, password)

    # create an index of sites by p_code
    existing = dict(
        (site['code'], dict(site, index=i))
        for (i, site) in enumerate(
            ai_client.get_locations(target_list)
        ) if 'code' in site
    )

    sites = carto_client.sql(
        'select * from {}'.format(list_name)
    )
    send_message('Starting upload of {}'.format(list_name))
    bad_codes = []
    updated_sites = 0
    for row in sites['rows']:
        p_code = str(row[code_col]).strip()
        site_name = row[name_col].encode('UTF-8')
        cad = ai['Cadastral Area'].find_one({'code': str(row['cad_code'])})
        if cad is None:
            bad_codes.append(row['cad_code'])
            continue
        caz = ai['Caza'].find_one({'id': cad['parentId']})
        gov = ai['Governorate'].find_one({'id': caz['parentId']})

        if p_code not in existing and site_name:

            payload = dict(
                id=int(random.getrandbits(31)),
                locationTypeId=int(target_list),
                name='{}: {}'.format(site_type, site_name)[0:40],
                axe='{}'.format(p_code),
                latitude=row['latitude'],
                longitude=row['longitude'],
                workflowstatusid='validated'
            )
            payload['E{}'.format(gov['levelId'])] = gov['id']
            payload['E{}'.format(caz['levelId'])] = caz['id']
            payload['E{}'.format(cad['levelId'])] = cad['id']

            response = ai_client.call_command('CreateLocation', **payload)
            if response.status_code == requests.codes.no_content:
                updated_sites += 1
                print 'Updated {}'.format(payload['name'])
            else:
                print 'Error for {}'.format(payload['name'])

    print 'Bad codes: {}'.format(bad_codes)
    print 'Updated sites: {}'.format(updated_sites)
    send_message('Updated {} sites'.format(updated_sites))


@manager.command
def update_ai_locations(type_id, username='', password=''):
    client = ActivityInfoClient(username, password)

    updated_location = 0
    for location in ai.locations.find({'ai_name': {'$regex': 'PG'}}):

        payload = {
            'id': int(random.getrandbits(31)),
            'locationTypeId': type_id,
            'name': location['ai_name'],
            'axe': '{}'.format(location['p_code']),
            'latitude': location['latitude'],
            'longitude': location['longitude'],
            'workflowstatusid': 'validated'
        }
        for id, level in location['adminEntities'].items():
            payload['E{}'.format(id)] = level['id']

        response = client.call_command('CreateLocation', **payload)
        if response.status_code == requests.codes.ok:
            updated_location += 1
            print 'Uploaded {}'.format(location['ai_name'].encode('UTF-8'))
        else:
            print 'Error for: {}'.format(location['ai_name'].encode('UTF-8'))

    print updated_location


@manager.command
def import_ai(dbs, username='', password='', date=''):
    """
    Imports data from Activity Info
    """

    db_ids = dbs.split(',')
    client = ActivityInfoClient(username, password)

    for db_id in db_ids:
        reports_created = 0
        db_info = client.get_database(db_id)
        send_message('AI import started for database: {}'.format(db_info['name']))

        # 'store the whole database for future reference'
        db_info['_id'] = db_id
        ai.databases.update({'_id': db_id}, db_info, upsert=True)

        # 'split out all the attribute groups into a separate collection'
        attribs = ai.databases.aggregate([
            {'$project': {'groups': '$activities.attributeGroups'}},
            {'$unwind': '$groups'},
            {'$unwind': '$groups'},
            {'$group': {'_id': "$_id", 'groups': {'$push': '$groups'}}},
        ])
        for attrib in attribs['result'][0]['groups']:
            attrib['_id'] = attrib['id']
            ai.attributeGroups.update({'_id': attrib['id']}, attrib, upsert=True)

        # 'create an index of sites by id'
        sites = dict(
            (site['id'], dict(site, index=i))
            for (i, site) in enumerate(
                client.get_sites(database=db_id)
            )
        )

        # 'create an index of activities by id'
        activities = dict(
            (activity['id'], dict(activity, index=i))
            for (i, activity) in enumerate(
                ai.databases.aggregate([
                    {'$match': {'_id': db_id}},
                    {'$unwind': '$activities'},
                    {'$project': {
                        '_id': 0,
                        'id': '$activities.id',
                        'name': '$activities.name',
                        'category': '$activities.category',
                        'location': '$activities.locationType'
                    }},
                ])['result']
            )
        )

        # 'get all reports for these activities: {}'.format(activities.keys())
        if not date:  # if no date provided get for the current month
            date = datetime.date.today().strftime('%Y-%m')
        send_message('Pulling reports for date: {}'.format(date))

        forms = client.get_cube(activities.keys(), month=date)

        # 'processing {} forms'.format(len(forms))
        for indicator in forms:

            site = sites[indicator['key']['Site']['id']]
            attributes = []
            if 'attributes' in site:
                attributes = [
                    attr for attr in ai.attributeGroups.find(
                        {'attributes.id': {'$in': site['attributes']}},
                        {'name': 1, 'mandatory': 1, "attributes.$": 1}
                    )
                ]
            if indicator['sum']:
                report, created = Report.objects.get_or_create(
                    db_name=db_info['name'],
                    date='{}-{}'.format(
                        indicator['key']['Date']['year'],
                        indicator['key']['Date']['month'],
                    ),
                    site_id=site['id'],
                    activity_id=site['activity'],
                    partner_id=site['partner']['id'],
                    indicator_id=indicator['key']['Indicator']['id'],
                )
                activity = activities[report.activity_id]
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

                report.save()

        send_message('AI import finished, {} site reports created'.format(reports_created))


# Turn on debugger by default and reloader
manager.add_command("runserver", Server(
    use_debugger=True,
    use_reloader=True,
    host='0.0.0.0')
)

if __name__ == "__main__":
    manager.run()
