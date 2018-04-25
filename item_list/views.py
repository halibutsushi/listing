from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from datetime import datetime

from django.views.generic import TemplateView
from django.db.models import Q

from item_list.models import Goods


class GoodsListAPI(GenericAPIView):

    def get(self, request, *args, **kwargs):
        error_msg = ''
        request_date = None
        start_hour = None
        end_hour = None
        company = None
        category = None
        if 'date' in request.GET:
            request_date = request.GET['date']
            if isinstance(request_date, str) and request_date.isdigit():
                request_date = int(request_date)
        else:
            error_msg += 'date parameter missing, '

        if 'start' in request.GET:
            start_hour = request.GET['start']
            if isinstance(start_hour, str) and start_hour.isdigit():
                start_hour = int(start_hour)
        else:
            error_msg += 'start parameter missing, '

        if 'end' in request.GET:
            end_hour = request.GET['end']
            if isinstance(end_hour, str) and end_hour.isdigit():
                end_hour = int(end_hour)
        else:
            error_msg += 'end parameter missing, '

        extra_filter = {}
        if 'category' in request.GET:
            if request.GET['category'] not in [None, 'all']:
                if request.GET['category'] != '':
                    extra_filter['cate1'] = request.GET['category']

        if 'company' in request.GET:
            if request.GET['company'] not in [None, ''] and not request.GET['company'].isspace():
                extra_filter['genre2'] = request.GET['company']

        date_error_msg = 'date must be date digit of length 8 (YYYYMMDD), '
        time_error_msg = ' must be hourly time digit of maximum length 2 (hh), '

        if not isinstance(request_date, int):
            error_msg += date_error_msg

        else:
            try:
                datetime.strptime(str(request_date), '%Y%m%d')
            except ValueError:
                error_msg += date_error_msg

        for name, val in [('start', start_hour), ('end', end_hour)]:
            if not isinstance(val, int):
                error_msg += name + time_error_msg
                continue

            if not 24 >= val >= 0:
                error_msg += name + time_error_msg

        if len(error_msg) > 0:
            return Response({'error_message':error_msg}, status=status.HTTP_400_BAD_REQUEST)

        ret = {'data':[]}

        if 'category' in request.GET and  request.GET['category'] == '':
            base_queryset = Goods.objects.filter(Q(cate1__isnull=True)|Q(cate1=""))
        else:
            base_queryset = Goods.objects.all()

        if len(extra_filter) > 0:
            base_queryset = base_queryset.filter(**extra_filter)

        for hour in reversed(range(start_hour, end_hour)):

            queryset = base_queryset.filter(date=request_date, start_time__gte=hour * 100,
                                            start_time__lt=(hour + 1) * 100).order_by('-start_time')

            time_val = request_date * 100 + hour

            company_goods_dict = {}
            company_order = []
            for item in queryset:
                if item.genre2 not in company_goods_dict:
                    company_order.append(item.genre2)
                    company_goods_dict[item.genre2] = list()

                company_goods_dict[item.genre2].append({'img': item.img,
                                                        'name': item.name,
                                                        'price': item.price,
                                                        'start_time': item.start_time,
                                                        'end_time': item.end_time})

            row = {'hour': time_val, 'companies':[]}
            for company in company_order:
                row['companies'].append({'company': company, 'goods': company_goods_dict[company]})

            ret['data'].append(row)
        return Response(ret)


class List(TemplateView):
    template_name = 'goods_list.html'
