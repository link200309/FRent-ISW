from django.db import models
from users.models import User

class Chat(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_chats")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_chats")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_chats")
    message = models.CharField(max_length=1000)
    is_read = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date']
        verbose_name_plural = "chats"

    def __str__(self):
        return f"{self.sender} -> {self.receiver}"

    def get_sender_full_name(self):
        return f"{self.sender.first_name} {self.sender.last_name}" if self.sender else ""

    def get_receiver_full_name(self):
        return f"{self.receiver.first_name} {self.receiver.last_name}" if self.receiver else ""