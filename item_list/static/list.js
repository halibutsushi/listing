
var  $goods_table = $("#goods_list");

function loadTable() {
    var $date_input = $('input[name="date"]'),
        target_date = null || $date_input.val(),
        company = null || $('input[name="company_val"]').val().trim(),
        $last_row = $('#goods_list > tbody:last-child'),
        category = null || $('input[name="category_val"]').val().trim(),
        api_get_param = {},
        date_obj;

    if(target_date == null){
        date_obj = new Date();
    }
    else{
        date_obj = new Date(target_date);
        date_obj.setHours(0);

    }

    var current_date = new Date(),
    current_date_val = current_date.getFullYear() * 100000000 + (current_date.getMonth() + 1) * 1000000
    + current_date.getDate() * 10000 + current_date.getHours() * 100 + current_date.getMinutes();

    var dd = date_obj.getDate();
    var mm = date_obj.getMonth()+1; //January is 0!
    var yyyy = date_obj.getFullYear();

    api_get_param['date'] = yyyy * 10000 + mm * 100 + dd;
    $date_input.val('' + yyyy + '-' + mm + '-' + dd);

    api_get_param['start'] = date_obj.getHours();
    api_get_param['end'] = api_get_param['start'] + 4;
    api_get_param['category'] = category;
    api_get_param['company'] = company;

    var num_item_shown = 0;
    while(num_item_shown < 10){

        $.ajax({
                type: "GET",
                data: api_get_param,
                url: '/goods/',
                dataType: "json",
                async: false,
                success: function ( ret, status, jqXHR ) {

                    var data = ret['data'];
                    $goods_table.find("tr:gt(0)").remove();

                    $.each(data, function(index, hour_data) {

                        if (num_item_shown < 10){
                            $last_row.append('<tr class="hour shown"><td colspan="7">'+ hour_data['hour'] + '</td></tr>');
                            num_item_shown += 1;
                        }
                        else {
                            $last_row.append('<tr class="hour down_hidden" style="display: none;"><td colspan="7">'+ hour_data['hour'] + '</td></tr>');
                        }

                        $.each(hour_data['companies'], function(index2, value) {
                            var selection = '<td><select class="form-control goods_item">',
                                images = '<td>',
                                price = '<td>',
                                start_time = '<td>',
                                end_time = '<td>',
                                status = '<td>';
                            if (value['goods'].length > 0){
                                $.each(value['goods'], function(index3, goods_value) {
                                    var status_val,
                                    start_time_val = ((hour_data['hour'] / 100) >> 0) * 10000 + goods_value['start_time'],
                                    end_time_val = ((hour_data['hour'] / 100) >> 0) * 10000 + goods_value['end_time'];

                                    if (goods_value['end_time'] < 100){
                                        end_time_val + 10000;
                                    }

                                    if (start_time_val <= current_date_val && current_date_val <= end_time_val){
                                        status_val = '방송중';
                                    }
                                    else if (start_time_val > current_date_val){
                                        status_val = '방송예정';
                                    }
                                    else{
                                        status_val = '방송종료';
                                    }
                                    if(index3 == 0){
                                        selection = selection + '<option value="' + (index3 + 1) + '" selected>' + goods_value['name']
                                        + '</option>';
                                        images = images + '<div><img src="' + goods_value['img'] + '" height="50" width="50"></div>';
                                        price = price + '<div>' + goods_value['price'] + '</div>';
                                        start_time = start_time + '<div>' + goods_value['start_time'] + '</div>';
                                        end_time = end_time + '<div>' + goods_value['end_time'] + '</div>';
                                        status = status + '<div>' + status_val + '</div>';
                                    }
                                    else{
                                        selection = selection + '<option value="' + (index3 + 1) + '" value="index3" selected>'
                                        + goods_value['name'] + '</option>';
                                        images = images + '<div style="display: none;"><img src="' + goods_value['img']
                                        + '" height="50" width="50"></div>';
                                        price = price + '<div style="display: none;">' + goods_value['price'] + '</div>';
                                        start_time = start_time + '<div style="display: none;">'
                                        + goods_value['start_time'] + '</div>';
                                        end_time = end_time + '<div style="display: none;">'
                                        + goods_value['end_time'] + '</div>';
                                        status = status + '<div style="display: none;">' + status_val + '</div>';
                                    }

                                });

                                images += '</td>';
                                selection += '</select></td>';
                                price += '</td>';
                                start_time += '</td>';
                                end_time += '</td>';
                                var row;

                                if (num_item_shown < 10){
                                    row = '<tr class="shown"><td>';
                                    num_item_shown += 1;
                                }
                                else {
                                    row = '<tr class="down_hidden" style="display: none;"><td>';
                                }

                                row = row + value['company'] + '</td>' + images + selection
                                + price + start_time + end_time + status + '</tr>';

                                $last_row.append(row);
                            }
                            else{
                                var row;
                                if (num_item_shown < 10){
                                    row = '<tr class="shown"><td>';
                                    num_item_shown += 1;
                                }
                                else {
                                    row = '<tr class="down_hidden" style="display: none;"><td>';
                                }
                                row = row + '<tr class="shown"><td>' + value['company'] + '</td><td><img src="'
                                + value['goods'][0]['img'] + '" height="50" width="50"></td><td><div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">'
                                + value['goods'][0]['name'] + '</div></td><td>'
                                + value['goods'][0]['price'] + '</td><td>'
                                + value['goods'][0]['start_time'] + '</td><td>'
                                + value['goods'][0]['end_time'] + '</td><td>';
                                + status_val + '</td></tr>';
                                $last_row.append(row);
                            }


                        });
                    });

                },
                error: function( xhr, status, thrown ) {
                }
            });

        date_obj.setHours(date_obj.getHours() - 4);

        dd = date_obj.getDate();
        mm = date_obj.getMonth()+1; //January is 0!
        yyyy = date_obj.getFullYear();

        api_get_param['date'] = yyyy * 10000 + mm * 100 + dd;
        api_get_param['start'] = date_obj.getHours();
        api_get_param['end'] = api_get_param['start'] + 4;
        api_get_param['category'] = category;
        api_get_param['company'] = company;

    }
}

function loadUp() {
    var company = null || $('input[name="company_val"]').val().trim(),
        $first_row = $('#goods_list tr.shown:first'),
        $latest_hour_row = $('tr.hour').first(),
        latest_hour = parseInt($latest_hour_row.text()),
        category = null || $('input[name="category_val"]').val().trim(),
        api_get_param = {},
        date_obj = new Date();

    date_obj.setFullYear((latest_hour / 1000000) >> 0);
    date_obj.setMonth((((latest_hour % 1000000) / 10000) >> 0) - 1);
    date_obj.setDate(((latest_hour % 10000) / 100) >> 0);
    date_obj.setHours(latest_hour % 100);
    date_obj.setHours(date_obj.getHours() + 1);

    var current_date = new Date(),
    current_date_val = current_date.getFullYear() * 100000000 + (current_date.getMonth() + 1) * 1000000
    + current_date.getDate() * 10000 + current_date.getHours() * 100 + current_date.getMinutes();

    var dd = date_obj.getDate();
    var mm = date_obj.getMonth()+1; //January is 0!
    var yyyy = date_obj.getFullYear();

    api_get_param['date'] = yyyy * 10000 + mm * 100 + dd;
    api_get_param['start'] = date_obj.getHours();
    api_get_param['end'] = api_get_param['start'] + 4;
    api_get_param['category'] = category;
    api_get_param['company'] = company;

    $.ajax({
            type: "GET",
            data: api_get_param,
            url: '/goods/',
            dataType: "json",
            async: false,
            success: function ( ret, status, jqXHR ) {

                var data = ret['data'];
                $.each(data, function(index, hour_data) {
                    $('<tr class="hour up_hidden" style="display: none;"><td colspan="7">'
                    + hour_data['hour'] + '</td></tr>').insertBefore($first_row);
                    $.each(hour_data['companies'], function(index2, value) {
                        var selection = '<td><select class="form-control goods_item">',
                            images = '<td>',
                            price = '<td>',
                            start_time = '<td>',
                            end_time = '<td>',
                            status = '<td>';
                        if (value['goods'].length > 0){
                            $.each(value['goods'], function(index3, goods_value) {
                                var status_val,
                                start_time_val = ((hour_data['hour'] / 100) >> 0) * 10000 + goods_value['start_time'],
                                end_time_val = ((hour_data['hour'] / 100) >> 0) * 10000 + goods_value['end_time'];

                                if (goods_value['end_time'] < 100){
                                    end_time_val + 10000;
                                }

                                if (start_time_val <= current_date_val && current_date_val <= end_time_val){
                                    status_val = '방송중';
                                }
                                else if (start_time_val > current_date_val){
                                    status_val = '방송예정';
                                }
                                else{
                                    status_val = '방송종료';
                                }
                                if(index3 == 0){
                                    selection = selection + '<option value="' + (index3 + 1) + '" selected>' + goods_value['name']
                                    + '</option>';
                                    images = images + '<div><img src="' + goods_value['img'] + '" height="50" width="50"></div>';
                                    price = price + '<div>' + goods_value['price'] + '</div>';
                                    start_time = start_time + '<div>' + goods_value['start_time'] + '</div>';
                                    end_time = end_time + '<div>' + goods_value['end_time'] + '</div>';
                                    status = status + '<div>' + status_val + '</div>';
                                }
                                else{
                                    selection = selection + '<option value="' + (index3 + 1) + '" value="index3" selected>'
                                    + goods_value['name'] + '</option>';
                                    images = images + '<div style="display: none;"><img src="' + goods_value['img']
                                    + '" height="50" width="50"></div>';
                                    price = price + '<div style="display: none;">' + goods_value['price'] + '</div>';
                                    start_time = start_time + '<div style="display: none;">'
                                    + goods_value['start_time'] + '</div>';
                                    end_time = end_time + '<div style="display: none;">'
                                    + goods_value['end_time'] + '</div>';
                                    status = status + '<div style="display: none;">' + status_val + '</div>';
                                }

                            });

                            images += '</td>';
                            selection += '</select></td>';
                            price += '</td>';
                            start_time += '</td>';
                            end_time += '</td>';
                            var row = '<tr class="up_hidden" style="display: none;"><td>' + value['company'] + '</td>'
                            + images + selection
                            + price + start_time + end_time + status + '</tr>';
                            $(row).insertBefore($first_row);

                        }
                        else{
                            var row = '<tr class="up_hidden" style="display: none;"><td>' + value['company'] + '</td><td><img src="'
                            + value['goods'][0]['img'] + '" height="50" width="50"></td><td><div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">'
                            + value['goods'][0]['name'] + '</div></td><td>'
                            + value['goods'][0]['price'] + '</td><td>'
                            + value['goods'][0]['start_time'] + '</td><td>'
                            + value['goods'][0]['end_time'] + '</td><td>';
                            + status_val + '</td></tr>';
                            $(row).insertBefore($first_row);
                        }


                    });
                });
                var last_added = $('tr.up_hidden').last();
                last_added.show();
                last_added.toggleClass('up_hidden shown');
                var last_show = $goods_table.find('tr.shown').last();
                last_show.hide();
                last_show.toggleClass('shown down_hidden ');

            },
            error: function( xhr, status, thrown ) {
            }
        });

    var $date_input = $('input[name="date"]'),
        $latest_hour_shown_row = $('tr.hour.shown').first(),
        $earliest_hour_shown_row = $('tr.hour.shown').last(),
        latest_hour_shown = parseInt($latest_hour_shown_row.text()),
        earliest_hour_shown = parseInt($earliest_hour_shown_row.text());

    date_obj.setFullYear((earliest_hour_shown / 1000000) >> 0);
    date_obj.setMonth((((earliest_hour_shown % 1000000) / 10000) >> 0) - 1);
    date_obj.setDate(((earliest_hour_shown % 10000) / 100) >> 0);
    date_obj.setHours(earliest_hour_shown % 100);
    date_obj.setHours(date_obj.getHours() - (date_obj.getHours() % 4) - 4)

    dd = date_obj.getDate();
    mm = date_obj.getMonth()+1; //January is 0!
    yyyy = date_obj.getFullYear();

    var keep_cut_line =  yyyy * 1000000 + mm * 10000 + dd * 100 + date_obj.getHours();
    $('tr.hour.down_hidden:contains("' + keep_cut_line + '")').nextAll('tr').remove();

    $date_input.val('' + ((latest_hour_shown / 1000000) >> 0) + '-' + (((latest_hour_shown % 1000000) / 10000) >> 0)
    + '-' + (((latest_hour_shown % 10000) / 100) >> 0));
}


function loadDown() {
    var company = null || $('input[name="company_val"]').val().trim(),
        $last_row = $('#goods_list > tbody:last-child'),
        $earliest_hour_row = $('tr.hour').last(),
        earliest_hour = parseInt($earliest_hour_row.text()),
        category = null || $('input[name="category_val"]').val().trim(),
        api_get_param = {},
        date_obj = new Date();

    date_obj.setFullYear((earliest_hour / 1000000) >> 0);
    date_obj.setMonth((((earliest_hour % 1000000) / 10000) >> 0) - 1);
    date_obj.setDate(((earliest_hour % 10000) / 100) >> 0);
    date_obj.setHours(earliest_hour % 100);
    date_obj.setHours(date_obj.getHours() - 4);

    var current_date = new Date(),
    current_date_val = current_date.getFullYear() * 100000000 + (current_date.getMonth() + 1) * 1000000
    + current_date.getDate() * 10000 + current_date.getHours() * 100 + current_date.getMinutes();

    var dd = date_obj.getDate();
    var mm = date_obj.getMonth()+1; //January is 0!
    var yyyy = date_obj.getFullYear();

    api_get_param['date'] = yyyy * 10000 + mm * 100 + dd;
    api_get_param['start'] = date_obj.getHours();
    api_get_param['end'] = api_get_param['start'] + 4;
    api_get_param['category'] = category;
    api_get_param['company'] = company;

    $.ajax({
            type: "GET",
            data: api_get_param,
            url: '/goods/',
            dataType: "json",
            async: false,
            success: function ( ret, status, jqXHR ) {

                var data = ret['data'];
                $.each(data, function(index, hour_data) {
                    $last_row.append('<tr class="hour down_hidden" style="display: none;"><td colspan="7">'
                    + hour_data['hour'] + '</td></tr>');
                    $.each(hour_data['companies'], function(index2, value) {
                        var selection = '<td><select class="form-control goods_item">',
                            images = '<td>',
                            price = '<td>',
                            start_time = '<td>',
                            end_time = '<td>',
                            status = '<td>';
                        if (value['goods'].length > 0){

                            $.each(value['goods'], function(index3, goods_value) {
                                var status_val,
                                start_time_val = ((hour_data['hour'] / 100) >> 0) * 10000 + goods_value['start_time'],
                                end_time_val = ((hour_data['hour'] / 100) >> 0) * 10000 + goods_value['end_time'];

                                if (goods_value['end_time'] < 100){
                                    end_time_val + 10000;
                                }

                                if (start_time_val <= current_date_val && current_date_val <= end_time_val){
                                    status_val = '방송중';
                                }
                                else if (start_time_val > current_date_val){
                                    status_val = '방송예정';
                                }
                                else{
                                    status_val = '방송종료';
                                }
                                if(index3 == 0){
                                    selection = selection + '<option value="' + (index3 + 1) + '" selected>' + goods_value['name']
                                    + '</option>';
                                    images = images + '<div><img src="' + goods_value['img'] + '" height="50" width="50"></div>';
                                    price = price + '<div>' + goods_value['price'] + '</div>';
                                    start_time = start_time + '<div>' + goods_value['start_time'] + '</div>';
                                    end_time = end_time + '<div>' + goods_value['end_time'] + '</div>';
                                    status = status + '<div>' + status_val + '</div>';
                                }
                                else{
                                    selection = selection + '<option value="' + (index3 + 1) + '" value="index3" selected>'
                                    + goods_value['name'] + '</option>';
                                    images = images + '<div style="display: none;"><img src="' + goods_value['img']
                                    + '" height="50" width="50"></div>';
                                    price = price + '<div style="display: none;">' + goods_value['price'] + '</div>';
                                    start_time = start_time + '<div style="display: none;">'
                                    + goods_value['start_time'] + '</div>';
                                    end_time = end_time + '<div style="display: none;">'
                                    + goods_value['end_time'] + '</div>';
                                    status = status + '<div style="display: none;">' + status_val + '</div>';
                                }

                            });

                            images += '</td>';
                            selection += '</select></td>';
                            price += '</td>';
                            start_time += '</td>';
                            end_time += '</td>';
                            var row = '<tr class="down_hidden" style="display: none;"><td>' + value['company'] + '</td>'
                            + images + selection
                            + price + start_time + end_time + status + '</tr>';

                            $last_row.append(row);

                        }
                        else{
                            var row = '<tr class="down_hidden" style="display: none;"><td>' + value['company'] + '</td><td><img src="'
                            + value['goods'][0]['img'] + '" height="50" width="50"></td><td><div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">'
                            + value['goods'][0]['name'] + '</div></td><td>'
                            + value['goods'][0]['price'] + '</td><td>'
                            + value['goods'][0]['start_time'] + '</td><td>'
                            + value['goods'][0]['end_time'] + '</td><td>';
                            + status_val + '</td></tr>';
                            $last_row.append(row);
                        }


                    });
                });
                var first_added = $('tr.down_hidden').first();
                first_added.show();
                first_added.toggleClass('down_hidden shown');
                var first_show = $goods_table.find('tr.shown').first();
                first_show.hide();
                first_show.toggleClass('shown up_hidden ');

            },
            error: function( xhr, status, thrown ) {
            }
        });

    var $date_input = $('input[name="date"]'),
        $latest_hour_shown_row = $('tr.hour.shown').first(),
        latest_hour_shown = parseInt($latest_hour_shown_row.text());

    date_obj.setFullYear((latest_hour_shown / 1000000) >> 0);
    date_obj.setMonth((((latest_hour_shown % 1000000) / 10000) >> 0) - 1);
    date_obj.setDate(((latest_hour_shown % 10000) / 100) >> 0);
    date_obj.setHours(latest_hour_shown % 100);
    date_obj.setHours(date_obj.getHours() - (date_obj.getHours() % 4) + 7)

    dd = date_obj.getDate();
    mm = date_obj.getMonth()+1; //January is 0!
    yyyy = date_obj.getFullYear();

    var keep_cut_line =  yyyy * 1000000 + mm * 10000 + dd * 100 + date_obj.getHours();
    $('tr.hour.up_hidden:contains("' + keep_cut_line + '")').prevAll('tr').remove();

    $date_input.val('' + ((latest_hour_shown / 1000000) >> 0) + '-' + (((latest_hour_shown % 1000000) / 10000) >> 0)
    + '-' + (((latest_hour_shown % 10000) / 100) >> 0));
}



function applyFilter() {
     var company = null || $('input[name="company"]').val().trim(),
        $selection = $("select.form-control.category")[0],
        category = $selection.options[$selection.selectedIndex].value,
        company_val = $('input[name="company_val"]'),
        category_val = $('input[name="category_val"]'),
        api_get_param = {};

        company_val.val(company);
        category_val.val(category);

        loadTable();
}

loadTable();
$("select.goods_item").change(function(){
    var row = $(this).parent().parent(),
    child_index = this.value;
    console.log(child_index)
    row.find(':nth-child(2)').find('div').hide();
    row.find(':nth-child(2)').find(':nth-child(' + child_index + ')').show();
    row.find(':nth-child(4)').find('div').hide();
    row.find(':nth-child(4)').find(':nth-child(' + child_index + ')').show();
    row.find(':nth-child(5)').find('div').hide();
    row.find(':nth-child(5)').find(':nth-child(' + child_index + ')').show();
    row.find(':nth-child(6)').find('div').hide();
    row.find(':nth-child(6)').find(':nth-child(' + child_index + ')').show();

});


 if (document.getElementById("goods_list").addEventListener) {
    document.getElementById("goods_list").addEventListener("mousewheel", MouseWheelHandler(), false);
    document.getElementById("goods_list").addEventListener("DOMMouseScroll", MouseWheelHandler(), false);
} else {
    sq.attachEvent("onmousewheel", MouseWheelHandler());
}


function MouseWheelHandler() {
    return function (e) {
        // cross-browser wheel delta
        var e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

        //scrolling down?
        if (delta < 0) {
             var down_hidden_rows = $goods_table.find('tr.down_hidden');
             var shown_rows = $goods_table.find('tr.shown');
             if (down_hidden_rows.length > 0){
                var first_added = down_hidden_rows.first();
                first_added.show();
                first_added.toggleClass('down_hidden shown');
                var first_show = $goods_table.find('tr.shown').first();
                first_show.hide();
                first_show.toggleClass('shown up_hidden ');
             }
             else{
                loadDown();
             }
        }

        //scrolling up?
        else {

             var up_hidden_rows = $goods_table.find('tr.up_hidden');
             var shown_rows = $goods_table.find('tr.shown');
             if (up_hidden_rows.length > 0){
                var last_added = up_hidden_rows.last();
                last_added.show();
                last_added.toggleClass('up_hidden shown');
                var last_show = $goods_table.find('tr.shown').last();
                last_show.hide();
                last_show.toggleClass('shown down_hidden ');
             }
             else{
                loadUp();
             }
        }
        $("select.goods_item").change(function(){
            var row = $(this).parent().parent(),
            child_index = this.value;
            console.log(child_index)
            row.find(':nth-child(2)').find('div').hide();
            row.find(':nth-child(2)').find(':nth-child(' + child_index + ')').show();
            row.find(':nth-child(4)').find('div').hide();
            row.find(':nth-child(4)').find(':nth-child(' + child_index + ')').show();
            row.find(':nth-child(5)').find('div').hide();
            row.find(':nth-child(5)').find(':nth-child(' + child_index + ')').show();
            row.find(':nth-child(6)').find('div').hide();
            row.find(':nth-child(6)').find(':nth-child(' + child_index + ')').show();

        });
        return false;
    }
}