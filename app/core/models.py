from datetime import datetime

from app.core.settings import db


class Comments(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.Integer, db.ForeignKey('user.id'))
    comment = db.Column(db.String(500), index=True, unique=False)
    email = db.Column(db.String(150), unique=False, index=True)
    website = db.Column(db.String(50), index=True, unique=False)
    created_on = db.Column(db.DateTime(), default=datetime.utcnow, index=True)

    def __init__(self, user_id, comment, email, website):
        self.id = user_id
        self.comment = comment
        self.email = email
        self.website = website
