from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Client, Meeting, Payment, Project, ScopeOfTruth, Transcript

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "role"]


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "email", "username", "password", "first_name", "last_name", "role"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ["id", "name", "email", "company", "phone", "created_at"]
        read_only_fields = ["id", "created_at"]


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "client", "title", "status", "created_at"]
        read_only_fields = ["id", "created_at"]


class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = ["id", "project", "scheduled_at", "platform", "meeting_link", "status", "created_at"]
        read_only_fields = ["id", "created_at"]


class TranscriptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transcript
        fields = ["id", "meeting", "file", "raw_text", "processing_status", "uploaded_at"]
        read_only_fields = ["id", "processing_status", "uploaded_at"]


class ScopeOfTruthSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScopeOfTruth
        fields = ["id", "transcript", "summary", "key_points", "confirmed_by_user", "created_at"]
        read_only_fields = ["id", "summary", "key_points", "created_at"]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "project", "amount", "status", "provider_ref", "created_at"]
        read_only_fields = ["id", "status", "provider_ref", "created_at"]
