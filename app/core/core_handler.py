from app.core.models import CoreManager


class CoreHandler:
    def create_comment(self,data):
        return CoreManager().create_comment(data)

    def get_all_comments(self):
        return CoreManager().get_all_comments()