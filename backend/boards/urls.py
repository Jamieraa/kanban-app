from django.urls import include, path  # Django URL handling
from rest_framework.routers import DefaultRouter  # DRF router for viewsets
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView  # JWT auth views

# Import viewsets and auth endpoints
from .views import (
    ProjectViewSet,      # CRUD API for projects
    ColumnViewSet,       # CRUD API for columns
    TaskViewSet,         # CRUD API for tasks
    CommentViewSet,      # CRUD API for comments
    NotificationViewSet, # CRUD API for notifications
    register,            # user registration endpoint
    logout_view          # user logout endpoint
)


# ----------------------------
# Router for automatic CRUD routes
# ----------------------------
router = DefaultRouter()
router.register(r'projects', ProjectViewSet)        # /projects/ and /projects/<id>/
router.register(r'columns', ColumnViewSet)          # /columns/ and /columns/<id>/
router.register(r'tasks', TaskViewSet)              # /tasks/ and /tasks/<id>/
router.register(r'comments', CommentViewSet)        # /comments/ and /comments/<id>/
router.register(r'notifications', NotificationViewSet)  # /notifications/ and /notifications/<id>/

# ----------------------------
# URL patterns for the boards app
# ----------------------------
urlpatterns = [
    path('', include(router.urls)),  # Include all routes from the router
    path('auth/register/', register, name='auth_register'),  # User registration endpoint
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # JWT login
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),      # JWT refresh token
    path('auth/logout/', logout_view, name='auth_logout'),  # Logout endpoint
]

