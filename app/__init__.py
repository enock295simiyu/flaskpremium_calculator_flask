from flask import Flask


# def create_app():
#     app = Flask(__name__)
#
#     app.secret_key = SECRET_KEY
#     app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
#     app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
#
#     login_manager.init_app(app)
#     db.init_app(app)
#     migrate.init_app(app, db)
#
#     return app
app = Flask(__name__)

from app.accounts import views
from app.core import views
