<?php
define('INCLUDE_CHECK',true);
include('hserun.php');
$main = new main();

if(!$main->checkVk()){
    header('Location:https://hserun.ru/online-quest/');
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Карта - HSERUN</title>
    <link rel="stylesheet" type="text/css" href="//hserun.ru/online-quest/css/map.css">
    <link rel="icon" type="image/png" href="../img/compass.png" />
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <!-- Yandex.Metrika counter --> <script type="text/javascript"> (function (d, w, c) { (w[c] = w[c] || []).push(function() { try { w.yaCounter45230481 = new Ya.Metrika({ id:45230481, clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true, ut:"noindex" }); } catch(e) { } }); var n = d.getElementsByTagName("script")[0], s = d.createElement("script"), f = function () { n.parentNode.insertBefore(s, n); }; s.type = "text/javascript"; s.async = true; s.src = "https://mc.yandex.ru/metrika/watch.js"; if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); } })(document, window, "yandex_metrika_callbacks"); </script> <noscript><div><img src="https://mc.yandex.ru/watch/45230481?ut=noindex" style="position:absolute; left:-9999px;" alt="" /></div></noscript> <!-- /Yandex.Metrika counter -->
</head>
<body>
    
        <!-- TEST BUTTON START -->
        <div class="test-button-block">
            <input type="button" value="ТЕСТИНГ" onclick="testing();" class="test-button" />
        </div>
        <!-- TEST BUTTON END -->
        
<div class="load-window">
    <div class="load-window-inner">
        Загрузка карты...
    </div>
</div>
<div id="map"></div>
<div class="window-block2" style="display:none;">
    <div class="window-block-img-profile" style="background-image: url(<?php echo $_SESSION['photo'];?>);">
        <div class="close-block-logout">
            <button id="out" class="logout-button">&nbsp;</button>
            <button domain="<?php echo $_SESSION['domain']; ?>" id="get_vk" class="vk-profile-button">&nbsp;</button>
            <button id="closeprofile" class="close-block-logout-button">&nbsp;</button>
        </div>
    </div>
    <div class="window-block-header">
        <div class="window-block-header-inner">
            <?php echo strtoupper($_SESSION['firstname'].' '.$_SESSION['lastname']);?>
        </div>
    </div>
    <div class="window-block-content">
        <div class="window-block-content-profile-inner">
            БАЛЛЫ: <span id="my_score"><?php echo $_SESSION['score'];?></span>/100
        </div>
    </div>
</div>
<div class="result-block" style="display:none;">
    <div class="result-block-inner">
        <div class="result-profile-img" style="background-image: url(<?php echo $_SESSION['photo'];?>);">
            <div class="close-block-logout">
            <button id="out" class="logout-button">&nbsp;</button>
            <button domain="<?php echo $_SESSION['domain']; ?>" id="get_vk" class="vk-profile-button">&nbsp;</button>
        </div>
        </div>    
        <div class="result-block-content">
            <div class="result-block-content-inner">
                <h1 class="resulth1">Поздравляем, вы прошли онлайн-квест!</h1>
                <div class="mark-result">
                    <div class="mark-result-inner">
                        <?php echo 'Ваш счет: <span id="my_score_last">'.$_SESSION['score'].'</span> баллов.'; ?>
                    </div>
                </div>
                <button class="share-vk"><img src="./img/vk-mini.png" class="share-vk-img">&nbsp;ПОДЕЛИТЬСЯ</button><br>
                <button class="restart-button" >Пройти заново</button>
                
            </div>
        </div>
        <div class="bolge">&nbsp;</div>
    </div>
</div>
<div class="user-id-link-block"><input type="button" class="user-id-link" value="<?php echo strtoupper($_SESSION['firstname'].' '.$_SESSION['lastname']);?>" /></div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="//hserun.ru/online-quest/js/map.js"></script>
<script async defer src="//maps.googleapis.com/maps/api/js?key=AIzaSyCB1m5FVc6p-8vyN9nUQHpOXzyCwTjsITU&callback=mapLoad"></script>
</body>
</html>