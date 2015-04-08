__author__ = 'jcranwellward'

from rest_framework_mongoengine.serializers import MongoEngineModelSerializer

from .models import Fact


class FactSerializer(MongoEngineModelSerializer):

    class Meta:
        model = Fact