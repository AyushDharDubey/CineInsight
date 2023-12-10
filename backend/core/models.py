from django.db import models

class Movie(models.Model):
    id = models.CharField(max_length=16, primary_key=True)
    name = models.CharField(max_length=256)
    image = models.CharField(max_length=512)
    description = models.CharField(max_length=512)
    review_title = models.CharField(max_length=256)
    review_body = models.CharField(max_length=2048)
    rating = models.FloatField()
#    platforms = models.CharField(max_length=256)
    release_date = models.CharField(max_length=12)
    content_rating = models.CharField(max_length=8)
    trailer = models.CharField(max_length=128)
    duration = models.CharField(max_length=8)
    tags = models.CharField(max_length=256)
    language = models.CharField(max_length=64)
    genre = models.CharField(max_length=64)
