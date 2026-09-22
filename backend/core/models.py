import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        FREELANCER = "freelancer", "Freelancer"
        BUSINESS = "business", "Small Business"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.FREELANCER)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email or self.username


class Client(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="clients")
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    company = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Project(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        COMPLETED = "completed", "Completed"
        ARCHIVED = "archived", "Archived"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="projects")
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Meeting(models.Model):
    class Platform(models.TextChoices):
        TEAMS = "teams", "Microsoft Teams"
        ZOOM = "zoom", "Zoom"
        SKYPE = "skype", "Skype"

    class Status(models.TextChoices):
        SCHEDULED = "scheduled", "Scheduled"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="meetings")
    scheduled_at = models.DateTimeField()
    platform = models.CharField(max_length=20, choices=Platform.choices)
    meeting_link = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SCHEDULED)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project.title} @ {self.scheduled_at:%Y-%m-%d %H:%M}"


class Transcript(models.Model):
    class ProcessingStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        PROCESSING = "processing", "Processing"
        COMPLETE = "complete", "Complete"
        FAILED = "failed", "Failed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    meeting = models.OneToOneField(Meeting, on_delete=models.CASCADE, related_name="transcript")
    file = models.FileField(upload_to="transcripts/")
    raw_text = models.TextField(blank=True)
    processing_status = models.CharField(
        max_length=20, choices=ProcessingStatus.choices, default=ProcessingStatus.PENDING
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transcript for {self.meeting}"


class ScopeOfTruth(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transcript = models.OneToOneField(
        Transcript, on_delete=models.CASCADE, related_name="scope_of_truth"
    )
    summary = models.TextField(blank=True)
    key_points = models.JSONField(default=list, blank=True)
    confirmed_by_user = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Scope of Truth for {self.transcript}"


class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        FAILED = "failed", "Failed"
        REFUNDED = "refunded", "Refunded"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    provider_ref = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project.title} - {self.amount} ({self.status})"
