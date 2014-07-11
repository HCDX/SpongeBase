__author__ = 'jcranwellward'

# Import the MongoAdmin base class
from mongonaut.sites import MongoAdmin

# Import your custom models
from .models import Location


class LocationAdmin(MongoAdmin):

    def has_view_permission(self, request):
        return True

    def has_edit_permission(self, request):
        return True

    def has_add_permission(self, request):
        return True

    def has_delete_permission(self, request):
        return True

    list_display = ('name',)


# Instantiate the MongoAdmin class
# Then attach the mongoadmin to your model
Location.mongoadmin = LocationAdmin()
