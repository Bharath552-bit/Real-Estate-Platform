from rest_framework import generics, serializers, permissions
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from .models import Property, Wishlist
from .serializers import PropertySerializer, WishlistSerializer

# ✅ Create a property (restricted to authenticated users)
class AddPropertyView(generics.CreateAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]  # Requires login

# ✅ List all properties & allow adding new ones
class PropertyListCreateView(generics.ListCreateAPIView):
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = Property.objects.all().order_by('-created_at')
        exclude_user = self.request.query_params.get("exclude_user")
        if exclude_user:
            qs = qs.exclude(seller_id=exclude_user)
        return qs

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

# ✅ Fetch properties added by the logged-in user
class UserPropertiesView(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Property.objects.filter(seller=self.request.user)

# ✅ Get details of a specific property (supports update & delete)
class PropertyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        property_obj = self.get_object()
        if property_obj.seller != self.request.user:
            raise serializers.ValidationError({"detail": "You can only edit your own properties."})
        serializer.save()

    def perform_destroy(self, instance):
        if instance.seller != self.request.user:
            raise serializers.ValidationError("You can only delete your own properties.")
        instance.delete()

# ✅ Fetch wishlist items of the logged-in user
class WishlistListView(generics.ListAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

# ✅ Add property to wishlist
class AddToWishlistView(generics.CreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        property_id = self.request.data.get("property")
        prop = get_object_or_404(Property, id=property_id)
        if Wishlist.objects.filter(user=self.request.user, property=prop).exists():
            raise serializers.ValidationError("Property is already in your wishlist.")
        serializer.save(user=self.request.user, property=prop)

# ✅ Remove property from wishlist
class RemoveFromWishlistView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WishlistSerializer

    def get_object(self):
        property_id = self.kwargs.get("property_id")
        return get_object_or_404(Wishlist, user=self.request.user, property_id=property_id)
