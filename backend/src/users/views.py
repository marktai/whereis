# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import random, string, re

from django.shortcuts import render, get_object_or_404

# Create your views here.

from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser

from django.contrib.auth.models import User, Group
from django.db import transaction
from django.conf import settings

from .models import Profile
from .serializers import (
    UserSerializer, ProfileSerializer,
)

import sendgrid
from sendgrid.helpers.mail import Email, Content, Substitution, Mail

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

class CreateUser(generics.CreateAPIView):
    """
    API endpoint that allows a user to be created.
    """
    permission_classes = tuple()
    
    @transaction.atomic
    def post(self, request):
        if User.objects.filter(email=request.data['email']).exists():
            raise ValidationError({'error': 'Email already registered'})

        new_user = User.objects.create_user(
            username=request.data['email'],
            email=request.data['email'],
            password=request.data['password'],
            first_name=request.data.get('first_name', ''),
            last_name=request.data.get('last_name', ''),
        )

        check = re.search(r'[\w.]+\@(g.)?ucla.edu', new_user.email)
        if check is None:
            raise ValidationError({'error': 'Invalid UCLA email'})

        new_profile = Profile(
            user=new_user,
            verification_code = Profile.generate_verification_code(),
        )

        new_profile.save()
        
        url = "https://bquest.ucladevx.com/verify?code="
        if settings.DEBUG:
            url = "http://localhost:8000/users/verify?code="

        #TODO: Use Sendgrid Templates
        from_email =  Email("no_reply@bquest.ucladevx.com")
        to_email = Email(new_user.email)
        subject = "Pick a Brain with PickMyBruin!"
        content = Content("text/html", 
                    "\n".join([
                            "Thank you for joining BQuest! We are happy you are here! Click the link below to verify that you are a UCLA student, and create your profile.",
                            "You will be receiving emails from us, so make sure to update your address on your profile, if you prefer to use another email.",
                            url+ new_profile.verification_code,
                            "If you have any questions, feel free to contact us on bquest.ucla@gmail.com.",
                            ])
                        )
        mail = Mail(from_email, subject, to_email, content)
        sg = sendgrid.SendGridAPIClient(apikey=settings.SENDGRID_API_KEY)
        response = sg.client.mail.send.post(request_body=mail.get())

        return Response(ProfileSerializer(new_profile).data)
        
class VerifyUser(APIView):
    """
    API endpoint that verifies a user based on profile_id and associated verification code.
    """
    def post(self, request):
        profile_id = self.request.user.profile.id
        profile = get_object_or_404(Profile, id=profile_id)
        if request.data['verification_code'] == profile.verification_code:
            profile.verified = True
            profile.save()
        return Response({'profile_id': profile_id})


class OwnProfileView(generics.RetrieveUpdateDestroyAPIView):
    """
    View to retrieve, update, or destroy the logged in user
    """
    parser_classes = generics.RetrieveUpdateDestroyAPIView.parser_classes + [MultiPartParser]
    serializer_class = ProfileSerializer
    def get_object(self):
        return get_object_or_404(Profile, user=self.request.user)


