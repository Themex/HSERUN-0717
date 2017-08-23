 $(document).ready(function(){
    $(window).resize(function(){
        if($(window).width() < 750){
            $('.instruction').css({
                'position' : 'absolute',
                'width' : '80%',
                left: '10%',
            });
            if( $('.instruction').outerHeight() >= ($(window).height()*0.8) ){
                $('.instruction').css({
                    top: '20px'
                });
            }
            else {
                $('.instruction').css({
                    top: ($(window).height() - $('.instruction').outerHeight())/2
                });
            }
        }
        else {
            $('.instruction').css({
                'position' : 'relative',
                'width' : '400px',
                
                //left: ($(window).width() - $('.instruction').outerWidth())/2,
                "margin": ($(window).height())/2+' auto'
            });
        }
    });
    $(window).resize();
});