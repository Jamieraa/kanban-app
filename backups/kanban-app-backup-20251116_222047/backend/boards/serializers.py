from rest_framework import serializers  # import DRF serializers
from rest_framework.validators import UniqueValidator  # validate uniqueness
from .models import Project, Column, Task, Comment, Notification  # import project models
from django.contrib.auth import get_user_model  # get custom user model

User = get_user_model()  # get the active user model

# ----------------------------
# Column Serializer
# ----------------------------
class ColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Column
        fields = '__all__'  # include all fields


# ----------------------------
# Task Serializer
# ----------------------------
class TaskSerializer(serializers.ModelSerializer):
    assigned_user = serializers.CharField(source='assigned.username', read_only=True)  # show assigned username
    class Meta:
        model = Task
        fields = '__all__'


# ----------------------------
# Comment Serializer
# ----------------------------
class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)  # display author username
    class Meta:
        model = Comment
        fields = '__all__'


# ----------------------------
# Notification Serializer
# ----------------------------
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


# ----------------------------
# Project Serializer with nested columns
# ----------------------------
class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.CharField(source='owner.username', read_only=True)  # display owner username
    members = serializers.SlugRelatedField(
        slug_field='username', many=True, queryset=User.objects.all(), required=False
    )  # display members as usernames
    columns = ColumnSerializer(many=True, read_only=True)  # nested columns

    class Meta:
        model = Project
        fields = '__all__'


# ----------------------------
# User Registration Serializer
# ----------------------------
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)  # password write-only
    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )  # ensure email is unique

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {
            'username': {'required': True, 'validators': [UniqueValidator(queryset=User.objects.all())]}
        }

    def create(self, validated_data):
        # create user and hash password
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data, password=password)
        return user


# ----------------------------
# User Serializer
# ----------------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')
