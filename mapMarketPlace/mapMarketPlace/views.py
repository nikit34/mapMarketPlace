from django.views.generic import View
from django.shortcuts import render, redirect
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required

from .forms import MarketImageForm
from .models import MarketImage


class authMainView(View):

    def get_context_data(self, *args, **kwargs):
        context = {}
        if self.request.user.is_authenticated:
            context['is_auth'] = True
        else:
            context['is_auth'] = False
        return context

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        context = self.get_context_data(*args, **kwargs)
        context['cards'] = MarketImage.objects.all()
        return render(request, 'base.html', context=context)

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        context = self.get_context_data(*args, **kwargs)
        form = MarketImageForm(request.POST or None, request.FILES or None)  # TODO: add instance by ads
        if form.is_valid():
            form.author = request.user
            form.save(commit=True)
        context['form'] = form
        return redirect('main')


# class guestMainView(LoginRequiredMixin, View):
#     @method_decorator(ensure_csrf_cookie)
#     def get(self, request, *args, **kwargs):
#         # cards = MarketImage.objects.all()
#         return render(request, 'base.html')