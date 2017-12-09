import factory
from django.contrib.auth.models import User
from . import models

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    email = factory.LazyAttribute(lambda a: '{0}.{1}@example.com'.format(a.first_name, a.last_name).lower())
    username = factory.LazyAttribute(lambda a: a.email)

class ProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Profile
    user = factory.SubFactory(UserFactory)
    verification_code = factory.LazyAttribute(lambda a: models.Profile.generate_verification_code())

class MajorFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Major

class MentorFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Mentor
    profile = factory.SubFactory(ProfileFactory)
    major = factory.SubFactory(MajorFactory)
    active = True

