# Generated by Django 5.1.6 on 2025-03-01 07:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('emoday', '0002_calendar_user_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='calendar',
            old_name='emoji_id',
            new_name='emoji',
        ),
        migrations.RenameField(
            model_name='calendar',
            old_name='user_id',
            new_name='user',
        ),
    ]
