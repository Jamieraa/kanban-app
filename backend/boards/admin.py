from django.contrib import admin
from .models import Project, Column, Task, Comment, Notification

# Register simple models
admin.site.register(Project)
admin.site.register(Column)
admin.site.register(Comment)
admin.site.register(Notification)

# Register Task model with custom admin settings
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'column', 'due', 'assigned')
    list_filter = ('column', 'due')
    search_fields = ('title', 'description', 'assigned')
    ordering = ('due',)
