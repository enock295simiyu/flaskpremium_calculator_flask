from flask_admin.contrib.sqla import ModelView

from app.blog.models import BlogCategory, Blog, BlogComments
from app.settings import db, admin

admin.add_view(ModelView(BlogCategory, db.session))
admin.add_view(ModelView(Blog, db.session))
admin.add_view(ModelView(BlogComments, db.session))