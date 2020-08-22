import django_filters
from .models import MarketImage

class MarketImageFilter(django_filters.FilterSet):
    author = django_filters.CharFilter(lookup_expr='icontains')
    title = django_filters.CharFilter(lookup_expr='icontains')
    description = django_filters.CharFilter(lookup_expr='icontains')
    card_id = django_filters.CharFilter(lookup_expr='iexact')

    class Meta:
        model = MarketImage
        fields = {
            'author',
            'title',
            'description',
            'card_id',
        }
