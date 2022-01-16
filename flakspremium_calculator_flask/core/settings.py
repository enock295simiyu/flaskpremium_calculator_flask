import os

from flask_sqlalchemy import SQLAlchemy

from flakspremium_calculator_flask import app

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///premium_calculator_database.sqlite3'
db = SQLAlchemy(app)
SECRET_KEY = os.urandom(32)
app.config['SECRET_KEY'] = SECRET_KEY

def return_db():
    return db


