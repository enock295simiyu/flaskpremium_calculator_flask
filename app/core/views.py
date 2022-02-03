from flask import render_template, request, flash, redirect, url_for
from flask_login import current_user

from app import app
from app.core.core_handler import CoreHandler


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/comment', methods=['POST'])
def leave_comment():
    if request.method == 'POST':
        if current_user.is_authenticated:
            email = request.form.get('email')
            comment = request.form.get('comment')
            website = request.form.get('website')
            CoreHandler().create_comment(
                {'user_id': current_user.id, 'email': email, 'comment': comment, 'website': website})
            flash('Comment has been created successfully')
            return redirect(url_for('home'))
        else:
            flash('You have to be logged in to add a comment')
            return redirect(url_for('home'))
    else:
        flash('Method not allowed')
        return redirect(url_for('home'))


