from django.http import HttpResponse
from django.views import View
from django.shortcuts import render, redirect
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

from .forms import MarketImageForm
from .models import MarketImage


class MainView(View):
    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        form = MarketImageForm()
        cards = MarketImage.objects.all()
        print(cards)
        return render(request, 'base.html', {'form': form, 'cards': cards})

    def post(self, request, *args, **kwargs):
        form = MarketImageForm(request.POST, request.FILES)
        print(1)
        if form.is_valid():
            form.save()
            print(2)
            redirect('main')
        return render(request, 'base.html', {'form': form})