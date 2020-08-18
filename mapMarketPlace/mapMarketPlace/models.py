from django.db import models
from django.contrib.auth.models import User


class MarketImage(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    data_publish = models.DateField(auto_now_add=True)
    timer = models.DateTimeField()
    image = models.ImageField(upload_to='images/')

    def __str__(self):
        return self.title