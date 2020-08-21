from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.utils.html import mark_safe


class MarketImage(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    image = models.ImageField(upload_to='images/')
    data_publish = models.DateField(auto_now_add=True)
    timer = models.DateTimeField()
    card_id = models.CharField(max_length=20)

    def __str__(self):
        return self.card_id

    class Meta:
        ordering = ["-data_publish"]

    @property
    def image_preview(self):
        if self.image:
            return mark_safe('<img src="{}" width="300" height="300" />'.format(self.image.url))
        return ""
