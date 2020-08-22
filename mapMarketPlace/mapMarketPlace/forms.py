from django import forms
from .models import MarketImage
from django.utils import timezone
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class RegisterForm(UserCreationForm):
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password1',
            'password2'
        ]


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
            'card_id'
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

    def clean_image(self,  *args, **kwargs):
        file = self.cleaned_data.get('image')
        if file.name[-4:] != '.png' and file.name[-4:] != '.jpg' and file.name[-5:] != '.jpeg':
            raise forms.ValidationError("Image is not valid format")
        if file.size > 15 * 1024 * 1024:
            raise forms.ValidationError("Image file is too large ( > 15mb )")
        return file
