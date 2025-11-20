from django.contrib import admin
from .models import Project, Column, Task, Comment, Notification

# Register models to appear in Django admin
admin.site.register(Project)
admin.site.register(Column)
admin.site.register(Comment)
admin.site.register(Notification)

# Customize Task display in admin
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'column', 'due', 'assigned')
    list_filter = ('column', 'due')
    search_fields = ('title', 'description', 'assigned')
    ordering = ('due',)