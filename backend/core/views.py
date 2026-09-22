from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Client, Meeting, Payment, Project, ScopeOfTruth, Transcript
from .serializers import (
    ClientSerializer,
    MeetingSerializer,
    PaymentSerializer,
    ProjectSerializer,
    ScopeOfTruthSerializer,
    SignupSerializer,
    TranscriptSerializer,
    UserSerializer,
)

User = get_user_model()


class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = SignupSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        )


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerializer

    def get_queryset(self):
        return Client.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MeetingViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingSerializer

    def get_queryset(self):
        return Meeting.objects.filter(project__user=self.request.user)


class TranscriptViewSet(viewsets.ModelViewSet):
    serializer_class = TranscriptSerializer

    def get_queryset(self):
        return Transcript.objects.filter(meeting__project__user=self.request.user)


class ScopeOfTruthViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ScopeOfTruthSerializer

    def get_queryset(self):
        return ScopeOfTruth.objects.filter(transcript__meeting__project__user=self.request.user)


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer

    def get_queryset(self):
        return Payment.objects.filter(project__user=self.request.user)
