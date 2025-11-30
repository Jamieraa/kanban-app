import os
from django.http import HttpResponse
from django.conf import settings
from django.shortcuts import render
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

User = get_user_model()


# ----------------------------
# User registration endpoint
# ----------------------------
@api_view(['POST']) #allowing only POST requests
@permission_classes([AllowAny]) #anyone can access this endpoint
def register(request): #user registration view
    serializer = RegisterSerializer(data=request.data) #serialize incoming data
    if serializer.is_valid(): #validate data
        serializer.save() #save new user
        return Response(serializer.data, status=status.HTTP_201_CREATED) #return success response
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) #return errors if invalid


# ----------------------------
# User logout endpoint
# ----------------------------
@api_view(['POST']) #allowing only POST requests
@permission_classes([IsAuthenticated]) #only authenticated users can access this endpoint
def logout_view(request): #user logout view
    try: #attempt to blacklist the refresh token
        refresh_token = request.data["refresh"] #get refresh token from request data
        token = RefreshToken(refresh_token) #create RefreshToken instance
        token.blacklist() #blacklist the token
        return Response({"detail": "Successfully logged out"}, status=status.HTTP_205_RESET_CONTENT) #return success response
    except Exception as e: #handle exceptions
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST) #return error response


# ----------------------------
# Project ViewSet
# ----------------------------
class ProjectViewSet(viewsets.ModelViewSet): #CRUD operations for Project model
    serializer_class = ProjectSerializer #serializer for Project model
    permission_classes = [IsAuthenticated, IsProjectOwner] #permissions for accessing Project endpoints
    queryset = Project.objects.all()  

    def get_queryset(self): #custom queryset to filter projects by user
        return Project.objects.filter(members=self.request.user) | Project.objects.filter(owner=self.request.user) #projects where user is a member or owner

    def perform_create(self, serializer): #custom create method to set owner
        serializer.save(owner=self.request.user) #set the owner to the current user


# ----------------------------
# Column ViewSet
# ----------------------------
class ColumnViewSet(viewsets.ModelViewSet): #CRUD operations for Column model
    serializer_class = ColumnSerializer #serializer for Column model
    permission_classes = [IsAuthenticated, IsProjectMemberOrOwner] #permissions for accessing Column endpoints
    queryset = Column.objects.all()  

    def get_queryset(self): #custom queryset to filter columns by user
        return Column.objects.filter(project__members=self.request.user) | Column.objects.filter(project__owner=self.request.user)

    def perform_create(self, serializer): #custom create method to set project
        serializer.save(project=self.request.data.get("project")) #set the project to the provided project ID


# ----------------------------
# Task ViewSet
# ----------------------------
class TaskViewSet(viewsets.ModelViewSet): #CRUD operations for Task model
    serializer_class = TaskSerializer #serializer for Task model
    permission_classes = [IsAuthenticated, IsProjectMemberOrOwner] #permissions for accessing Task endpoints
    queryset = Task.objects.all() 

    def get_queryset(self): #custom queryset to filter tasks by user
        return Task.objects.filter(column__project__members=self.request.user) | Task.objects.filter(column__project__owner=self.request.user) #tasks where user is a member or owner of the project

    def perform_create(self, serializer): #custom create method to set created_by
        serializer.save(created_by=self.request.user) #set the creator to the current user


# ----------------------------
# Comment ViewSet
# ----------------------------
class CommentViewSet(viewsets.ModelViewSet): #CRUD operations for Comment model
    serializer_class = CommentSerializer #serializer for Comment model
    permission_classes = [IsAuthenticated, IsCommentAuthorOrProjectMember] #permissions for accessing Comment endpoints
    queryset = Comment.objects.all() 

    def get_queryset(self): #custom queryset to filter comments by user
        return Comment.objects.filter(task__column__project__members=self.request.user) | Comment.objects.filter(task__column__project__owner=self.request.user) #comments where user is a member or owner of the project

    def perform_create(self, serializer): #custom create method to set author
        serializer.save(author=self.request.user) #set the author to the current user


# ----------------------------
# Notification ViewSet
# ----------------------------
class NotificationViewSet(viewsets.ModelViewSet): #CRUD operations for Notification model
    serializer_class = NotificationSerializer #serializer for Notification model
    permission_classes = [IsAuthenticated, IsNotificationUser] #permissions for accessing Notification endpoints
    queryset = Notification.objects.all() 

    def get_queryset(self): #custom queryset to filter notifications by user
        return Notification.objects.filter(user=self.request.user) #notifications for the current user


# ----------------------------
# Test connection endpoint
# ----------------------------
@api_view(['GET']) #allowing only GET requests
@permission_classes([AllowAny]) #anyone can access this endpoint
def test_connection(request): #test connection view
    return Response({"detail": "API is reachable"}) #return success response

#------------------------
# Frontend serving view
#------------------------
def frontend(request): #view to serve React frontend
    """
    Serve the React frontend's index.html.
    """
    try:
        path = os.path.join(settings.BASE_DIR, '..', 'frontend', 'dist', 'index.html') #path to the built React app's index.html
        with open(path) as f: #open the index.html file
            return HttpResponse(f.read()) #return the contents of index.html
    except FileNotFoundError: #handle file not found error
        return HttpResponse( 
            "index.html not found! Please build your React app first.",
            status=501,
        )
