from django.views.generic import View, ListView
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core import serializers

import datetime
from django_tables2 import SingleTableMixin
from django_filters.views import FilterView

from .forms import MarketImageForm
from .models import MarketImage
from .tables import MarketImageTable
from .filters import MarketImageFilter


class MainView(View):

    def get_context_data(self, *args, **kwargs):
        context = {}
        if self.request.user.is_authenticated:
            context['is_auth'] = True
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
