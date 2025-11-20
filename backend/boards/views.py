from rest_framework import viewsets, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import Project, Column, Task, Comment, Notification
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


User = get_user_model()


# ----------------------------
# User registration endpoint
# ----------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ----------------------------
# User logout endpoint
# ----------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"detail": "Successfully logged out"}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ----------------------------
# Project ViewSet
# ----------------------------
class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsProjectOwner]
    queryset = Project.objects.all()  # REQUIRED

    def get_queryset(self):
        return Project.objects.filter(members=self.request.user) | Project.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


# ----------------------------
# Column ViewSet
# ----------------------------
class ColumnViewSet(viewsets.ModelViewSet):
    serializer_class = ColumnSerializer
    permission_classes = [IsAuthenticated, IsProjectMemberOrOwner]
    queryset = Column.objects.all()  # REQUIRED

    def get_queryset(self):
        return Column.objects.filter(project__members=self.request.user) | Column.objects.filter(project__owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save()


# ----------------------------
# Task ViewSet
# ----------------------------
class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsProjectMemberOrOwner]
    queryset = Task.objects.all()  # REQUIRED

    def get_queryset(self):
        return Task.objects.filter(column__project__members=self.request.user) | Task.objects.filter(column__project__owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# ----------------------------
# Comment ViewSet
# ----------------------------
class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsCommentAuthorOrProjectMember]
    queryset = Comment.objects.all()  # REQUIRED

    def get_queryset(self):
        return Comment.objects.filter(task__column__project__members=self.request.user) | Comment.objects.filter(task__column__project__owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


# ----------------------------
# Notification ViewSet
# ----------------------------
class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated, IsNotificationUser]
    queryset = Notification.objects.all()  # REQUIRED

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


# ----------------------------
# Test connection endpoint
# ----------------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def test_connection(request):
    return Response({"detail": "API is reachable"})
