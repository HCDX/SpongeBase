__author__ = 'jcranwellward'

import os
from datetime import datetime
from django.core.management.base import BaseCommand, CommandError

from pymongo import MongoClient

from dog.models import Fact, Location


class Command(BaseCommand):
    help = 'Import sites from ActivityInfo'

    def handle(self, *args, **options):

        try:

            ai = MongoClient(
                os.environ.get('AI_MONGO_URL', 'mongodb://localhost:27017'))[
                os.environ.get('AI_MONGODB_DATABASE', 'ai')]

            for report in ai.report.find({'p_code': {'$ne': None}}):
                location, created = Location.objects.get_or_create(
                    code=report['p_code']
                )
                fact = Fact(
                    date=datetime.strptime(report['date'], '%Y-%m'),
                    description=report['indicator_name'],
                    value=report['value'],
                    category=report['activity'],
                    source='ActivityInfo',
                    location=location
                )

        except Exception as exp:
            raise CommandError(exp)

