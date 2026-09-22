from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import Client, Meeting, Payment, Project, ScopeOfTruth, Transcript, User


class UserAdmin(DjangoUserAdmin):
    fieldsets = DjangoUserAdmin.fieldsets + ((None, {"fields": ("role",)}),)
    list_display = ("username", "email", "role", "is_staff")


admin.site.register(User, UserAdmin)
admin.site.register(Client)
admin.site.register(Project)
admin.site.register(Meeting)
admin.site.register(Transcript)
admin.site.register(ScopeOfTruth)
admin.site.register(Payment)
