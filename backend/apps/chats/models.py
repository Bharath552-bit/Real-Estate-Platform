# apps/chats/models.py
from django.db import models
from django.contrib.auth.models import User
from apps.properties.models import Property

class ChatRoom(models.Model):
    # Optional property for context; can be null if the conversation evolves
    property = models.ForeignKey(Property, on_delete=models.SET_NULL, null=True, blank=True, related_name='chatrooms')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chatrooms_as_seller')
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chatrooms_as_buyer')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (('buyer', 'seller'),)  # Only one chatroom per buyer and seller

    def __str__(self):
        return f"ChatRoom: Buyer {self.buyer.username} - Seller {self.seller.username}"

class ChatMessage(models.Model):
    chatroom = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender.username} at {self.timestamp}"
