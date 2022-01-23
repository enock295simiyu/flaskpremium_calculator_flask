import os

from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from app import app
from config import SQLALCHEMY_DATABASE_URI

app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
db = SQLAlchemy(app)
migrate = Migrate(app, db)
SECRET_KEY = os.urandom(32)
app.config['SECRET_KEY'] = SECRET_KEY


def return_db():
    return db
