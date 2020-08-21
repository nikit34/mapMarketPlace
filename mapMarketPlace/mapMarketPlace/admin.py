from django.contrib import admin
from .models import MarketImage


class MarketImageAdmin(admin.ModelAdmin):
    list_display = ('author', 'title', 'card_id')
    readonly_fields = ('image_preview',)

    def show_preview(self, obj):
        return obj.image_preview

    show_preview.short_description = 'Image preview'
    show_preview.allow_tags = True


admin.site.register(MarketImage, MarketImageAdmin)
