<?php
    $score = $_GET['score'];

    $desc = "HSE RUN ONLINE QUEST";
    $pics = "";
    
    switch($score){
        case '10': $pics="https://hserun.ru/online-quest/img/share_image1.jpg"; break;
        case '20': $pics="https://hserun.ru/online-quest/img/share_image2.jpg"; break;
        case '30': $pics="https://hserun.ru/online-quest/img/share_image3.jpg"; break;
        case '40': $pics="https://hserun.ru/online-quest/img/share_image4.jpg"; break;
        case '50': $pics="https://hserun.ru/online-quest/img/share_image5.jpg"; break;
        case '60': $pics="https://hserun.ru/online-quest/img/share_image6.jpg"; break;
        case '70': $pics="https://hserun.ru/online-quest/img/share_image7.jpg"; break;
        case '80': $pics="https://hserun.ru/online-quest/img/share_image8.jpg"; break;
        case '90': $pics="https://hserun.ru/online-quest/img/share_image9.jpg"; break;
        case '100': $pics="https://hserun.ru/online-quest/img/share_image10.jpg"; break;
        default: $pics='https://hserun.ru/online-quest/img/logo.png';
    }
?>
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta property="og:title" content="HSE RUN ONLINE QUEST"/>
<meta property="og:image" content="<?php echo $pics;?>"/>
</head>
<script type="text/javascript">setTimeout(function(){location.replace("<?php echo (isset($_SERVER['HTTPS'])? "https":"http")."://".$_SERVER['SERVER_NAME'];?>/online-quest/");}, 500);</script>
</html>