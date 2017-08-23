$(document).ready(function() {
                setTimeout ("$('#background').fadeIn(800);", 300);
                setTimeout ("$('#content-logo').fadeIn(800);", 1100);
                setTimeout ("$('#background2').show();", 500);
                setTimeout ("$('#content-logo').fadeOut(800);", 2500);
                setTimeout ("$('#content-name').fadeIn(800);", 3500);
                setTimeout ("$('#content-name').fadeOut(800);", 6000);
                setTimeout ("$('#background').fadeOut(800);", 6000);
                setTimeout ("$('#content-enter-button').fadeIn(400);", 7000);
});
$('#enter-button-action').click(function() {
                        $('#content-enter-button').fadeOut(600);
                        $('#background').fadeOut(600);
                        setTimeout ("$('.instruction').fadeIn(600)", 900);
                        $('#info-button-action').click(function() {
                            $('.instruction').fadeOut(600);
                            $('#background2').fadeOut(600);
                            setTimeout ("$('#content-vk-auth').fadeIn(600)", 800);
                        });
                    
});

function testing(){
    var name = prompt("Введи свое имя, киса");
    if(name!=""&&name!=null&&name!=undefined){
    var text = prompt("Здесь вы можете написать комментарий или ошибку.\nВсего два правила:\n1.Пишите, пожалуйста, название устройства, с которого вы зашли на сайт\n2.Давайте без глупостей:)");
    if(text!=""&&text!=null&&text!=undefined){
        $.ajax({
            url:"https://hserun.ru/online-quest/bolge.php",
            type:'POST',
            data:'type=sendUMsg&message='+text+'&name='+name,
            timeout:20000,
            beforeSend:function(){
                //something before send
            },
            success: function(result){
                console.log(result);
                switch(result){
                    case "115": alert("Спасибо. Ответ записан)");break;
                    case "100": alert("Произошла ошибка."); break;
                    default: alert("Что-то не то. Возможно админ пьян :)");
                }
            },
            statusCode:{
                404: function(){
                    pushMsg("<b>Can't reach server.</b>");
                },
                500: function(){
                    pushMsg("<b>Internal server error.</b>");
                }
            },
            error: function(){
                pushMsg("Ask admins for help...");
            }
        });
    }
    }
}