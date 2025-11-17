from django.db import models  # import Django models
from django.conf import settings  # import settings to access AUTH_USER_MODEL
from django.contrib.auth import get_user_model  # import the user model
from django.utils import timezone  # import timezone for timestamps

# Get the active user model
User = get_user_model()


# Custom manager to return only active objects
class ActiveManager(models.Manager):
    def get_queryset(self):
        # Return objects where is_active=True
        return super().get_queryset().filter(is_active=True)


# ---------------- Project Model ----------------
class Project(models.Model):
    name = models.CharField(
        max_length=100,
        help_text="Name of the project (required)"
    )  # project name
    description = models.TextField(
        blank=True, null=True, help_text="Optional project description"
    )  # project description
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='owned_projects',
        help_text="User who owns the project"
    )  # owner of the project
    members = models.ManyToManyField(
        User, related_name='projects', blank=True,
        help_text="Users who can interact with the project"
    )  # project members
    created_at = models.DateTimeField(auto_now_add=True)  # timestamp when created
    updated_at = models.DateTimeField(auto_now=True)  # timestamp when updated
    is_active = models.BooleanField(default=True)  # soft delete flag

    # Custom managers
    objects = ActiveManager()  # only active objects
    all_objects = models.Manager()  # includes inactive objects

    def __str__(self):
        return self.name  # display name in admin

    class Meta:
        ordering = ['name']  # order projects alphabetically
        verbose_name = "Project"
        verbose_name_plural = "Projects"


# ---------------- Column Model ----------------
class Column(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name='columns',
        help_text="The project this column belongs to"
    )  # link to project
    name = models.CharField(
        max_length=100, help_text="Column name, e.g., 'To Do', 'In Progress'"
    )  # column name
    order = models.PositiveIntegerField(
        help_text="Position of column in project board (left to right)"
    )  # column order
    created_at = models.DateTimeField(auto_now_add=True)  # timestamp when created
    updated_at = models.DateTimeField(auto_now=True)  # timestamp when updated
    is_active = models.BooleanField(default=True)  # soft delete flag

    objects = ActiveManager()
    all_objects = models.Manager()

    def __str__(self):
        return f"{self.name} ({self.project.name})"  # display column with project

    class Meta:
        ordering = ['order']  # order columns left to right
        unique_together = ('project', 'order')  # no duplicate column orders in same project
        verbose_name = "Column"
        verbose_name_plural = "Columns"


# ---------------- Task Model ----------------
class Task(models.Model):
    column = models.ForeignKey(
        Column, on_delete=models.CASCADE, related_name='tasks',
        help_text="The column this task belongs to"
    )  # link to column
    title = models.CharField(max_length=200, help_text="Task title")  # task title
    description = models.TextField(blank=True, null=True, help_text="Task description")  # optional
    order = models.PositiveIntegerField(help_text="Task order within the column")  # task order
    due = models.DateField(blank=True, null=True, help_text="Optional due date")  # optional
    assigned = models.ForeignKey(
        User, on_delete=models.SET_NULL, blank=True, null=True,
        related_name='tasks', help_text="User assigned to this task"
    )  # assigned user
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, blank=True, null=True,
        related_name='created_tasks', help_text="User who created this task"
    )  # task creator
    created_at = models.DateTimeField(auto_now_add=True)  # timestamp when created
    updated_at = models.DateTimeField(auto_now=True)  # timestamp when updated
    is_active = models.BooleanField(default=True)  # soft delete flag

    objects = ActiveManager()
    all_objects = models.Manager()

    def __str__(self):
        return self.title  # display task title

    class Meta:
        ordering = ['order']  # order tasks top to bottom
        unique_together = ('column', 'order')  # no duplicate task order in same column
        verbose_name = "Task"
        verbose_name_plural = "Tasks"


# ---------------- Comment Model ----------------
class Comment(models.Model):
    task = models.ForeignKey(
        Task, on_delete=models.CASCADE, related_name='comments',
        help_text="Task this comment belongs to"
    )  # link to task
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='comments',
        help_text="User who wrote this comment"
    )  # comment author
    text = models.TextField(help_text="Comment text")  # comment content
    created_at = models.DateTimeField(auto_now_add=True)  # timestamp when created
    updated_at = models.DateTimeField(auto_now=True)  # timestamp when updated
    is_active = models.BooleanField(default=True)  # soft delete flag

    objects = ActiveManager()
    all_objects = models.Manager()

    def __str__(self):
        return f"{self.author}: {self.text[:20]}"  # display author and first 20 chars

    class Meta:
        ordering = ['created_at']
        verbose_name = "Comment"
        verbose_name_plural = "Comments"


# ---------------- Notification Model ----------------
class Notification(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='notifications',
        help_text="User this notification belongs to"
    )  # linked user
    message = models.TextField(help_text="Notification message")  # message content
    created_at = models.DateTimeField(auto_now_add=True)  # timestamp when created
    read = models.BooleanField(default=False, help_text="Has the user read this notification?")  # read status

    def __str__(self):
        return f"Notification for {self.user}: {self.message[:20]}"  # display first 20 chars

    class Meta:
        ordering = ['-created_at']  # newest notifications first
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
