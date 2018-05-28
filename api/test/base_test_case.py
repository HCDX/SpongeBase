import os
import unittest

import logging

class BaseTest(unittest.TestCase):

    def setUp(self):

        logging.info('start test')


    def tearDown(self):

        logging.info('end test')
