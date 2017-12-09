# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.test import TestCase
from django.core.urlresolvers import reverse
from rest_framework.test import APIClient, APITestCase

from django.contrib.auth.models import User
from .models import Profile, Mentor, Major
from . import factories

# Create your tests here.

class CreateUserTest(APITestCase):
    create_url = reverse('users:create')

    def tearDown(self):
        User.objects.all().delete()
        Profile.objects.all().delete()

    def test_create_user_has_profile_and_user(self):
        user_params = {
            'email': 'test@ucla.edu',
            'password': 'password',
        }

        resp = self.client.post(
            self.create_url,
            data=user_params,
        )

        user = User.objects.get(email=user_params['email'])
        profile = Profile.objects.get(user=user)

        self.assertEqual(user.email, user_params['email'])

    def test_user_username_and_email_equal(self):
        user_params = {
            'email': 'test2@ucla.edu',
            'password': 'password',
        }

        resp = self.client.post(
            self.create_url,
            data=user_params,
        )

        user = User.objects.get(email=user_params['email'])
        self.assertEqual(user.email, user.username)

class VerifyUserTest(APITestCase):
    verify_url = reverse('users:verify')

    def setUp(self):
        self.profile = factories.ProfileFactory()
        self.client.force_authenticate(user=self.profile.user)

    def tearDown(self):
        User.objects.all().delete()
        Profile.objects.all().delete()

    def test_verify_only_accepts_correct_code(self):
        user_params = {
            'verification_code' : 'fake_code_',
        }

        resp = self.client.post(
            self.verify_url,
            data=user_params,
        )
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.verified, False)


    def test_verification_sets_verify_true(self):        
        user_params = {
            'verification_code' : self.profile.verification_code,
        }

        resp = self.client.post(
            self.verify_url,
            data=user_params,
        )
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.verified, True)

class OwnProfileViewTest(APITestCase):
    own_profile_url = reverse('users:me')
    def setUp(self):
        self.profile = factories.ProfileFactory()
        self.client.force_authenticate(user=self.profile.user)

    def tearDown(self):
        User.objects.all().delete()
        Profile.objects.all().delete()

    def test_own_profile_returns_own_profile(self):
        resp = self.client.get(self.own_profile_url)
        self.assertEqual(self.profile.user.email, resp.data['email'])

    def test_edit_user_fields(self):
        data = {
            'first_name': 'fake',
            'last_name': 'name',
            'email': 'fakename@example.com',
        }
        resp = self.client.patch(self.own_profile_url, data=data)
        for field, val in data.items():
            self.assertEqual(val, resp.data[field])


class MentorsSearchTest(APITestCase):
    mentors_search_url = reverse('users:mentors_search')
    def setUp(self):
        self.major = factories.MajorFactory(name='Test Major')
        self.mentor = factories.MentorFactory(major=self.major)
        self.client.force_authenticate(user=self.mentor.profile.user)

    def tearDown(self):
        User.objects.all().delete()
        Major.objects.all().delete()

    def test_correct_major_name_filtering(self):
        resp = self.client.get(
            self.mentors_search_url,
            data={
                'major': self.major.name,
            },
        )

        self.assertEqual(resp.data['count'], 1)
        self.assertEqual(resp.data['results'][0]['major']['name'], self.mentor.major.name)

    def test_incorrect_major_name_filtering(self):
        resp = self.client.get(
            self.mentors_search_url,
            data={
                'major': self.mentor.major.name + 'wonrg',
            },
        )

        self.assertEqual(resp.data['count'], 0)

class MentorsUpdateTest(APITestCase):
    mentors_update_url = reverse('users:mentors_me')
    def setUp(self):
        self.mentor = factories.MentorFactory()
        self.client.force_authenticate(user=self.mentor.profile.user)
    
    def tearDown(self):
        User.objects.all().delete()
        Major.objects.all().delete()

    def test_set_mentor_as_inactive(self):
        user_params = {
            'active' : False,
        }

        resp = self.client.patch(
            self.mentors_update_url,
            data=user_params,
        )
        self.mentor.refresh_from_db()
        self.assertEqual(self.mentor.active, False)
        
    def test_set_mentor_as_active(self):
        resp = self.client.post(
            self.mentors_update_url,
        )
        self.mentor.refresh_from_db()
        self.assertEqual(self.mentor.active, True)

class CreateMentorTest(APITestCase):
    mentors_create_url = reverse('users:mentors_me')
    def setUp(self):
        self.profile = factories.ProfileFactory()
        self.client.force_authenticate(user=self.profile.user)
    
    def tearDown(self):
        User.objects.all().delete()
        Major.objects.all().delete()

    def test_create_mentor(self):
        self.assertEqual(Mentor.objects.filter(profile = self.profile).exists(), False)
        resp = self.client.post(
            self.mentors_create_url,
        )
        self.assertEqual(Mentor.objects.filter(profile = self.profile).exists(), True)

    def test_makes_existing_mentor_active(self):
        mentor = factories.MentorFactory(profile=self.profile, active=False)
        resp = self.client.post(
            self.mentors_create_url,
        )
        mentor.refresh_from_db()
        self.assertTrue(mentor.active)

class FindMentorByIDTest(APITestCase):
    def setUp(self):
        self.mentor = factories.MentorFactory()
        self.client.force_authenticate(user=self.mentor.profile.user)
    
    def tearDown(self):
        User.objects.all().delete()
        Major.objects.all().delete()

    def test_find_mentor_by_id(self):
        resp = self.client.get(
            reverse('users:mentor',kwargs={'mentor_id':self.mentor.id}),
        )
        self.assertEqual(resp.data['id'], self.mentor.id)

    def test_404_if_mentor_with_id_does_not_exist(self):
        resp = self.client.get(
            reverse('users:mentor',kwargs={'mentor_id': self.mentor.id + 100000000}), #100000000 is to force an invalid mentor ID
        )
        self.assertEqual(resp.status_code, 404)
