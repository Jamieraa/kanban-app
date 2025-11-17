from django.contrib import admin  # Import admin module
from .models import Project, Column, Task, Comment, Notification  # Import models

# Register models to appear in Django admin
admin.site.register(Project)  # Project model
admin.site.register(Column)   # Column model
admin.site.register(Task)     # Task model
admin.site.register(Comment)  # Comment model
admin.site.register(Notification)  # Notification model

# Customize Task display in admin
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'column', 'due', 'assigned')  # Columns to display in list
    list_filter = ('column', 'due')                         # Filters available in sidebar
    search_fields = ('title', 'description', 'assigned')   # Fields searchable in admin