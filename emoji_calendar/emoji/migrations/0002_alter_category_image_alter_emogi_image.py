# Generated by Django 5.1.6 on 2025-02-27 12:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('emoji', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='image',
            field=models.ImageField(unique=True, upload_to='category/'),
        ),
        migrations.AlterField(
            model_name='emogi',
            name='image',
            field=models.ImageField(unique=True, upload_to='emoji/'),
        ),
    ]
