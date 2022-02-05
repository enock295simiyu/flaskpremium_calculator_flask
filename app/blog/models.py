from datetime import datetime

from app.settings import db

category_identifier = db.Table('category_identifier',
                               db.Column('blog_id', db.Integer, db.ForeignKey('blog.id')),
                               db.Column('blog_category_id', db.Integer, db.ForeignKey('blog_category.id'))
                               )


class BlogCategory(db.Model):
    __tablename__ = 'blog_category'
    id = db.Column(db.Integer, primary_key=True, unique=True)
    category = db.Column(db.String(500), index=True, unique=False)
    category_description = db.Column(db.Text)
    blogs = db.relationship("Blog", secondary=category_identifier, back_populates="categories")

    def __init__(self, category, category_description):
        self.category = category
        self.category_description = category_description


class Blog(db.Model):
    __tablename__ = 'blog'
    id = db.Column(db.Integer, primary_key=True, unique=True)
    title = db.Column(db.String(500), index=True, unique=False)
    categories = db.relationship('BlogCategory', secondary=category_identifier, back_populates="blogs")
    blog_description = db.Column(db.String(500), index=True, unique=False)
    slug = db.Column(db.String(500), index=True, unique=True)
    content = db.Column(db.Text)
    author = db.Column(db.String(500), index=True, unique=False)
    views = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(500), index=True, unique=False)
    is_featured = db.Column(db.Boolean, default=False)
    is_approved = db.Column(db.Boolean, default=False)
    user = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_on = db.Column(db.DateTime(), default=datetime.utcnow, index=True)
    created_by = db.Column(db.String(500), index=True, unique=False)
    modified_by = db.Column(db.String(500), index=True, unique=False)

    def __init__(self, title, blog_description, slug, content, author, image_url, is_featured, created_by, modified_by):
        self.title = title
        self.blog_description = blog_description
        self.content = content
        self.slug = slug
        self.author = author
        self.image_url = image_url
        self.is_featured = is_featured
        self.created_by = created_by
        self.modified_by = modified_by


class BlogComments(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    blog = db.Column(db.Integer, db.ForeignKey('blog.id'))
    name = db.Column(db.String(500), index=True, unique=False)
    email = db.Column(db.String(150), unique=False, index=True)
    comment = db.Column(db.Text)
    created_datetime = db.Column(db.DateTime(), default=datetime.utcnow, index=True)

    def __init__(self, name, email, comment):
        self.name = name
        self.email = email
        self.comment = comment
