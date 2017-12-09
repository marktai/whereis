from rest_framework import serializers
from drf_writable_nested import WritableNestedModelSerializer

from django.contrib.auth.models import User, Group
from .models import Profile, Major, Mentor


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')

    def save(self, *args, **kwargs):
        if 'email' in self.validated_data:
            self.validated_data['username'] = self.validated_data['email']
        super().save(*args, **kwargs)


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name')
        read_only_fields = ('id',)


class ProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.CharField(source='user.email')

    class Meta:
        model = Profile

        fields = ('id', 'first_name', 'last_name', 'email', 'year', 'verified', 'picture')
        read_only_fields = ('id', 'verified')

    def update(self, instance, validated_data):
        if 'user' in validated_data:
            user_data = validated_data.pop('user')
            for field, val in user_data.items():
                setattr(instance.user, field, val)
            instance.user.save()
        return super().update(instance, validated_data)


class MajorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Major
        fields = ('id', 'name')
        read_only_fields = ('id',)


class MentorSerializer(WritableNestedModelSerializer):
    profile = ProfileSerializer()
    major = MajorSerializer()
    class Meta:
        model = Mentor
        fields = ('id', 'profile', 'active', 'major', 'bio', 'gpa', 'clubs', 'classes', 'pros', 'cons',)
        read_only_fields = ('id',)

