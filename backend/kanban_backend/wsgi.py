"""
WSGI config for kanban_backend project.

This file exposes the WSGI callable as a module-level variable named `application`.
It is used by Gunicorn on Render and other WSGI servers.
"""

import os
from django.core.wsgi import get_wsgi_application

# Set the default settings module for the 'kanban_backend' project
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kanban_backend.settings')

# Create the WSGI application callable for Gunicorn
application = get_wsgi_application()
