from flask import url_for, render_template
from werkzeug.utils import redirect

from flakspremium_calculator_flask import app
from flakspremium_calculator_flask.accounts.accounts_handler import AccountsHandler
from flakspremium_calculator_flask.accounts.forms import RegistrationForm


@app.route('/register', methods=['POST', 'GET'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user = AccountsHandler().register_user({'username': form.username.data,
                                                'email': form.email.data,
                                                'password1': form.password1.data,
                                                'first_name': form.first_name.data,
                                                'last_name': form.last_name.data,
                                                })

        return redirect(url_for('login'))
    return render_template('register.html', form=form)