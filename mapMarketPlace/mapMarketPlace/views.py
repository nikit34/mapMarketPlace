from django.http import HttpResponse
from django.views import View
from django.shortcuts import render, redirect
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.contrib.auth.mixins import LoginRequiredMixin

from .forms import MarketImageForm
from .models import MarketImage


class authMainView(LoginRequiredMixin, View):
    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        # cards = MarketImage.objects.all()
        return render(request, 'base.html')

    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            redirect('login')
        form = MarketImageForm(request.POST or None, request.FILES or None)  # TODO: add instance by ads
        if form.is_valid():
            form.author = request.user
            form.save(commit=True)
        return render(request, 'base.html', {'form': form})


# class guestMainView(LoginRequiredMixin, View):
#     @method_decorator(ensure_csrf_cookie)
#     def get(self, request, *args, **kwargs):
#         # cards = MarketImage.objects.all()
#         return render(request, 'base.html')