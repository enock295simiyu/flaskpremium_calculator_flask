from app import app
from app.settings import ckeditor

app.run(debug=True)
ckeditor.init_app(app)
