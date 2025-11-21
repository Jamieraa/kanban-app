"""
URL configuration for kanban_backend project.

The `urlpatterns` list routes URLs to views.
"""

# ----------------------------
# Import statements
# ----------------------------
from django.contrib import admin  # Django admin site
from django.urls import include, path  # URL handling
from boards import views  # Import views from boards app
from .views import frontend  # Import frontend view
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView  # JWT authentication views

# ----------------------------
# Global URL patterns
# ----------------------------
urlpatterns = [
     path('', frontend, name='frontend'),
    path('admin/', admin.site.urls),  # Admin panel
    path('api/', include('boards.urls')),  # Include all API routes from boards app under /api/
    path('api/test/', views.test_connection),  # Simple endpoint to test API connectivity
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # JWT login (returns access + refresh tokens)
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh JWT access token
]
