from mongoengine import BooleanField
from mongoengine import DateTimeField
from mongoengine import Document
from mongoengine import EmbeddedDocument
from mongoengine import EmbeddedDocumentField
from mongoengine import ListField
from mongoengine import ReferenceField
from mongoengine import StringField
from mongoengine import IntField
from mongoengine import FloatField


class Fact(EmbeddedDocument):

    date = DateTimeField()
    description = StringField(max_length=254)
    value = StringField(max_length=254)
    category = StringField(max_length=254)
    source = StringField(max_length=254)


class Location(Document):

    name = StringField(max_length=254)
    type = StringField(max_length=254)
    code = StringField(unique=True, max_length=254)
    latitude = FloatField()
    longitude = FloatField()
    created_on = DateTimeField()
    facts = ListField(EmbeddedDocumentField(Fact))