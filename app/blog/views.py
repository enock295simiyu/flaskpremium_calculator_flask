import logging

from flask import render_template, request
from flask_login import current_user

from app import app
from app.blog.blog_handler import BlogHandler

log = logging.getLogger(__name__)


@app.route('/blog')
def blog_view(**kwargs):
    log.info('Entering Blog GET')
    slug = kwargs.get('slug')
    user = current_user
    context_dict = {}

    context_dict['featured_blogs'] = BlogHandler().get_featured_blogs()
    context_dict['all_categories'] = BlogHandler().get_all_blog_categories()

    context_dict['recent_posts'] = BlogHandler().get_5_recent_blogs()
    if slug:
        bm_obj = BlogHandler()
        context_dict['blog'] = bm_obj.get_blog_details(slug)

        context_dict['featured_blogs'] = bm_obj.get_featured_blogs()
        if context_dict['blog']:
            context_dict['blog_comments'] = bm_obj.get_blog_comments(context_dict['blog'].id)
            bm_obj.update_view_count(context_dict['blog'].id)
            return render_template('blog_post.html', **context_dict)
        else:
            return render_template('404.html', **context_dict)
    page = request.args.get('page', 1)
    print(page)
    context_dict['all_blogs'] = BlogHandler().get_all_blogs(page)

    if user.is_authenticated and user.groups.filter(name='Blogger').exists():
        context_dict['blogger'] = True
    return render_template('blog.html', context_dict=context_dict)
