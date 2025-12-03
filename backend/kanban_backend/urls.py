from django.contrib import admin  #django admin site
from django.urls import include, path, re_path  #URL handling
from django.views.generic import TemplateView  #generic view for serving templates
from backend.boards.views import frontend  #import frontend view from boards app
from django.conf import settings  #import settings for configuration
from django.conf.urls.static import static  #static file handling
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView  # JWT authentication views

urlpatterns = [
    path('admin/', admin.site.urls),  #admin panel
    path('api/', include('backend.boards.urls')),  #include all API routes from boards app under /api/
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  #JWT login (returns access + refresh tokens)
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  #refresh JWT access token
    re_path(r'^(?!api/).*$', frontend, name='frontend'),  #catch-all route for frontend (excluding /api/)
]
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)  #serve static files in debug mode

