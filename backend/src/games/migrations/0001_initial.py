# Generated by Django 4.0.4 on 2024-04-01 05:14

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_time', models.DateTimeField(auto_now_add=True)),
                ('latitude', models.DecimalField(decimal_places=17, max_digits=17)),
                ('longitude', models.DecimalField(decimal_places=17, max_digits=17)),
                ('client_timestamp', models.DateTimeField()),
                ('battery', models.FloatField(blank=True, null=True)),
                ('raw_json', models.JSONField()),
            ],
        ),
    ]
