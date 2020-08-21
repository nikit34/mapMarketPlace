import django_filters
from .models import MarketImage

class MarketImageFilter(django_filters.FilterSet):
    author = django_filters.CharFilter(lookup_expr='icontains')
    title = django_filters.CharFilter(lookup_expr='icontains')
    description = django_filters.CharFilter(lookup_expr='icontains')
    card_id = django_filters.CharFilter(lookup_expr='iexact')

    data_publish = django_filters.NumberFilter(field_name='data_publish', lookup_expr='mounth')
    data_publish__gt = django_filters.NumberFilter(field_name='data_publish', lookup_expr='mounth__gt')
    data_publish__lt = django_filters.NumberFilter(field_name='data_publish', lookup_expr='mounth__lt')

    timer = django_filters.NumberFilter(field_name='timer', lookup_expr='mounth')
    timer__gt = django_filters.NumberFilter(field_name='timer', lookup_expr='mounth__gt')
    timer__lt = django_filters.NumberFilter(field_name='timer', lookup_expr='mounth__lt')


    class Meta:
        model = MarketImage
        fields = {
            'author',
            'title',
            'description',
            'data_publish',
            'timer',
            'card_id',
        }
