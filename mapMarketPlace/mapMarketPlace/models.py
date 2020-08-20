from django.db import models
from django.contrib.auth.models import User


class MarketImage(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    image = models.ImageField(upload_to='images/')
    data_publish = models.DateField(auto_now_add=True)
    timer = models.DateTimeField()
    card_id = models.CharField(max_length=20)

    def __str__(self):
        return self.card_id