from flakspremium_calculator_flask.accounts.models import AccountsManager


class AccountsHandler:
    def __init__(self):
        self.accounts_obj = AccountsManager()

    def register_user(self, data):
        return self.accounts_obj.register_user(data)

    def get_user_by_id(self, user_id):
        return self.accounts_obj.get_user_by_id(user_id)
