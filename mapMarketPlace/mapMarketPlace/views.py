from django.views.generic import View, ListView
from django.shortcuts import render, redirect
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core import serializers
from django.views.generic.detail import SingleObjectMixin

import datetime
from django_tables2 import SingleTableMixin
from django_filters.views import FilterView

from .forms import MarketImageForm, RegisterForm
from .models import MarketImage
from .tables import MarketImageTable
from .filters import MarketImageFilter


class RegisterView(View):
    def get(self, request, *args, **kwargs):
        form = RegisterForm()
        context = {'form': form}
        return render(request, 'register.html', context=context)

    def post(self, request, *args, **kwargs):
        form = RegisterForm(request.POST or None)
        context = {'form': form}
        if form.is_valid():
            form.save()
            return redirect('main')
        return render(request, 'register.html', context=context)


class MainView(View):

    def get_context_data(self, *args, **kwargs):
        context = {}
        if self.request.user.is_authenticated:
            context['is_auth'] = self.request.user.email
        else:
            context['is_auth'] = False
        board_date = datetime.date.today() - datetime.timedelta(days=1)
        data = MarketImage.objects.filter(timer__gte=board_date)
        context['cards'] = serializers.serialize('json', data)
        return context

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        context = self.get_context_data(*args, **kwargs)
        return render(request, 'main.html', context=self.get_context_data(*args, **kwargs))

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        form = MarketImageForm(request.POST or None, request.FILES or None)
        if form.is_valid():
            form.author = request.user
            form.save(commit=True)
        return render(request, 'main.html', context=self.get_context_data(self, *args, **kwargs))


class BuildboardsView(LoginRequiredMixin, SingleTableMixin, FilterView):
    model = MarketImage
    table_class = MarketImageTable
    template_name = 'buildboards.html'
    filterset_class = MarketImageFilter


class TemplatesListView(LoginRequiredMixin, ListView):
    model = MarketImage
    template_name = 'templates.html'
    paginate_by = 10
    context_object_name = "cards"

    def get_queryset(self):
        return MarketImage.objects.filter(
            author=self.request.user
        ).order_by('-timer').select_related('author')

    def get_context_data(self, *args, **kwargs):
        context = super(TemplatesListView, self).get_context_data(*args, **kwargs)
        board_date = datetime.date.today() - datetime.timedelta(days=1)
        ordering_dates = MarketImage.objects.only('timer').order_by('timer').values('timer')
        i = 0
        while board_date > ordering_dates[i]['timer'].date():
            i += 1
        context['nearest_date'] = ordering_dates[i]['timer'].date() - board_date
        return context
