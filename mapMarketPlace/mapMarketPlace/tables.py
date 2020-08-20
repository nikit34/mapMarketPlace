import django_tables2 as tables
from .models import MarketImage

class MarketImageTable(tables.Table):
    class Meta:
        model = MarketImage
        template_name = "django_tables2/bootstrap4.html"
        fields = (
            'author',
            'title',
            'description',
            'image',
            'timer',
            'data_publish',
            'card_id'
        )