/**
 * Created by Bølge Creations on 03.07.2017.
 * @author Artyom Kamensky, Andrey Loganov
 * @version 1.5.4
 */
/** Window **/
function BolgeWindow(options){
    options = options || {};
    this.content = options.content || "";
    this.bodyContent = options.bodyContent || "";

    if (typeof options.visible === "undefined") {
        if (typeof options.isHidden === "undefined") {
            options.visible = true;
        } else {
            options.visible = !opt_opts.isHidden;
        }
    }
    this.isHidden_ = !options.visible;

    this.enableEventPropagation_ = options.enableEventPropagation || false;

    this.div_ = null;
    this.closeListener_ = null;
    this.eventListeners_ = null;
}

BolgeWindow.prototype = {};

BolgeWindow.prototype.createDiv = function() {
    var events;
    var me = this;

    var cancelHandler = function (e) {
        e.cancelBubble = true;
        if (e.stopPropagation) {
            e.stopPropagation();
        }
    };

    var ignoreHandler = function (e) {

        e.returnValue = false;

        if (e.preventDefault) {

            e.preventDefault();
        }

        if (!me.enableEventPropagation_) {

            cancelHandler(e);
        }
    };

    if(!this.div_) {
        this.div_ = document.createElement('div');
        this.div_.setAttribute('class','window-block')

        if (typeof this.content.nodeType === "undefined") {
            this.div_.innerHTML += this.content;
        } else {
            this.div_.appendChild(this.content);
        }
        $(this.div_).find('.window-block-img').append(this.getSearchIcon());
        $(this.div_).find('.window-block-img').append(this.getCloseIcon());

        //this.div_.appendChild(this.getCloseIcon());
        this.addSearchClick();
        this.addCloseClick();

        $('#map').after(this.div_);

        $(window).resize(function(){
            $('.window-block').css({
                'position' : 'absolute',
                'left' : '50%',
                'top' : '50%',
                'display' : 'none',
                'margin-left' : function() {return -$(this).outerWidth()/2},
                'margin-top' : function() {return -$(this).outerHeight()/2}
            });
        });
        $(window).resize();
        //refElem.parentNode.insertBefore(this.div_, refElem.nextSibling);

        if (!this.enableEventPropagation_) {

            this.eventListeners_ = [];

            // Cancel event propagation.

            events = ["mousedown", "mouseover", "mouseout", "mouseup",
                "click", "dblclick", "touchstart", "touchend", "touchmove"];

            events.forEach(function(element) {
                if(this.div_) me.eventListeners_.push(this.div_.addEventListener(element,cancelHandler));
            });


            this.eventListeners_.push(this.div_.addEventListener("mouseover", function (e) {
                this.style.cursor = "default";
            }));
        }
    }

};

BolgeWindow.prototype.getCloseIcon = function(){
    var icon = document.createElement('div');
    icon.setAttribute('id','close-window')
    icon.setAttribute('class','close-block');
    var icon_inner = document.createElement('div');
    icon_inner.setAttribute('class','close-block-inner');
    icon_inner.textContent = "CLOSE";
    icon.appendChild(icon_inner);
    return icon;
};

BolgeWindow.prototype.getSearchIcon = function(){
    var icon = document.createElement('div');
    icon.setAttribute('id','zoomimg');
    icon.setAttribute('class','zoom-block');

    var icon_inner = document.createElement('button');
    icon_inner.setAttribute('class','zoom-button');

    icon.appendChild(icon_inner);
    return icon;
};

BolgeWindow.prototype.draw = function (){
    this.createDiv();
};

BolgeWindow.prototype.addCloseClick = function(){
    $(this.div_).find('#close-window').click(this.closeClickHandler_());
};

BolgeWindow.prototype.addSearchClick = function(){
    $(this.div_).find('.zoom-button').click(this.searchClickHandler_());
};

BolgeWindow.prototype.searchClickHandler_ = function(){
    var me = this;
    return function(e){
        e.cancelBubble = true;

        if (e.stopPropagation) {

            e.stopPropagation();
        }

        me.trigger("openimg");

        var bg = $('.window-block-img').css('background-image');
        bg = bg.replace('url(','').replace(')','');
        console.log(bg);
        var w = window.open(bg.replace(/"/g, ""), '_blank');
    };
};

BolgeWindow.prototype.closeClickHandler_ = function(){
    var me = this;

    return function (e) {

        // 1.0.3 fix: Always prevent propagation of a close box click to the map:
        e.cancelBubble = true;

        if (e.stopPropagation) {

            e.stopPropagation();
        }

        me.trigger("closeclick");

        me.close();
    };
};

BolgeWindow.prototype.open = function(){
    this.draw();
    this.setVisible(true);
};

BolgeWindow.prototype.close = function(){
    if(this.closeListener_) {

    }

    if(this.eventListeners_){

    }
    $('.user-id-link-block').show();
    if(this.div_) {
        this.setVisible(false);
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
    var jF = JSON.parse(localStorage.getItem(ftask_storage));
    var jS = JSON.parse(localStorage.getItem(stask_storage));
    console.log('Check if the game is ended...');
    if(parseInt(getCookie(dt_storage))==Object.keys(jF).length+Object.keys(jS).length)
        End_The_Game();
    else
        console.log("Not ended");
};

BolgeWindow.prototype.trigger = function(name){
    var event;

    if(document.createEvent){
        event = document.createEvent("HTMLEvents");
        event.initEvent(name,true,true);
    } else {
        event = document.createEventObject();
        event.eventType = name;
    }


    if(document.createEvent){
        this.div_.dispatchEvent(event);
    } else {
        this.div_.fireEvent("on"+event.eventType, event);
    }
}

BolgeWindow.prototype.setVisible = function(isVisible) {
    this.isHidden_ = !isVisible;

    if(this.div_) {
        if(isVisible) {
            $(this.div_).fadeIn(400);
        } else {
            $(this.div_).fadeOut(400);
        }
    }
};

BolgeWindow.prototype.setContent = function(content){
    this.content = content;

    if(this.div_) {
        if(typeof content.nodeType === "undefined") {
            this.div_.innerHTML = content;
        } else {
            this.div_.innerHTML = "";
            this.div_.appendChild(content);
        }
        $(this.div_).find('.window-block-img').append(this.getSearchIcon());
        $(this.div_).find('.window-block-img').append(this.getCloseIcon());
        this.addSearchClick();
        this.addCloseClick();
    }
};

BolgeWindow.prototype.setBodyContent = function(bodyContent){
    this.bodyContent = bodyContent;

    if(this.div_){
        $(this.div_).find('.window-block-content-inner-padding').html(bodyContent);
    }
};

BolgeWindow.prototype.addListener = function(name, callback){
    if(this.div_){
        if(name=='closeclick')
            this.div_.lastChild.addEventListener('click',callback());
        else
            this.div_.addEventListener(name,callback());
    }
}

/** System Consts**/
var php_link = "https://hserun.ru/online-quest/bolge.php";

const dt_storage = "done_tasks";
const ftask_storage = "first";
const stask_storage = "second";
const ans_true_false = "ans_true_false";
const ans_quest = "ans_quest";
const fact = "fact";


/** Cookies **/
function getCookie(name){
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]):undefined;
}
function setCookie(name, value, options){
    //options: expires,path,domain,secure
    options = options || {};
    var expires = options.expires;

    if(typeof expires=="number"&&expires){
        var d = new Date();
        d.setTime(d.getTime()+expires*1000);
        expires=options.expires=d;
    }
    if(expires&&expires.toUTCString){
        options.expires=expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name+"="+value;

    for(var propName in options){
        updatedCookie += "; "+propName;
        var propValue = options[propName];
        if(propValue!==true){
            updatedCookie+="="+propValue;
        }
    }

    document.cookie = updatedCookie;
}
function deleteCookie(name){
    setCookie(name, "", {
        expires: -1
    });
}

/** Output **/
function pushMsg(text){
    var div = document.createElement('div');
    div.setAttribute('class', 'load-window');
    var div_message = document.createElement('div');
    div_message.setAttribute('class','load-window-inner');
    div_message.innerHTML += text;

    div_message.addEventListener('click', function () {
        this.parentNode.removeChild(this);
    });


    div.appendChild(div_message);
    $('#map').after(div);
    $(window).resize(function(){
        $('.load-window').css({
            position:'absolute',
            'color': '#1D1D1D',
            'background': 'rgba(255,255,255,0.8)',
            'border-radius': '7px',
            left: ($(window).width() - $('.load-window').outerWidth())/2,
            top: ($(window).height() - $('.load-window').outerHeight())/2
        });
    });
}

/** Map **/
var bolgewindow;

// Custom BolgeWindow for markers
function customWindowContent(options){
    options = options || {};

    var main_div = document.createElement('div');
    main_div.setAttribute('id','container');

    var Header = document.createElement('div');
    Header.setAttribute('class','window-block-header');

    var Header_inner = document.createElement('div');
    Header_inner.setAttribute('class','window-block-header-inner');
    Header_inner.textContent = options.main_header.toUpperCase();

    Header.appendChild(Header_inner);

    var body_Main = document.createElement('div');
    body_Main.setAttribute('class','window-block-content');

    var body_Inner = document.createElement('div');
    body_Inner.setAttribute('class','window-block-content-inner');

    if(options.bodyContent) {
        if (typeof options.bodyContent.nodeType === "undefined") {
            body_Inner.innerHTML=options.bodyContent;
        } else {
            body_Inner.innerHTML="";
            body_Inner.appendChild(options.bodyContent);
        }
    } else {
        var bodyContent = document.createElement('div');
        bodyContent.setAttribute('class','window-block-content-inner-padding');
        bodyContent.textContent = options.bContentText || "Empty";
        body_Inner.appendChild(bodyContent);
    }

    body_Main.appendChild(body_Inner);

    if(options.picture) {
        var picture = document.createElement('div');
        picture.style.backgroundImage = "url("+options.picture+")";
        picture.setAttribute('class','window-block-img');
        main_div.appendChild(picture);
    }
    main_div.appendChild(Header);
    main_div.appendChild(body_Main);
    return main_div;
}

//Updates info about done tasks
function applyDoneTaskToLocalStorage(id, type, text, fact, answer){
    console.log('Inserting done tasks into local storage...');
    try {
        var obj;
        if (type == '1') {
            localStorage.setItem(ans_true_false, JSON.stringify(answer));
            obj = JSON.parse(localStorage.getItem(ftask_storage));
        } else if (type == '2') {
            localStorage.setItem(ans_quest, JSON.stringify(answer));
            obj = JSON.parse(localStorage.getItem(stask_storage));
        }
        var param = $.map(obj, function(element, index){
            if(element.id === id)
                return index;
        });
        obj[param[0]]['text']=text;
        obj[param[0]]['fact']=fact;
        if (type == '1') {
            localStorage.setItem(ftask_storage, JSON.stringify(obj));
        } else if (type == '2') {
            localStorage.setItem(stask_storage, JSON.stringify(obj));
        }
    } catch(e){
        console.log(e);
        pushMsg("An error occured.");
    }
}

//Sends request to server with the user's answer and waits for response
function makeCheckAjax(id, type, answer, callback){
    var resp;
    $.ajax({
        url:php_link,
        type:'POST',
        data:'type=getAnswer&task_id='+id+'&task_type='+type+'&answer='+answer,
        timeout:20000,
        beforeSend:function(){
            bolgewindow.setBodyContent("Загрузочка...");
        },
        success: function(result){
            try {
                resp = JSON.parse(result);
                if(resp[0]==100)
                    callback("Error","Error", "Error","{}");
                callback(resp[0],resp[1],resp[2],resp[3]);
                $('.load-window').remove();
            } catch(e) {
                localStorage.clear();
                window.location.reload();
            }
        },
        statusCode:{
            404: function(){
                bolgewindow.setBodyContent("Произошла ошибка. Обратитесь к организаторам.");
            },
            500: function(){
                bolgewindow.setBodyContent("Произошла ошибка. Попробуйте повторить через некоторое время.");
            },
            502: function(){
                bolgewindow.setBodyContent("Произошла ошибка. Попробуйте: <ul><li>Открыть это окно заново</li>Перезагрузить страницу<li>Попробовать пройти квест чуть позже</li></ul>");
            }
        },
        error: function(){
            bolgewindow.setBodyContent("<b>Серьезные проблемы: обратитесь к организаторам за помощью.</b>");
        }
    });
}

//Applies user's answer to front-end
function getAnswerFromServer(elem, answer){
    makeCheckAjax(elem['id'],elem['line'],answer, function(state, php_text, php_fact, appliance){
        var result = "";
        switch(state){
            case 400: result="true"; break;
            case 401: result="false"; break;
            default: result="fuck";
        }
        elem['text']=php_text;
        elem[fact]=php_fact;
        setCookie(dt_storage, parseInt(getCookie(dt_storage))+1);
        applyDoneTaskToLocalStorage(elem['id'],elem['line'],php_text, php_fact,appliance);
        bolgewindow.setBodyContent(makeCompletedTask(elem,result,true));
    });
}

//Makes labels of uncompleted tasks
function makeUncompletedTaskLabels(text, type){
    if(type=='1'){
        var tS = document.createElement('p');
        tS.textContent = text;
        return tS;
    } else if(type=='2'){
        var task = Object.keys(text).map(function(key){
            return text[key];
        });
        var tS = document.createElement('p');
        task.forEach(function(elem, index, arr){
            var label = document.createElement('label');
            label.innerHTML+=elem;
            label.setAttribute('for','radio'+index);
            label.setAttribute('class','control control-radio');

            var element = document.createElement('input');
            element.setAttribute('id','radio'+index);
            element.setAttribute('class','radios');
            element.setAttribute('type','radio');
            element.setAttribute('value',index);
            element.setAttribute('name','radio');
            $(element).change(function(){
                if($('.send-button').attr('disabled')){
                    $('.send-button').removeAttr('disabled');
                }
            });

            label.appendChild(element);

            var div = document.createElement('div');
            div.setAttribute('class','control_indicator');
            label.appendChild(div);
            tS.appendChild(label);
            tS.appendChild(document.createElement('br'))
        });
        return tS;
    } else
        return 'What the hell, dude?';
}

//Front-end of uncompleted tasks
function makeUncompletedElement(elem, marker){
    var task = makeUncompletedTaskLabels(elem['task'], elem['line']);
    var type = (elem['line']=='1') ? "Верно это или нет?" : "Выберите верное, на ваш взгляд, утверждение:";
    var button = document.createElement('p');
    if(elem['line']=='1') {
        var input1 = document.createElement('input');
        input1.value = "ВЕРНО";
        input1.type = "button";
        input1.setAttribute('class','send-button-true');


        google.maps.event.addDomListener(input1, 'click', function(){
            getAnswerFromServer(elem,"true");
            var icon = {
                url: "https://hserun.ru/online-quest/img/mrkr.png",
                scaledSize: new google.maps.Size(50,50)
            };

            marker.setIcon(icon);
        });


        var input2 = document.createElement('input');
        input2.value = "НЕВЕРНО";
        input2.type= "button";
        input2.setAttribute('class','send-button-false');

        google.maps.event.addDomListener(input2,'click',function(){
            getAnswerFromServer(elem,"false");
            var icon = {
                url: "https://hserun.ru/online-quest/img/mrkr.png",
                scaledSize: new google.maps.Size(50,50)
            };

            marker.setIcon(icon);
        });


        button.appendChild(input1);
        button.appendChild(input2);
    }
    else {
        var input = document.createElement('input');
        input.value="ПРОВЕРИТЬ";
        input.type="button";
        input.setAttribute('class','send-button');
        input.disabled = true;

        google.maps.event.addDomListener(input,'click',function(){
            var radios = document.getElementsByName('radio');
            var vals = 1;
            for(var i = 0, length=radios.length; i<length; i++){
                if(radios[i].checked){
                    vals+=parseInt(radios[i].value);
                    break;
                }
            }
            console.log(vals);
            getAnswerFromServer(elem,vals.toString());

            var icon = {
                url: "https://hserun.ru/online-quest/img/mrkr.png",
                scaledSize: new google.maps.Size(50,50)
            };

            marker.setIcon(icon);
        });

        button.appendChild(input);
    }

    var siteNotice = document.createElement('div');
    siteNotice.setAttribute('id','siteNotice');

    var bodyContent = document.createElement('div');
    bodyContent.setAttribute('class','window-block-content-inner-padding');

    var pType = document.createElement('p');
    pType.textContent=type;

    var address = document.createElement('span');
    var bth = document.createElement('b');
    bth.textContent = "Адрес: ";
    address.appendChild(bth);
    address.innerHTML+=elem['address'];


    bodyContent.appendChild(siteNotice);
    bodyContent.appendChild(address);
    bodyContent.appendChild(pType)
    bodyContent.appendChild(task);
    bodyContent.appendChild(button);

    var options = {
        picture: elem['picture'],
        main_header:elem['name'],
        bodyContent: bodyContent
    };

    return customWindowContent(options);
}

//Front-end of completed tasks
function makeCompletedTask(elem, is_correct_by_user, is_body_content){
    is_body_content = is_body_content || false;
    var bodyContent = document.createElement('div');
    bodyContent.setAttribute('class','window-block-content-inner-padding');

    var siteNotice = document.createElement('p');
    siteNotice.setAttribute('id','siteNotice');
    var text = "";
    if (is_correct_by_user=="true") {
        text = "Вы угадали!"
        siteNotice.style.color = "#009933";
    } else if(is_correct_by_user=="false") {
        text = "Вы ошиблись!";
        siteNotice.style.color = "#ff0000";
    }
    siteNotice.textContent = text;

    var p2 = document.createElement('p');

    if(elem['line']=='1') {
        p2.textContent = elem['text'];
    } else if(elem['line']=='2'){
        p2.innerHTML+=('<b>Правильный ответ</b>: <span style="color:#009933">'+elem['text']+'</span>');
    }

    var address = document.createElement('span');
    var bth = document.createElement('b');
    bth.textContent = "Адрес: ";
    address.appendChild(bth);
    address.innerHTML+=elem['address'];

    bodyContent.appendChild(address);
    bodyContent.appendChild(siteNotice);
    //bodyContent.appendChild(pTask);
    bodyContent.appendChild(p2);

    bodyContent.innerHTML+=('<b>Другие факты об этом месте</b>:<br>'+elem[fact]);

    var options = {
        picture: elem['picture'],
        main_header:elem['name'],
        bodyContent: bodyContent
    };

    if(is_body_content) {
        return bodyContent.innerHTML;
    }
    else
        return customWindowContent(options);
}

//Justifies what content to apply
function makeSingleMarker(elem,marker){
    try {
        var array;
        if (elem['line'] == '1') {
            array = JSON.parse(localStorage.getItem(ans_true_false));
        } else if(elem['line']=='2'){
            array = JSON.parse(localStorage.getItem(ans_quest));
        }

        if(typeof array['id'+elem['id']]!=undefined&&array['id'+elem['id']]!=null){
            return makeCompletedTask(elem,array['id'+elem['id']]);
        } else
            return makeUncompletedElement(elem,marker);

    } catch(e){
        console.log(e);
        return makeUncompletedElement(elem,marker);
    }
}

//Set marker onclick handlers that apply BolgeWindow front-end
function makeListener(marker, elem){
    google.maps.event.addListener(marker, 'click', function(){
        if(!$('.window-block2').is(':visible')) {
            $('.user-id-link-block').hide();
            bolgewindow.setContent(makeSingleMarker(elem, marker));
            bolgewindow.open();
        }
    });
}

//Applies markers to map
function makeSense(map,jF,jS){
    try {
        var ansTF = JSON.parse(localStorage.getItem(ans_true_false));
        var ansQ = JSON.parse(localStorage.getItem(ans_quest));
    } catch(e){
        localStorage.clear();
        location.reload();
    }
    bolgewindow = new BolgeWindow();

    Array.prototype.forEach.call(jF, function(elem){
        var urlhr = "https://hserun.ru/online-quest/img/";
        var urlpr = (typeof ansTF['id'+elem['id']]!=undefined&&ansTF['id'+elem['id']]!=null)?"mrkr.png":"marker.png";

        var markerTitle = 'HSE RUN MARKER';

        var marker = new google.maps.Marker({
            position: {lat: parseFloat(elem['lat']), lng: parseFloat(elem['lng'])},
            map: map,
            title: markerTitle,
            animation: google.maps.Animation.DROP,
            icon: {
                url: urlhr + urlpr,
                scaledSize: new google.maps.Size(50, 50)
            }
        });

        makeListener(marker,elem);
    });

    Array.prototype.forEach.call(jS, function(elem){
        //var contentString = makeSingleMarker(elem,ansTrueFalse,ansQuest);
        var urlhr = "https://hserun.ru/online-quest/img/";
        var urlpr = (typeof ansQ['id'+elem['id']]!=undefined&&ansQ['id'+elem['id']]!=null)?"mrkr.png":"marker2.png";
        var markerTitle = 'HSE RUN MARKER';

        var marker = new google.maps.Marker({
            position: {lat: parseFloat(elem['lat']), lng: parseFloat(elem['lng'])},
            map: map,
            title: markerTitle,
            animation: google.maps.Animation.DROP,
            icon: {
                url: urlhr + urlpr,
                scaledSize: new google.maps.Size(50, 50)
            }
        });

        makeListener(marker,elem);
    });
}

//todo debug end the game
//What to do if the game is ended
function End_The_Game(){
    console.log('The quest is ended.');
    $('.user-id-link-block').fadeOut();
    $('#map').fadeOut();
    $('#my_score_last').text(getCookie("score"));
    $('.result-block').hide().fadeIn(400);
    $('.bolge').hide().fadeIn(400);
    $('.bolge').click(function(){
        location.replace("https://hserun.ru/online-quest/bolge");
    });
}

//Initializes the map
function initialize(jF,jS){
    $('.load-window').show();
    $('.user-id-link-block').show();
    var styledMapType = new google.maps.StyledMapType([
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{color: '#d59563'}]
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{color: '#999999'}]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{color: '#263c3f'}]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{color: '#6b9a76'}]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{color: '#38414e'}]
            },
            {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{color: '#212a37'}]
            },
            {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{color: '#9ca5b3'}]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{color: '#746855'}]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{color: '#1f2835'}]
            },
            {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{color: '#f3d19c'}]
            },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{color: '#2f3948'}]
            },
            {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{color: '#d59563'}]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{color: '#17263c'}]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: '#515c6d'}]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{color: '#17263c'}]
            }
        ],
        {name: 'HSERUN Map'});

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 55.751244, lng: 37.618423},
        zoom: 11,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
        mapTypeControlOptions: {
            mapTypeIds: ['styled_map']
        }
    });

    google.maps.event.addListener(map,'zoom_changed', function(){
        google.maps.event.addListenerOnce(map,'bounds_changed', function(event){
            if(this.getZoom()<10) {
                this.setZoom(10);
            }
        });
    });

    makeSense(map,jF,jS);

    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

    google.maps.event.addListener(map,'tilesloaded',function(){
        setTimeout(function(){$('.load-window').remove()}, 1500);
    });
}

//Checks if the storage is empty
function isEmpty(param1, param2){
    var _condition = param1==undefined||param1==null||param1==""||param1.length<1||param2==undefined||param2==null||param2==""||param2.length<1;
    var condition=false;
    try {
        JSON.parse(param1);
        JSON.parse(param2);
        condition=false;
    } catch(e){
        condition=true;
    }
    return _condition||condition;
}

function isEmptySess(sess1, sess2){
    try {
        return sess1.localeCompare(sess2) != 0;
    } catch(e){
        return true;
    }
}

function mapLoad(){
    if(navigator.cookieEnabled&&isLocalStorageNameSupported()){
        var jF, jS, ansQuest, ansTrueFalse, dT;
        if(isEmpty(localStorage.getItem(ftask_storage),localStorage.getItem(stask_storage))||isEmptySess(getCookie("sess"),localStorage.getItem("sess"))){
            console.log('Downloading the data from server...');
            $.ajax({
                url:php_link,
                type:'POST',
                data:'type=setup',
                timeout:20000,
                beforeSend:function(){
                    pushMsg("Loading map data...");
                },
                success: function(result){
                    var jData = JSON.parse(result);
                    jF = jData[ftask_storage];
                    jS = jData[stask_storage];
                    ansTrueFalse = jData[ans_true_false];
                    ansQuest = jData[ans_quest];
                    dT = getCookie("done_tasks");
                    localStorage.setItem(ftask_storage, JSON.stringify(jF));
                    localStorage.setItem(stask_storage, JSON.stringify(jS));
                    localStorage.setItem(ans_true_false, JSON.stringify(ansTrueFalse));
                    localStorage.setItem(ans_quest, JSON.stringify(ansQuest));
                    localStorage.setItem("sess", getCookie("sess"));
                    if(parseInt(dT)==Object.keys(jF).length+Object.keys(jS).length)
                        End_The_Game();
                    else {
                        initialize(jF, jS);
                    }
                    //something after success
                    $('.load-window').remove();
                },
                statusCode:{
                    404: function(){
                        pushMsg("<b>Can't reach server</b>");
                    },
                    500: function(){
                        pushMsg("<b>Internal server error.</b>");
                    }
                },
                error: function(){
                    pushMsg("Ask admins for help...");
                }
            });
        } else {
            console.log('Loading the data from cache...');
            try {
                jF = JSON.parse(localStorage.getItem(ftask_storage));
                jS = JSON.parse(localStorage.getItem(stask_storage));
                dT = parseInt(getCookie("done_tasks"));
            } catch(e){
                localStorage.clear();
                window.location.reload();
            }
            if(dT==Object.keys(jF).length+Object.keys(jS).length)
                End_The_Game();
            else {
                initialize(jF, jS);
            }
        }
    } else {
        pushMsg("Включите, пожалуйста, cookies. Или выйдите из Private Mode.");
    }
}
/** User **/

$(document).ready(function(){
    $(window).resize(function(){
        $('.window-block').css({
            position:'absolute',
            display:'none',
            'color': '#1D1D1D',
            'background': 'rgba(255,255,255,0.8)',
            'border-radius': '7px',
            left: ($(window).width() - $('.window-block').outerWidth())/2,
            top: ($(window).height() - $('.window-block').outerHeight())/2
        });
    });

    $(window).resize();
    $(window).resize(function(){
        $('.load-window').css({
            'position' : 'absolute',
            'left' : '50%',
            'top' : '50%',
            'margin-left' : function() {return -$(this).outerWidth()/2},
            'margin-top' : function() {return -$(this).outerHeight()/2}
        });
    });
    $(window).resize();

    $(window).resize();
    $(window).resize(function(){
        $('.result-block').css({
            'position' : 'absolute',
            'left' : '50%',
            'top' : '50%',
            'margin-left' : function() {return -$(this).outerWidth()/2},
            'margin-top' : function() {return -$(this).outerHeight()/2}
        });
    });
    $(window).resize();

    $(window).resize(function(){
        $('.window-block2').css({
            'position' : 'absolute',
            'left' : '50%',
            'top' : '50%',
            'display' : 'none',
            'margin-left' : function() {return -$(this).outerWidth()/2},
            'margin-top' : function() {return -$(this).outerHeight()/2}
        });
    });
    $(window).resize();
});

function sendFlushorOut(type){
    $.ajax({
        url:php_link,
        type:'POST',
        data:'type='+type,
        timeout:20000,
        beforeSend:function(){
            //something before send
        },
        success: function(result){
            console.log(result);
            localStorage.clear();
            if(type=='logout') {
                deleteCookie("sess");
                deleteCookie(dt_storage);
            } else if(type=='flush') {
                localStorage.setItem("sess",getCookie("sess"));
            }
            window.location.reload();
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

$(document).on('click','#out',function(){
    sendFlushorOut('logout');
});

$(document).on('click','#get_vk',function(e){
    e.preventDefault();

    window.open('https://vk.com/'+$(this).attr('domain'));
});

$(document).on('click','.user-id-link',function(){
    if(!$('.window-block').is(":visible")) {
        $('#my_score').text(getCookie("score"));
        $('.window-block2').fadeIn(400);
    }
});

$(document).on('click','#closeprofile', function(){
    $('.window-block2').fadeOut(400);
});

$(document).on('click','.restart-button',function(){
    sendFlushorOut('flush');
});

$(document).on('click','.share-vk',function(){
    var score = getCookie("score");
    window.open("https://vk.com/share.php?url=https://hserun.ru/online-quest/share.php?score="+getCookie("score"),"VK Share", "width=500,height=500");
});

function isLocalStorageNameSupported(){
    var testKey = 'test', storage = window.localStorage;
    try{
        storage.setItem(testKey,'1');
        storage.removeItem(testKey);
        return true;
    } catch(error){
        return false;
    }
}

function testing(){
    var text = prompt("Здесь вы можете написать комментарий или ошибку.\nВсего два правила:\n1.Пишите, пожалуйста, название устройства, с которого вы зашли на сайт\n2.Давайте без глупостей:)");
    if(text!=""&&text!=null&&text!=undefined){
        $.ajax({
            url:php_link,
            type:'POST',
            data:'type=sendMsg&message='+text,
            timeout:20000,
            beforeSend:function(){
                console.log("Sending message...");
            },
            success: function(result){
                console.log(result);
                switch(result){
                    case "115": alert("Спасибо. Ответ записан)"); console.log("Done");break;
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