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
    code = StringField()
    description = StringField()
    value = StringField()
    category = StringField()
    source = StringField()
    source_id = StringField()
    created_on = DateTimeField()
