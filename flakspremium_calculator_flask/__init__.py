from flask import Flask


app = Flask(__name__)

from flakspremium_calculator_flask.accounts import views
from flakspremium_calculator_flask.core import views
