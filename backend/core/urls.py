from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

router = DefaultRouter()
router.register(r"clients", views.ClientViewSet, basename="client")
router.register(r"projects", views.ProjectViewSet, basename="project")
router.register(r"meetings", views.MeetingViewSet, basename="meeting")
router.register(r"transcripts", views.TranscriptViewSet, basename="transcript")
router.register(r"scope-of-truth", views.ScopeOfTruthViewSet, basename="scope-of-truth")
router.register(r"payments", views.PaymentViewSet, basename="payment")

urlpatterns = [
    path("auth/signup/", views.SignupView.as_view(), name="signup"),
    path("auth/login/", TokenObtainPairView.as_view(), name="login"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/me/", views.MeView.as_view(), name="me"),
    path("", include(router.urls)),
]
