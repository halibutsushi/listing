import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'listing.settings')
import django
django.setup()

from item_list.models import Goods
from django.db.models import Max, Min

qset = Goods.objects.filter(start_time__lt=100)
print(qset[0].date)
print(qset.aggregate(Min('date')))