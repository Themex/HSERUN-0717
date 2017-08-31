<?php
define('INCLUDE_CHECK',true);
include('hserun.php');

$main = new main();

if($main->init_site()){
    header('Location:https://hserun.ru/online-quest/end');
}

if($main->checkVk())
    header('Location:'.main_link);
?>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
         <meta property="og:image" content="img/logo.png"/>
        <title>ОНЛАЙН-КВЕСТ HSERUN</title>
        <link rel="stylesheet" type="text/css" href="https://hserun.ru/online-quest/css/main.css">
    <!-- Yandex.Metrika counter --> <script type="text/javascript"> (function (d, w, c) { (w[c] = w[c] || []).push(function() { try { w.yaCounter45230481 = new Ya.Metrika({ id:45230481, clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true, ut:"noindex" }); } catch(e) { } }); var n = d.getElementsByTagName("script")[0], s = d.createElement("script"), f = function () { n.parentNode.insertBefore(s, n); }; s.type = "text/javascript"; s.async = true; s.src = "https://mc.yandex.ru/metrika/watch.js"; if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); } })(document, window, "yandex_metrika_callbacks"); </script> <noscript><div><img src="https://mc.yandex.ru/watch/45230481?ut=noindex" style="position:absolute; left:-9999px;" alt="" /></div></noscript> <!-- /Yandex.Metrika counter -->
    </head>
    <body id="btag">
        <!-- Russians drink only vodka -->
        <!-- TEST BUTTON START 
        <div class="test-button-block">
            <input type="button" value="ТЕСТИНГ" onclick="testing();" class="test-button" />
        </div>
         TEST BUTTON END -->
        
         <div class="bg0">
            &nbsp;
        </div>
        <div class="bg" id="background">
            &nbsp;
        </div>
        <div class="bg2" id="background2">
            &nbsp;
        </div>
        <div class="content">
            <div class="parent">
                <div id="content-logo">
                    <img src="https://hserun.ru/online-quest/img/logo1.png" class="img-logo">
                </div>
                <div class="title" id="content-name">
                    <img src="https://hserun.ru/online-quest/img/online.png" class="online-img">
                </div>
                <div id="content-enter-button">
                    <input type="button" value="ВХОД" class="enter-button" id="enter-button-action" />
                </div>
                <div class="instruction">
                    <div class="instruction-inner">
                        <img src="https://hserun.ru/online-quest/img/online.png" style="height: 40px;"><br>
                <h1 class="info-header">Дорогой друг!</h1>
                Этот онлайн-квест — твой уникальный шанс показать миру, что Москву ты знаешь от и до... или просто открыть для себя что-то новое и интересное.
                <h1 class="info-header">Правила здесь очень простые:</h1>
                1) Открываешь карту, поражаешься масштабности города;
                <br>2) Нажимаешь на любой из 10 представленных на карте маячков;
                <br>3) Решаешь загадку (спойлер: решать загадку с помощью гугла не так круто и интересно);
                <br>4) В любой последовательности и с удобной тебе скоростью проходишь все этапы (время прохождения не влияет на результат);
                <br>5) Делишься своими блестящими (как мы надеемся) результатами с друзьями!
                <br>
                <input type="button" value="ОК, ПОГНАЛИ!" class="enter-button vkmini" style="margin-top: 20px;" id="info-button-action" />
                    </div>
                </div>
                <div id="content-vk-auth">
                    <button onclick="location.href='<?php echo $main->authVk($main->get_ip(),actual_link,$_GET['code']);?>';" class="enter-button vkmini"><img src="./img/vk-mini.png" style="height: 12px;">&nbsp;АВТОРИЗОВАТЬСЯ</button>
                </div>
            </div>
        </div>
        
        <script src="//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script type="text/javascript" src="//hserun.ru/online-quest/js/main-page.js"></script>
        <!--script type="text/javascript" src="//hserun.ru/online-quest/js/instruction.js"></script-->
    </body>
</html>
