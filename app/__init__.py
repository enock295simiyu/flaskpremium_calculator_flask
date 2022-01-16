from flask import Flask


app = Flask(__name__)

from app.accounts import views
from app.core import views
