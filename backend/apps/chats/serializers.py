# apps/chats/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ChatRoom, ChatMessage
from apps.properties.serializers import PropertySerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class ChatMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'message', 'timestamp']

class ChatRoomSerializer(serializers.ModelSerializer):
    property = PropertySerializer(read_only=True)
    seller = UserSerializer(read_only=True)
    buyer = UserSerializer(read_only=True)
    messages = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['id', 'property', 'seller', 'buyer', 'created_at', 'messages']

    def get_messages(self, obj):
        msgs = obj.messages.all().order_by("timestamp")
        return ChatMessageSerializer(msgs, many=True).data
