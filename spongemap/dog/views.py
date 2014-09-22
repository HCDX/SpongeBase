from rest_framework.generics import ListAPIView

from .models import Fact
from .serializers import FactSerializer


class FactsView(ListAPIView):

    serializer_class = FactSerializer

    def get_queryset(self):

        code = self.request.QUERY_PARAMS.get('code', None)
        return Fact.objects.filter(code=code)

