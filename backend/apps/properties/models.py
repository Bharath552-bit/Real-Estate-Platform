from django.db import models
from django.contrib.auth.models import User

PROPERTY_CHOICES = (
    ('sell', 'Sell'),
    ('rent', 'Rent'),
)

class Property(models.Model):
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='properties')
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    property_type = models.CharField(max_length=50)
    images = models.JSONField(blank=True, null=True)
    furnished_status = models.CharField(max_length=50, blank=True, null=True)
    floor_number = models.PositiveIntegerField(blank=True, null=True)
    total_floors = models.PositiveIntegerField(blank=True, null=True)
    property_age = models.CharField(max_length=50, blank=True, null=True)
    nearby_landmarks = models.CharField(max_length=255, blank=True, null=True)
    parking_availability = models.CharField(max_length=50, blank=True, null=True)
    security_features = models.JSONField(blank=True, null=True)
    amenities = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist_items')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='wishlisted_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'property')

    def __str__(self):
        return f"{self.user.username} - {self.property.name}"
