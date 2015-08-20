__author__ = 'jcranwellward'

import os

from celery import Celery
from celery.schedules import crontab

from manage import app, import_ai, update_sites


CELERYBEAT_SCHEDULE = {
    # Executes import every 4 hours
    'import-ai-everyday': {
        'task': 'tasks.run_import',
        'schedule': crontab(hour='*/4'),
    },
}


def make_celery(app):
    celery = Celery(app.import_name, broker=app.config['CELERY_BROKER_URL'])
    celery.conf.update(app.config)
    celery.conf.CELERYBEAT_SCHEDULE = CELERYBEAT_SCHEDULE
    TaskBase = celery.Task
    class ContextTask(TaskBase):
        abstract = True
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)
    celery.Task = ContextTask
    return celery


celery = make_celery(app)


@celery.task
def run_import():

    dbs = os.environ.get('AI_DBS')
    username = os.environ.get('AI_USERNAME')
    password = os.environ.get('AI_PASSWORD')
    if dbs:
        import_ai(dbs, username, password)


@celery.task
def run_sites_update(
        api_key,
        domain,
        table_name,
        site_type,
        name_col,
        code_col,
        target_list):

    update_sites(api_key=api_key,
                 domain=domain,
                 list_name=table_name,
                 site_type=site_type,
                 name_col=name_col,
                 code_col=code_col,
                 target_list=target_list)