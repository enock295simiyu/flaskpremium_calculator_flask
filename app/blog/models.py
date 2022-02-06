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


class BlogManager:
    def get_featured_blogs(self):
        """
        This function returns all featured blogs
        :return:
        """
        return Blog.query.filter_by(is_featured=True)

    def get_all_blog_categories(self):
        """
        This function returns all the blog categories saved in the database
        :return:
        """
        return BlogCategory.query.all()

    def get_5_recent_blogs(self):
        """
        This function returns the last 5 blogs created
        :return:
        """
        return Blog.query.order_by(Blog.id.desc())[:5]

    def get_blog_details(self, slug):
        """
        This function returns a specific blog by its slug
        :return:
        """
        return Blog.query.filter(Blog.slug.ilike(slug)).last()

    def get_blog_comments(self, blog_id):
        """
        This function returns all the comments of a particular blog
        :param blog_id:
        :return:
        """
        return BlogComments.query.filter_by(blog=blog_id)

    def update_view_count(self, blog_id):
        """
        This function updates the view counts of a particular blog
        :param blog_id:
        :return:
        """
        blog = Blog.query.filter_by(id=blog_id).first()
        blog.views += 1
        db.session.commit()
        return blog

    def get_all_blogs(self,page):
        """
        This function returns all the blogs
        :return:
        """
        return Blog.query.all()
