$(document).ready(function() {
                setTimeout ("$('.logo-blg').fadeIn(800);", 400);
                setTimeout ("$('.logo-blg').fadeOut(600);", 1800);
                setTimeout ("$('.authors').fadeIn(600);", 2700);
                setTimeout ("$('.authors').animate({'top','200px'});", 2800);
                setTimeout ("$('.bg-wave').fadeIn(1000);", 3500);
});

$(window).resize(function(){
        $('.logo-blg').css({
            'position' : 'absolute',
            'left' : '50%',
            'top' : '50%',
            'margin-left' : function() {return -$(this).outerWidth()/2},
            'margin-top' : function() {return -$(this).outerHeight()/2}
        });
        $('.authors').css({
            'position' : 'absolute',
            'top' : '50%',
            'margin-top' : function() {return -$(this).outerHeight()/2}
        });
    });
    $(window).resize();
    
    $('#artem').click(function(){
        window.open('https://vk.com/artemkamensky', '_blank');
    });
    $('#andrey').click(function(){
        window.open('http://vk.com/bethatasitmay', '_blank');
    });