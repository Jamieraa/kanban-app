from django.apps import AppConfig

class BoardsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'  # default primary key field type
    name = 'backend.boards'  # name of the app
