$(document).ready(function() {
                setTimeout ("$('.map').fadeIn(800);", 1400);
                setTimeout ("$('.map-g').fadeIn(800);", 1400);
                setTimeout ("$('.logo').fadeIn(800);", 500);
                setTimeout ("$('.command-panel').fadeIn(800);", 500);
            });
            $('.close-button').hover(function() {
                $('.point-bg').toggleClass('red');
            });
            function point(a) {
                if(a==1){
                    $('.point').fadeIn(400);
                }
                if(a==0){
                    $('.point').fadeOut(400);
                }
            }