import json
from mock import patch

from base_test_case import BaseTest
from manage import import_ai


from pprint import pprint

class IngestTest(BaseTest):

    #  bin/test_local test.test_ingest
    def test_1_plus_2(self):
        actual = 1 + 1
        target = 2
        self.assertEqual(actual, target)

    def test_ai_ingest(self):

        with open('test/fixtures/ai_stub.json') as fixt:
            ai_fixt = json.load(fixt)

        with patch('activityinfo_client.ActivityInfoClient.get_database') as fake_ai:
            fake_ai.return_value = ai_fixt

            x = import_ai('6354')


        self.assertEqual(1,x)
