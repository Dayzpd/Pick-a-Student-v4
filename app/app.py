from app.blueprints import app_blueprints
from flask import Flask
from importlib import import_module
import os


def get_app():
    # Create Flask App
    app = Flask(__name__)
    app.template_folder = app.root_path + '/templates'
    app.static_folder = app.root_path + '/static'

    # Flask Config
    app.url_map.strict_slashes = False
    app.add_url_rule(
        '/favicon.ico',
        'favicon',
        lambda: app.send_static_file('favicon.ico')
    )

    # Import Blueprints
    for blue in app_blueprints:
        import_module(blue.import_name)
        app.register_blueprint(blue)

    return app
