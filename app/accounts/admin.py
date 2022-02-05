from flask_admin.contrib.sqla import ModelView

from app.accounts.models import User
from app.settings import db, admin

admin.add_view(ModelView(User, db.session))