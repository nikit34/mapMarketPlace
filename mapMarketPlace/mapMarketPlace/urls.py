from django.contrib import admin
from django.urls import path, include


from .views import MainView

urlpatterns = [
    path('main/', MainView.as_view(), name='main'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('admin/', admin.site.urls),
]
