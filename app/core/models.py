from datetime import datetime

from sqlalchemy.exc import IntegrityError

from app.settings import db


class Comments(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True, unique=True)
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


class CoreManager:
    def create_comment(self, data):
        """
        This function creates a new comment object
        :param data: {'email': The Email Value, 'comment': The comment content, 'website': The website value}
        :return:
        """
        comment = Comments(user_id=data.get('user_id'), comment=data.get('comment'), email=data.get('email'),
                           website=data.get('website'))
        db.session.add(comment)
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            last_obj_id = db.session.query(Comments).order_by(Comments.id.desc()).first().id
            comment.id = last_obj_id + 1
            db.session.add(comment)
            db.session.commit()

        return comment
