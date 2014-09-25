__author__ = 'jcranwellward'

import os
from datetime import datetime
from django.core.management.base import BaseCommand, CommandError

from pymongo import MongoClient

from dog.models import Fact


class Command(BaseCommand):
    help = 'Import sites from ActivityInfo'

    def handle(self, *args, **options):

        ai = MongoClient(
            os.environ.get('AI_MONGO_URL', 'mongodb://localhost:27017'))[
            os.environ.get('AI_MONGODB_DATABASE', 'ai')]

        for report in ai.report.find({'p_code': {'$ne': None}}):
            fact, created = Fact.objects.get_or_create(source_id=str(report['_id']))
            fact.source = 'ActivityInfo: {}'.format(report['partner_name'])
            fact.date = datetime.strptime(report['date'], '%Y-%m')
            fact.code = report['p_code']
            fact.description = report['indicator_name']
            fact.value = str(report['value'])
            fact.category = report['activity']
            fact.created_on = datetime.now()

            fact.save()

            if created:
                print 'Created fact: {} -> {} -> {} -> {} = {}'.format(
                    fact.date,
                    fact.source,
                    fact.category.encode('utf-8'),
                    fact.description.encode('utf-8'),
                    fact.value
                )

