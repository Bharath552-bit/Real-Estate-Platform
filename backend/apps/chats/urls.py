# apps/chats/urls.py
from django.urls import path
from .views import CreateChatRoomView, ChatRoomListView, ChatRoomDetailView, SendMessageView, DeleteMessageView

urlpatterns = [
    path("rooms/", ChatRoomListView.as_view(), name="chatroom-list"),
    path("rooms/create/", CreateChatRoomView.as_view(), name="create-chatroom"),
    path("rooms/<int:pk>/", ChatRoomDetailView.as_view(), name="chatroom-detail"),
    path("messages/send/", SendMessageView.as_view(), name="send-message"),
    path("messages/delete/<int:message_id>/", DeleteMessageView.as_view(), name="delete-message"),
]
