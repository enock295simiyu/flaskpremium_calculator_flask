import flask
from flask import url_for, render_template, request, flash
from flask_login import login_user, login_required, logout_user
from werkzeug.utils import redirect

from app import app
from app.accounts.accounts_handler import AccountsHandler
from app.accounts.forms import RegistrationForm, LoginForm


@app.route('/register', methods=['POST', 'GET'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user = AccountsHandler().register_user({'username': form.username.data,
                                                'email': form.email.data,
                                                'password1': form.password1.data,
                                                'first_name': form.first_name.data,
                                                'last_name': form.last_name.data,
                                                })

        return redirect(url_for('login'))
    return render_template('register.html', form=form)


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = AccountsHandler().get_user_by_email({'email': form.email.data})
        if user is not None and user.check_password(form.password.data):
            login_user(user)
            flask.flash('Logged in successfully.')
            next = request.args.get("next")
            return redirect(next or url_for('home'))
        flash('Invalid email address or Password.')
    return render_template('login.html', form=form)


@app.route("/logout")
@login_required
def logout():
    logout_user()
    flash('You have logged out successfully. Log in again to use the site')
    return redirect(url_for('login'))
