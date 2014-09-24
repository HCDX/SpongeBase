__author__ = 'jcranwellward'

import requests
from datetime import datetime
from django.core.management.base import BaseCommand, CommandError

from dog.models import Fact


class Command(BaseCommand):
    help = 'Import sites from ActivityInfo'

    def handle(self, *args, **options):

        try:

            url = 'http://ai-aggregator.apps.uniceflebanon.org/reports/?p_code__ne=null'
            response = requests.get(url)
            data = response.json()

            for report in data['data']:
                fact, created = Fact.objects.get_or_create(id=report['id'])
                fact.source='ActivityInfo: {}'.format(report['partner_name'])
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
                        fact.category,
                        fact.description,
                        fact.value
                    )

        except Exception as exp:
            raise CommandError(exp)

