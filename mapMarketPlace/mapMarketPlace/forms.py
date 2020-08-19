from django import forms
from .models import MarketImage
from django.utils import timezone


class MarketImageForm(forms.ModelForm):
    title = forms.CharField(label='', widget=forms.TextInput(attrs={'placeholder': 'no more 20 symb.'}))
    description = forms.CharField(required=False, widget=forms.TextInput(attrs={'placeholder': 'optional'}))

    class Meta:
        model = MarketImage
        fields = [
            'title',
            'description',
            'image',
            'timer',
        ]

    def clean_title(self, *args, **kwargs):
        title = self.cleaned_data.get('title')
        prohibite = ['/', '<', '>', ':', '\'', '"', '*', '&', '\\', ';', '#', '@', '!', '^', '№', '~', '`']
        answer = []
        for p in prohibite:
            if p in title:
                answer.append(f"symbol {p} has not valid\n")
        if answer:
            raise forms.ValidationError(answer)
        return title

    def clean_timer(self, *args, **kwargs):
        choice_data = self.cleaned_data.get('timer')
        if timezone.now() > choice_data:
            raise forms.ValidationError('please, select a future date')
        return choice_data