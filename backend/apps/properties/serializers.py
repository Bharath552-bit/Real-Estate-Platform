import json
from rest_framework import serializers
from .models import Property, Wishlist

class JSONListField(serializers.Field):
    def to_internal_value(self, data):
        # If data is a string, try to parse it as JSON
        if isinstance(data, str):
            try:
                parsed = json.loads(data)
                if not isinstance(parsed, list):
                    raise serializers.ValidationError("Expected a list of items.")
                return parsed
            except Exception as e:
                raise serializers.ValidationError("Invalid JSON format for this field.")
        # Otherwise, if already a list, return it directly
        if isinstance(data, list):
            return data
        raise serializers.ValidationError("Expected a list.")

    def to_representation(self, value):
        return value

class PropertySerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source="seller.username", read_only=True)
    # Use custom field for images
    images = JSONListField(required=False)
    
    class Meta:
        model = Property
        fields = [
            "id",
            "seller",
            "seller_name",
            "name",
            "location",
            "description",
            "price",
            "property_type",
            "images",  # This field now holds multiple image URLs as a list
            "furnished_status",
            "floor_number",
            "total_floors",
            "property_age",
            "nearby_landmarks",
            "parking_availability",
            "security_features",
            "amenities",
            "created_at",
        ]
        read_only_fields = ("seller",)

class WishlistSerializer(serializers.ModelSerializer):
    property = PropertySerializer(read_only=True)
    
    class Meta:
        model = Wishlist
        fields = ["id", "property"]
        read_only_fields = ["user", "created_at"]
