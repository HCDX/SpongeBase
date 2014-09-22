from rest_framework.generics import ListAPIView

from .models import Fact
from .serializers import FactSerializer


class FactsView(ListAPIView):

    serializer_class = FactSerializer

    def get_queryset(self):
        return Fact.objects.all()

