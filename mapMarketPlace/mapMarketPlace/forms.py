from django import forms
from .models import MarketImage


class MarketImageForm(forms.ModelForm):
    class Meta:
        model = MarketImage
        fields = ['title', 'description', 'timer', 'image']