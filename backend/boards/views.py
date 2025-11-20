from rest_framework import viewsets, status, filters  # DRF viewsets, status codes, and filters
from rest_framework.decorators import api_view, permission_classes  # decorators
from rest_framework.permissions import IsAuthenticated, AllowAny  # DRF permissions
from rest_framework.response import Response  # DRF response
from rest_framework_simplejwt.tokens import RefreshToken  # JWT token handling
from django.contrib.auth import get_user_model  # get custom user model
from .models import Project, Column, Task, Comment, Notification  # import models
from .serializers import (
    ProjectSerializer, ColumnSerializer, TaskSerializer,
    CommentSerializer, NotificationSerializer, RegisterSerializer
)
from .permissions import (
    IsProjectMemberOrOwner, IsProjectOwner,
    IsCommentAuthorOrProjectMember, IsNotificationUser
)
from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to the Kanban App!")


User = get_user_model()  # get the active user model


# ----------------------------
# User registration endpoint
# ----------------------------
@api_view(['POST'])
@permission_classes([AllowAny])  # Anyone can register
def register(request):
    """
    Register a new user.
    """
    serializer = RegisterSerializer(data=request.data)  # serialize request data
    if serializer.is_valid():  # check if valid
        serializer.save()  # save user to database
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # return errors if invalid


# ----------------------------
# User logout endpoint
# ----------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # only logged-in users
def logout_view(request):
    """
    Logout by blacklisting the refresh token.
    """
    try:
        refresh_token = request.data["refresh"]  # get token from request
        token = RefreshToken(refresh_token)
        token.blacklist()  # invalidate the token
        return Response({"detail": "Successfully logged out"}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ----------------------------
# Project ViewSet
# ----------------------------
class ProjectViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Projects.
    Permissions:
    - Only project owner can edit/delete.
    - Members and owner can view.
    """
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsProjectOwner]
    queryset = Project.objects.all()

    # Only show projects the user owns or is a member of
    def get_queryset(self):
        return Project.objects.filter(members=self.request.user) | Project.objects.filter(owner=self.request.user)

    # Automatically assign owner when creating a project
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# ----------------------------
# Column ViewSet
# ----------------------------
class ColumnViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Columns.
    Permissions:
    - Only project members or owner can access.
    """
    serializer_class = ColumnSerializer
    permission_classes = [IsAuthenticated, IsProjectMemberOrOwner]

    # Only show columns in projects the user has access to
    def get_queryset(self):
        return Column.objects.filter(project__members=self.request.user) | Column.objects.filter(project__owner=self.request.user)

    # Automatically associate new column with project owner if needed
    # (The frontend must provide the project ID in the request)
    def perform_create(self, serializer):
        serializer.save()


# ----------------------------
# Task ViewSet
# ----------------------------
class TaskViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Tasks.
    Permissions:
    - Only project members or owner can access.
    """
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsProjectMemberOrOwner]

    # Only show tasks in projects the user has access to
    def get_queryset(self):
        return Task.objects.filter(column__project__members=self.request.user) | Task.objects.filter(column__project__owner=self.request.user)

    # Automatically assign creator when creating a task
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# ----------------------------
# Comment ViewSet
# ----------------------------
class CommentViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Comments.
    Permissions:
    - Only comment author, project members, or owner can access.
    """
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsCommentAuthorOrProjectMember]

    # Only show comments in projects user can access
    def get_queryset(self):
        return Comment.objects.filter(task__column__project__members=self.request.user) | Comment.objects.filter(task__column__project__owner=self.request.user)

    # Automatically assign author when creating a comment
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


# ----------------------------
# Notification ViewSet
# ----------------------------
class NotificationViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Notifications.
    Permissions:
    - Only the notification's user can access.
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated, IsNotificationUser]

    # Only show notifications belonging to the logged-in user
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


# ----------------------------
# Test connection endpoint
# ----------------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def test_connection(request):
    """
    Simple endpoint to test API availability.
    """
    return Response({"detail": "API is reachable"})
