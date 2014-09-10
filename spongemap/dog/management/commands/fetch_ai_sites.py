__author__ = 'jcranwellward'

import re
from optparse import make_option
from django.core.management.base import BaseCommand, CommandError

from pymongo import MongoClient
from activtyinfo_client import ActivityInfoClient

#from dog.models import Location, Fact


class Command(BaseCommand):
    args = 'AI Database ID'
    help = 'Import sites from ActivityInfo'

    def handle(self, *args, **options):

        try:
            pass
        except Exception as exp:
            raise CommandError(exp)

