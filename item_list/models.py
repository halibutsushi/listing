from django.db import models


class Goods(models.Model):
    name = models.CharField(max_length=256, null=False, blank=False)
    genre2 = models.CharField(max_length=128, null=False, blank=False)
    date = models.PositiveIntegerField()
    start_time = models.PositiveIntegerField()
    end_time = models.PositiveIntegerField()
    cate1 = models.CharField(max_length=128, null=True)
    url = models.URLField(max_length=2048)
    img = models.URLField(max_length=2048)
    price = models.PositiveIntegerField(null=False)
    org_price = models.PositiveIntegerField(null=False)
