import os
from flask import Flask, redirect, url_for, request, render_template
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient(
    os.environ['DB_PORT_27017_TCP_ADDR'],
    27017)
db = client.tododb


## todo list .. ##
@app.route('/')
def index():

    some_var = os.getenv('X')
    print ' SPOME VAR: ' + some_var 

    return render_template('spongemap.html')

#############################################
#### BOILER PLATE STUFF TO BE REMOVED .. ####
#############################################

## todo list .. ##
@app.route('/todo')
def todo():

    _items = db.tododb.find()
    items = [item for item in _items]

    return render_template('todo.html', items=items)


@app.route('/new', methods=['POST'])
def new():

    item_doc = {
        'name': request.form['name'],
        'description': request.form['description']
    }
    db.tododb.insert_one(item_doc)

    return redirect(url_for('todo'))

## end todo list .. ##

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
