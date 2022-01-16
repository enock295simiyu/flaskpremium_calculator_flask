from flask import Flask, render_template, redirect, url_for

from accounts.accounts_handler import AccountsHandler
from forms import RegistrationForm

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)


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
