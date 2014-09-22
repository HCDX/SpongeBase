from mongoengine import BooleanField
from mongoengine import DateTimeField
from mongoengine import Document
from mongoengine import EmbeddedDocument
from mongoengine import EmbeddedDocumentField
from mongoengine import ListField
from mongoengine import ReferenceField
from mongoengine import StringField
from mongoengine import IntField
from mongoengine import ObjectIdField


class Fact(Document):

    date = DateTimeField()
    code = StringField(max_length=254)
    description = StringField(max_length=254)
    value = StringField(max_length=254)
    category = StringField(max_length=254)
    source = StringField(max_length=254)
    created_on = DateTimeField()
