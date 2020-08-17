from django.http import HttpResponse
from django.views import View
from django.shortcuts import render, redirect
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

from .forms import MarketImageForm


class MainView(View):
    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        form = MarketImageForm()
        return render(request, 'base.html', {'form': form})

    def post(self, request, *args, **kwargs):
        form = MarketImageForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            redirect('main')
        return render(request, 'base.html', {'form': form})