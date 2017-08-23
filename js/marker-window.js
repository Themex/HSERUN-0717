$(document).ready(function(){
    if($(window).width() < 900){
        if(window.innerHeight < window.innerWidth){
            $('.result-block').hide();
            $("#notice-turn").hide().fadeIn(600);
        }
        $(window).resize(function(){
            $('.window-block-img').css({
                'height': ($(window).height())*0.25
            });
            $('.window-block-content-inner').css({
                'height': ($(window).height())*0.45
            });
            if($(window).height() < 400){
                $('.result-profile-img').css({
                'width': '250px',
                'height': '100px',
                'background-size': 'cover',
                'background-position': 'center'
                });
                $('.result-block').css({
                    'position': 'absolute',
                    'top': ($(window).height()-$('.result-block').outerHeight()/2)
                });
            }
        });
    }
    $(window).resize();
});

window.addEventListener("orientationchange", function() {
    console.log('Screen orientation angle: '+window.orientation);
    var flag = $('.result-block').is(":visible");
    if(window.orientation==90||window.orientation==-90) {
        if(flag) $('.result-block').hide(); else bolgewindow.close();
    	$("#notice-turn").fadeIn(600);
    } else
    if(window.orientation==0||window.orientation==180){
        $("#notice-turn").fadeOut();
        if(!$('#map').is(':visible')) $('.result-block').fadeIn(400);
    }
}, false);
