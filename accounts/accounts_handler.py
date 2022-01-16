from accounts.models import AccountsManager


class AccountsHandler:
    def __init__(self):
        self.accounts_obj = AccountsManager()

    def register_user(self, data):
        return self.accounts_obj.register_user(data)
