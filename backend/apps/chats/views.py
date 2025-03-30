from rest_framework import generics, permissions, serializers
from django.shortcuts import get_object_or_404
from django.db.models import Q
from apps.properties.models import Property
from .models import ChatRoom, ChatMessage
from .serializers import ChatRoomSerializer, ChatMessageSerializer

# Create or get an existing chatroom between buyer and seller
class CreateChatRoomView(generics.CreateAPIView):
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        property_id = self.request.data.get("property")
        property_obj = get_object_or_404(Property, id=property_id)

        # Prevent seller from creating a chatroom with themselves
        if property_obj.seller == self.request.user:
            raise serializers.ValidationError("You cannot contact yourself.")

        # Check if a chatroom already exists between these two users (regardless of property)
        chatroom = ChatRoom.objects.filter(
            Q(buyer=self.request.user, seller=property_obj.seller) |
            Q(buyer=property_obj.seller, seller=self.request.user)
        ).first()

        if chatroom:
            # Return existing chatroom
            serializer.instance = chatroom
        else:
            # Create a new chatroom
            chatroom = ChatRoom.objects.create(
                property=property_obj,
                buyer=self.request.user,
                seller=property_obj.seller,
            )
            serializer.instance = chatroom

# List all chatrooms for the logged-in user (either as buyer or seller)
class ChatRoomListView(generics.ListAPIView):
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ChatRoom.objects.filter(Q(buyer=user) | Q(seller=user))

# Retrieve a single chatroom along with its messages
class ChatRoomDetailView(generics.RetrieveAPIView):
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ChatRoom.objects.filter(Q(buyer=user) | Q(seller=user))

# Send a message in a chatroom
class SendMessageView(generics.CreateAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        chatroom_id = self.request.data.get("chatroom")
        chatroom = get_object_or_404(ChatRoom, id=chatroom_id)

        # Ensure the user is a participant in this chatroom
        if chatroom.buyer != self.request.user and chatroom.seller != self.request.user:
            raise serializers.ValidationError("You are not a participant in this chatroom.")

        serializer.save(chatroom=chatroom, sender=self.request.user)

# Delete a message (only the sender can delete)
class DeleteMessageView(generics.DestroyAPIView):
    queryset = ChatMessage.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        message = get_object_or_404(ChatMessage, id=self.kwargs["message_id"])

        # Ensure only the sender can delete their message
        if message.sender != self.request.user:
            raise serializers.ValidationError("You can only delete your own messages.")

        return message
