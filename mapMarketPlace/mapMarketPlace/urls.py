from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

from .views import MainView, BuildboardsView, TemplatesListView, RegisterView


urlpatterns = [
    path('', RedirectView.as_view(url='/main')),
    path('main/', MainView.as_view(), name='main'),
    path('buildboards/', BuildboardsView.as_view(), name='buildboards'),
    path('templates/', TemplatesListView.as_view(), name='templates'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('register/', RegisterView.as_view(), name='register'),
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)