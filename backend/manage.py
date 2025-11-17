"""Django's command-line utility for administrative tasks."""
import os
import sys

def main():
    """Run administrative tasks."""
    # Set default Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kanban_backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        # Raise an error if Django is not installed
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable?"
        ) from exc
    # Execute command-line utility
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
