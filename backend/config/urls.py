from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.accounts.urls")),  # JWT Authentication URLs
    path("api/properties/", include("apps.properties.urls")),  # Property-related APIs
    path("api/chats/", include("apps.chats.urls")),

]
