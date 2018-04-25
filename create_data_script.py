import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'listing.settings')
import django
django.setup()

from item_list.models import Goods
from sklearn.externals import joblib


item_list = joblib.load('timeline_goods_dump.dat')
print(len(item_list))

for item in item_list:
    params = item.copy()
    del params['id']
    Goods.objects.update_or_create(id=item['id'], defaults=params)

print(len(Goods.objects.all()))
