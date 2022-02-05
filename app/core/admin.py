from flask_admin.contrib.sqla import ModelView

from app.core.models import Comments
from app.settings import db, admin

admin.add_view(ModelView(Comments, db.session))