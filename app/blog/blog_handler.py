from app.blog.models import BlogManager


class BlogHandler:
    def get_featured_blogs(self):
        return BlogManager().get_featured_blogs()

    def get_all_blog_categories(self):
        return BlogManager().get_all_blog_categories()

    def get_5_recent_blogs(self):
        return BlogManager().get_5_recent_blogs()

    def get_blog_details(self, slug):
        return BlogManager().get_blog_details(slug)

    def get_blog_comments(self, blog_id):
        return BlogManager().get_blog_comments(blog_id)

    def update_view_count(self, blog_id):
        return BlogManager().update_view_count(blog_id)

    def get_all_blogs(self,page):
        return BlogManager().get_all_blogs(page)
