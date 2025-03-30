from django.contrib import admin
from django.db.models import Max, Min, Avg
from .models import Property, Wishlist

class PropertyAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "seller", "price", "property_type", "created_at")
    search_fields = ("name", "location", "description")
    list_filter = ("property_type", ("created_at", admin.DateFieldListFilter))
    change_list_template = "admin/properties_change_list.html"
    read_only_fields = ("seller",)

    def save_model(self, request, obj, form, change):
        if not change and not obj.seller:
            # Automatically assign the seller as the current user (admin)
            obj.seller = request.user
        super().save_model(request, obj, form, change)

admin.site.register(Property, PropertyAdmin)
admin.site.register(Wishlist)
