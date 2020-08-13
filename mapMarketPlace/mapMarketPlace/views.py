from django.views import View
from django.shortcuts import render


class MainView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'base_generic.html', {})