from django.urls import path
from .views import (
    PropertyListCreateView, PropertyDetailView, UserPropertiesView,
    WishlistListView, AddToWishlistView, RemoveFromWishlistView
)

urlpatterns = [
    path("", PropertyListCreateView.as_view(), name="property_list_create"),
    path("<int:pk>/", PropertyDetailView.as_view(), name="property_detail"),
    path("user/", UserPropertiesView.as_view(), name="user_properties"),
    path("wishlist/", WishlistListView.as_view(), name="wishlist_list"),
    path("wishlist/add/", AddToWishlistView.as_view(), name="wishlist_add"),
    path("wishlist/remove/<int:property_id>/", RemoveFromWishlistView.as_view(), name="wishlist_remove"),
]
