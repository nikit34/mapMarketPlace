from django import forms
from .models import MarketImage


class MarketImageForm(forms.ModelForm):
    image = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'])

    class Meta:
        model = MarketImage
        fields = ['title', 'description', 'timer']
