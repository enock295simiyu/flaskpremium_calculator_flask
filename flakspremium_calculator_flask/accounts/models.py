from datetime import datetime

from flask_login import UserMixin, LoginManager
from werkzeug.security import generate_password_hash, check_password_hash

from flakspremium_calculator_flask import app
from flakspremium_calculator_flask.core.settings import db

login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), index=True, unique=True)
    email = db.Column(db.String(150), unique=True, index=True)
    first_name = db.Column(db.String(50), index=True, unique=True)
    last_name = db.Column(db.String(150), unique=True, index=True)
    password_hash = db.Column(db.String(150))
    joined_at = db.Column(db.DateTime(), default=datetime.utcnow, index=True)

    def __init__(self, username, email=None, first_name=None, last_name=None):
        self.username = username
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.email = email

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class AccountsManager:
    def register_user(self, data):
        """
        This function registers a new user
        :param data: {'username': The value of a username, 'email': The value of email, 'password1': The value of a
        password,'first_name': Value of first name, 'last_name': Value of last name}
        :return: user object
        """
        user = User(username=data.get('username'), email=data.get('email'), first_name=data.get('first_name'),
                    last_name=data.get('last_name'))
        user.set_password(data.get('password1'))
        db.session.add(user)
        db.session.commit()
        return user

    def get_user_by_id(self, user_id):
        """
        This function returns a user with a particular user id
        :param user_id:
        :return:
        """
        return User.get(user_id)
