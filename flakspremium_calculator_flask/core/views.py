from flask import render_template

from flakspremium_calculator_flask import app


@app.route('/')
def home():
    return render_template('index.html')
