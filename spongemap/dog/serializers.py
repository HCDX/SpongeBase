__author__ = 'jcranwellward'

from rest_framework_mongoengine.serializers import DocumentSerializer

from .models import Fact


class FactSerializer(DocumentSerializer):

    class Meta:
        model = Fact