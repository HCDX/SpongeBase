import os
from flask import (
    Flask,
    render_template
)

# create our little application :)
app = Flask(__name__)
app.config.from_object(__name__)

# Load default config and override config from an environment variable
app.config.update(dict(
    DEBUG=True,
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default'
))
app.config.from_envvar('DOG_SETTINGS', silent=True)


@app.route('/')
def index():
    return render_template('spongemap.html')


if __name__ == '__main__':
    app.run()
