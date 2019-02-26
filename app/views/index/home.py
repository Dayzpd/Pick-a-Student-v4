from flask import render_template

from app.blueprints import index_home


@index_home.route('/', methods=['GET'])
def landing():
    return render_template('index_template.html')
