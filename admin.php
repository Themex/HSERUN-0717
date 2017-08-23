<?php
define('INCLUDE_CHECK',true);
include('hserun.php');
$main = new main();
if (!$main->checkVk()||$_SESSION['user_group']!="admin"&&$_SESSION['user_group']!="pidor") {
    header('Location:'.main_link);
}

$site_flag = $main->init_site();

echo "<div class='user-window'><div style='margin: 10px;'>";
echo "<p>Welcome, ".$_SESSION['firstname'].".</p>";
echo "<p>Congratulations, you are into the system.</p>";
echo "</div></div>";
?>
<html>
<head>
    <title>
        HSERUN Top List
    </title>
    <meta http-equiv="cache-control" content="max-age=0" />
    <meta http-equiv="cache-control" content="no-cache" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="expires" content="0" />
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
    <meta http-equiv="pragma" content="no-cache" />
    <meta charset="utf-8" />
    <link rel="stylesheet" href="css/user_info.css" />
    <link rel="icon" type="image/png" href="../img/compass.png" />

    <link type="text/css" media="screen" rel="stylesheet" href="css/responsive-tables.css" />
</head>
<body>
<!-- TEST BUTTON START -->
<div class="test-button-block">
    <input type="button" value="ТЕСТИНГ" onclick="testing();" class="test-button" />
</div>
<!-- TEST BUTTON END -->

<div class="parent">
    <div style="display: block; text-align: center; width: auto;" id="buttonsblock">
        <div style="padding: 20px;">
            <img src="./img/logo.png" style="height: 100px;"><br><br>
            <div class="main">

            </div>
        </div>
    </div>
</div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="//hserun.ru/online-quest/js/jquery.smooth-scroll.min.js"></script>
<script type="text/javascript">
    function pushMsg(msg){
        alert(msg.toString());
    }
    function end_quest(){
        var text = "<?php echo ($site_flag)?"false":"true";?>";
        $.ajax({
            url:"https://hserun.ru/online-quest/bolge.php",
            type:'POST',
            data:'type=init&status='+text,
            timeout:20000,
            beforeSend:function(){
                //something before send
            },
            success: function(result){
                console.log(result);
                switch(result){
                    case "115": pushMsg("Статус успешно изменен"); $('#close_end').text((text==="true")?"Открыть квест":"Закрыть квест"); break;
                    case "100": pushMsg("Произошла ошибка."); break;
                    default: pushMsg("Что-то не то. Возможно админ пьян :)");
                }
            },
            statusCode:{
                404: function(){
                    pushMsg("Can't reach server.");
                },
                500: function(){
                    pushMsg("Internal server error.");
                }
            },
            error: function(){
                pushMsg("Ask admins for help...");
            }
        });
    }
    function linkify(text) {
        var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return text.replace(urlRegex, function(url) {
            return '<img src="' + url + '">';
        });
    }
    function load_prev(){
        localStorage.setItem("last-seen","users");
        $("#take_it").remove();
        $.ajax({
            url:'bolge.php',
            type:'POST',
            data:'type=list',
            timeout:20000,
            beforeSend: function(){
                $('body').append('<div class="load_container"><div class="load_msg">Загрузочка...</div></div>');
            },
            success: function(result) {
                var aHtml = document.createElement('div');
                aHtml.setAttribute('id','take_it');
                try {
                    var sliceArray = JSON.parse(result);
                    if (sliceArray[0] != 0 && sliceArray[0] != undefined && sliceArray[0] != null) {
                        var a_link = document.createElement('a');
                        a_link.setAttribute('id', 'get_excel');
                        a_link.setAttribute('download', 'filename');
                        a_link.setAttribute('class', 'cool-button');
                        a_link.href = "#";
                        a_link.textContent="Get all in Excel XLS";
                        aHtml.appendChild(a_link);

                        var b_link = document.createElement('a');
                        b_link.setAttribute('class', 'cool-button');
                        b_link.href = "https://hserun.ru/online-quest/quest";
                        b_link.textContent="ONLINE-QUEST";
                        aHtml.appendChild(b_link);

                        var c_link = document.createElement('a');
                        c_link.setAttribute('class','cool-button');
                        c_link.href="#";
                        c_link.textContent="Сообщения";
                        c_link.addEventListener('click',function(e){
                            e.preventDefault();
                            load_messages();
                        });
                        aHtml.appendChild(c_link);

                        var d_link = document.createElement('a');
                        d_link.setAttribute('id','close_end');
                        d_link.setAttribute('class','cool-button');
                        d_link.href="#";
                        d_link.textContent = "<?php echo ($site_flag) ? "Открыть квест":"Закрыть квест";?>";
                        d_link.addEventListener('click',function(e){
                           e.preventDefault();
                           end_quest();
                        });
                        aHtml.appendChild(d_link);

                        var div_count = document.createElement('div');
                        div_count.setAttribute('style', 'text-align:left;');

                        var p_count = document.createElement('p');
                        p_count.setAttribute('class', 'people_count');
                        p_count.textContent = 'Зарегистрировано: ' + sliceArray[0];

                        var p_hex = document.createElement('p');
                        p_hex.setAttribute('class','people_count');
                        p_hex.textContent = 'Последний вход: ' + sliceArray[1];
                        p_hex.style.cursor = "pointer";
                        p_hex.addEventListener('click',function(){
                            var dateTags = document.getElementsByClassName("team_9");
                            var searchText = sliceArray[1];
                            var found;
                            for(var i=0; i<dateTags.length; i++){
                                if(dateTags[i].textContent==searchText){
                                    found=dateTags[i];
                                    break;
                                }
                            }

                            var fOffset = $(found).offset().top;
                            var fHeight = $(found).height();
                            var windowHeight = $(window).height();
                            var offset;

                            if(fHeight<windowHeight){
                                offset = fOffset - ((windowHeight/2)-(fHeight/2));
                            } else {
                                offset = fOffset;
                            }

                            $.smoothScroll({ speed: 700 }, offset);

                            $(found).parent().addClass('highlighted');
                            setTimeout(function(){
                                $(found).parent().removeClass('highlighted');
                            }, 2000);
                        });


                        var p_avg = document.createElement('p');
                        p_avg.setAttribute('class','people_count');
                        p_avg.textContent = 'Среднее кол-во баллов: ' + sliceArray[2];

                        div_count.appendChild(p_count);
                        div_count.appendChild(p_hex);
                        div_count.appendChild(p_avg);

                        var test_table = document.createElement('table');
                        test_table.setAttribute('id', 'test_table');
                        test_table.setAttribute('class', 'team_box');
                        test_table.setAttribute('style', 'width:100%; background:#fff; color:#1d1d1d;');

                        var thead = document.createElement('thead');

                        var th_tr = document.createElement('tr');

                        var th_Content = ["ID","SESSION ID","Группа", "Фото", "Фамилия", "Имя", "Счет", "Выполнено", "Выполненные задания", "Последний вход","БАН"];

                        th_Content.forEach(function(item,i){
                            var th = document.createElement('th');
                            th.textContent = item;
                            th_tr.appendChild(th);
                        });

                        thead.appendChild(th_tr);

                        var tbody = document.createElement('tbody');

                        test_table.appendChild(thead);
                        test_table.appendChild(tbody);
                        sliceArray[3].forEach(function (item, i) {
                            var tr = document.createElement('tr');
                            item.forEach(function (piece, j, arr) {
                                var td = document.createElement('td');
                                td.setAttribute('class', 'team_' + j);
                                if(j==0){
                                    td.innerHTML='<a href="https://vk.com/id'+piece+'" target="_blank">'+piece+'</a>';
                                } else if(Array.isArray(piece)){
                                    var sortable=[];
                                    for(var ds in piece[0]){
                                        sortable.push(parseInt(ds.substring(2,ds.length)));
                                    }
                                    for(var cs in piece[1]){
                                        sortable.push(parseInt(cs.substring(2,cs.length)));
                                    }
                                    sortable.sort(function(a,b){
                                        return a-b;
                                    });
                                    td.innerHTML=(sortable.length==0)?'Пусто':sortable.toString();
                                }  else
                                    td.innerHTML = (piece != undefined && piece != null && piece != "") ? linkify(piece.toString()) : "Пусто";
                                tr.appendChild(td);
                            });
                            tbody.appendChild(tr);
                        });

                        var pip = document.createElement('p');
                        pip.textContent = 'Если в графе написано "Пусто" - значит поле в базе данных не имеет никакого строкового/числового/булевого значения.';

                        aHtml.appendChild(div_count);
                        aHtml.appendChild(test_table);
                        aHtml.appendChild(pip);
                    } else {
                        aHtml.textContent = "Nothing to show";
                    }
                    $(".main").html(aHtml);
                    $('.load_container').remove();
                } catch(e){
                    console.log(e);
                    $('.load_msg').text('Внтуренняя ошибочка...');
                }
            },
            statusCode:{
                404: function(){
                    alert("Can't find user list");
                },
                500: function(){
                    alert("Error in server php");
                }
            },
            error: function(){
                $('.load_msg').text('Ошибка загрузки.');
            }
        });
    }
    function load_messages(){
        localStorage.setItem("last-seen","msg");
        $('#take_it').remove();
        $.ajax({
            url:'bolge.php',
            type: 'POST',
            data: 'type=messages',
            timeout:20000,
            beforeSend: function(){
                $('body').append('<div class="load_container"><div class="load_msg">Загрузочка...</div></div>');
            },
            success: function(result){
                var aHtml = document.createElement('div');
                aHtml.setAttribute('id','take_it');
                console.log(result);
                try {
                    var sliceArray = JSON.parse(result);
                    console.log(sliceArray);
                    if (sliceArray[0] != 0 && sliceArray[0] != undefined && sliceArray[0] != null) {
                        var a_link = document.createElement('a');
                        a_link.setAttribute('id', 'get_excel');
                        a_link.setAttribute('download', 'filename');
                        a_link.setAttribute('class', 'cool-button');
                        a_link.href = "#";
                        a_link.textContent="Get all in Excel XLS";
                        aHtml.appendChild(a_link);

                        var b_link = document.createElement('a');
                        b_link.setAttribute('class', 'cool-button');
                        b_link.href = "https://hserun.ru/online-quest/quest";
                        b_link.textContent="ONLINE-QUEST";
                        aHtml.appendChild(b_link);

                        var c_link = document.createElement('a');
                        c_link.setAttribute('class','cool-button');
                        c_link.href="#";
                        c_link.textContent="Пользователи";
                        c_link.addEventListener('click',function(e){
                            e.preventDefault();
                            load_prev();
                        });
                        aHtml.appendChild(c_link);

                        var div_count = document.createElement('div');
                        div_count.setAttribute('style', 'text-align:left;');

                        var p_count = document.createElement('p');
                        p_count.setAttribute('class', 'people_count');
                        p_count.textContent = 'Кол-во сообщений: ' + sliceArray[0];

                        div_count.appendChild(p_count);

                        var test_table = document.createElement('table');
                        test_table.setAttribute('id', 'test_table');
                        test_table.setAttribute('class', 'team_box');
                        test_table.setAttribute('style', 'width:100%; background:#fff; color:#1d1d1d;');

                        var thead = document.createElement('thead');

                        var th_tr = document.createElement('tr');

                        var th_Content = ["ID","Отправитель","Сообщение", "Параметры/Имя отправителя", "Время отправки"];

                        th_Content.forEach(function(item,i){
                            var th = document.createElement('th');
                            th.textContent = item;
                            th_tr.appendChild(th);
                        });

                        thead.appendChild(th_tr);

                        var tbody = document.createElement('tbody');

                        test_table.appendChild(thead);
                        test_table.appendChild(tbody);
                        sliceArray[1].forEach(function (item, i) {
                            var tr = document.createElement('tr');
                            item.forEach(function (piece, j, arr) {
                                var td = document.createElement('td');
                                td.setAttribute('class', 'team_' + j);
                                if(j===1){
                                    td.innerHTML='<a href="https://vk.com/id'+piece+'" target="_blank">'+piece+'</a>';
                                } else if(Array.isArray(piece)){
                                    var sortable=[];
                                    for(var ds in piece[0]){
                                        sortable.push(parseInt(ds.substring(2,ds.length)));
                                    }
                                    for(var cs in piece[1]){
                                        sortable.push(parseInt(cs.substring(2,cs.length)));
                                    }
                                    sortable.sort(function(a,b){
                                        return a-b;
                                    });
                                    console.log(sortable);
                                    td.innerHTML=(sortable.length==0)?'Пусто':sortable.toString();
                                }  else
                                    td.innerHTML = (piece != undefined && piece != null && piece != "") ? linkify(piece.toString()) : "Пусто";
                                tr.appendChild(td);
                            });
                            tbody.appendChild(tr);
                        });

                        var pip = document.createElement('p');
                        pip.textContent = 'Если в графе написано "Пусто" - значит поле в базе данных не имеет никакого строкового/числового/булевого значения.';

                        aHtml.appendChild(div_count);
                        aHtml.appendChild(test_table);
                        aHtml.appendChild(pip);
                    } else {
                        aHtml.textContent = "Nothing to show";
                    }
                    $(".main").html(aHtml);
                    $('.load_container').remove();
                } catch(e){
                    console.log(e);
                    $('.load_msg').text('Внтуренняя ошибочка...');
                }
            },
            statusCode:{
                404: function(){
                    alert("Can't find user list");
                },
                500: function(){
                    alert("Error in server php");
                }
            },
            error: function(){
                $('.load_msg').text('Ошибка загрузки.');
            }
        });
    }
    $(document).ready(function(){
        var d = localStorage.getItem("last-seen");
        if(d!=undefined&&d!=null&&d!=""){
            switch(d){
                case "users": load_prev();break;
                case "msg": load_messages(); break;
                default: load_prev();
            }
        } else
            load_prev();
    });
    var tableToExcel = (function() {
        var uri = 'data:application/vnd.ms-excel;base64,'
            , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
            , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
            , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
        return function(table, name) {
            if (!table.nodeType) table = document.getElementById(table)
            var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
            window.location.href = uri + base64(format(template, ctx))
        }
    })()
    $(document).on('click','#get_excel',function(e){
        e.preventDefault();
        tableToExcel('test_table', 'HSE RUN')
    });

    function testing(){
        var text = prompt("Здесь вы можете написать комментарий или ошибку.\nВсего два правила:\n1.Пишите, пожалуйста, название устройства, с которого вы зашли на сайт\n2.Давайте без глупостей:)");
        if(text!=""&&text!=null&&text!=undefined){
            $.ajax({
                url:"https://hserun.ru/online-quest/bolge.php",
                type:'POST',
                data:'type=sendMsg&message='+text,
                timeout:20000,
                beforeSend:function(){
                    //something before send
                },
                success: function(result){
                    console.log(result);
                    switch(result){
                        case "115": pushMsg("Спасибо. Ответ записан)");break;
                        case "100": pushMsg("Произошла ошибка."); break;
                        default: pushMsg("Что-то не то. Возможно админ пьян :)");
                    }
                },
                statusCode:{
                    404: function(){
                        pushMsg("Can't reach server.");
                    },
                    500: function(){
                        pushMsg("Internal server error.");
                    }
                },
                error: function(){
                    pushMsg("Ask admins for help...");
                }
            });
        }
    }
</script>
</body>
</html>