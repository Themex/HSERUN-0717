/**
 * Created by Bølge Creations on 03.07.2017.
 * @author Artyom Kamensky, Andrey Loganov
 * @version 1.1.4
 */
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
    var div_message = document.createElement('div');
    div_message.setAttribute('id','div-msg');
    div_message.setAttribute('id','div-msg');
    div_message.setAttribute('style','position: fixed; left:50%; width:115px; background:#db7b1c; padding:5px; border: 0.2px solid #000; border-radius: 3px; text-align:center;');
    div_message.innerHTML += text;

    div_message.addEventListener('click', function(){
        this.parentNode.removeChild(this);
    });

    $('#map').after(div_message);
}

/** Map **/
var infowindow;

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

function makeCheckAjax(id, type, answer, callback){
    var resp;
    $.ajax({
        url:php_link,
        type:'POST',
        data:'type=getAnswer&task_id='+id+'&task_type='+type+'&answer='+answer,
        timeout:20000,
        beforeSend:function(){
            infowindow.setContent("Загрузка...");
            //something before send
        },
        success: function(result){
            console.log(result);
            resp = JSON.parse(result);
            console.log(resp);
            setCookie("score", resp[4]);
            callback(resp[0],resp[1],resp[2],resp[3]);
        },
        statusCode:{
            404: function(){
                pushMsg("<b>Can't reach server.</b>");
            },
            500: function(){
                pushMsg("<b>Internal error.</b>");
            }
        },
        error: function(){
            pushMsg("<b>Ask admins for help</b>");
        }
    });
}

function getAnswerFromServer(elem, answer){
    makeCheckAjax(elem['id'],elem['line'],answer, function(state, php_text, php_fact, appliance){
        var result = "";
        switch(state){
            case 400: result="true"; break;
            case 401: result="false"; break;
            default: result="fuck";
        }
        elem['text']=php_text;
        elem['fact']=php_fact;
        setCookie(dt_storage, parseInt(getCookie(dt_storage))+1);
        applyDoneTaskToLocalStorage(elem['id'],elem['line'],php_text, php_fact,appliance);
        infowindow.setContent(makeCompletedTask(elem,result));
    });
}

//todo some design features
function makeUncompletedTaskLabels(text, type){
    if(type=='1'){
        var tS = document.createElement('p');
        tS.textContent = text;
        return tS;
    } else if(type=='2'){
        var task = Object.values(text);
        var tS = document.createElement('p');
        task.forEach(function(elem, index, arr){
            var label = document.createElement('label');

            var element = document.createElement('input');
            element.setAttribute('id','radio'+index);
            element.setAttribute('class','radios');
            element.setAttribute('type','radio');
            element.setAttribute('value',index);
            element.setAttribute('name','radio');

            label.appendChild(element);
            label.innerHTML+=elem;

            tS.appendChild(label);
            tS.appendChild(document.createElement('br'))
        });
        return tS;
    } else
        return 'What the hell, dude?';
}

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
    var picture = document.createElement('img');
    picture.src=elem['picture'];
    picture.setAttribute('class','t-img');

    var content = document.createElement('div');
    content.setAttribute('id','content');

    var siteNotice = document.createElement('div');
    siteNotice.setAttribute('id','siteNotice');

    var firstHeading = document.createElement('h1');
    firstHeading.setAttribute('id','firstHeading');
    firstHeading.setAttribute('class','firstHeading');
    firstHeading.textContent = elem['name'];

    var bodyContent = document.createElement('div');
    bodyContent.setAttribute('id','bodyContent');

    var pType = document.createElement('p');
    pType.textContent=type;

    var address = document.createElement('p');
    var bth = document.createElement('b');
    bth.textContent = "Адрес: ";
    address.appendChild(bth);
    address.innerHTML+=elem['address'];

    bodyContent.appendChild(address);
    bodyContent.appendChild(pType)
    bodyContent.appendChild(task);
    bodyContent.appendChild(button);

    content.appendChild(firstHeading);
    content.appendChild(picture);
    content.appendChild(siteNotice);
    content.appendChild(bodyContent);
    return content;
}

function makeDoneTaskLabels(elem){
    if(elem['line']=='1')
        return elem['task'];
    else if(elem['line']=='2'){
        var tS = document.createElement('ul');
        var text = Object.values(elem['task']);
        text.forEach(function(element, index, arr){
            var label = document.createElement('li');

            label.textContent=element;

            tS.appendChild(label);
        });
        return tS;
    } else
        return "What the hell, dude?";
}

function makeCompletedTask(elem, is_correct_by_user){
    console.log(is_correct_by_user);
    var content = document.createElement('div');
    content.setAttribute('id','content');
    var type = "<b>Тип задания</b>: ";
    type += (elem['line']=='1') ? "Верно-неверно" : "Ответ на вопрос";
    var siteNotice = document.createElement('div');
    siteNotice.setAttribute('id','siteNotice');
    var text = "<b>При ответе</b>: ";
    if (is_correct_by_user=="true") {
        text += "Вы все указали правильно!"
    } else if(is_correct_by_user=="false")
       text += "Вы ошиблись :(";
    siteNotice.innerHTML += text;

    var picture = document.createElement('img');
    picture.src=elem['picture'];
    picture.setAttribute('class','t-img');

    var firstHeading = document.createElement('h1');
    firstHeading.setAttribute('id','firstHeading');
    firstHeading.setAttribute('class','firstHeading');
    firstHeading.textContent = elem['name'];

    var bodyContent = document.createElement('div');
    bodyContent.setAttribute('id','bodyContent');

    var torch = (elem['line']=='1')?'Верно ли? ':'Что верно?';

    var pTask = document.createElement('p');
    var bash = document.createElement('b');
    bash.textContent = torch;
    pTask.appendChild(bash);
    if(elem['line']=='2')
        pTask.appendChild(makeDoneTaskLabels(elem));
    else
        pTask.innerHTML+=makeDoneTaskLabels(elem);
    var pType = document.createElement('p');
    pType.innerHTML+=type;

    var p2 = document.createElement('p');
    p2.innerHTML+=('<b>Сообщение</b>: '+elem['text']);

    var address = document.createElement('p');
    var bth = document.createElement('b');
    bth.textContent = "Адрес: ";
    address.appendChild(bth);
    address.innerHTML+=elem['address'];

    bodyContent.appendChild(pType);
    bodyContent.appendChild(pTask);
    bodyContent.appendChild(p2);

    bodyContent.innerHTML+=('<b>Немного фактов</b>:<br>'+elem[fact]);


    content.appendChild(firstHeading);
    content.appendChild(picture);
    content.appendChild(address);
    content.appendChild(siteNotice);
    content.appendChild(bodyContent);
    return content;
}

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

function makeListener(marker, elem){
      //do something there to interact with user
    google.maps.event.addListener(marker, 'click', (function(marker){
        return function(){
            infowindow.setContent(makeSingleMarker(elem,marker));
            infowindow.open(marker.get('map'), marker);
        }
    })(marker));

    google.maps.event.addListener(infowindow,'closeclick', function(){
        var jF = JSON.parse(localStorage.getItem(ftask_storage));
        var jS = JSON.parse(localStorage.getItem(stask_storage));
        if(parseInt(getCookie(dt_storage))==Object.keys(jF).length+Object.keys(jS).length)
            End_The_Game();
    });
}

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

function makeSense(map,jF,jS){
    var ansTF = JSON.parse(localStorage.getItem(ans_true_false));
    var ansQ = JSON.parse(localStorage.getItem(ans_quest));
	Array.prototype.forEach.call(jF, function(elem){
        var urlhr = "https://hserun.ru/online-quest/img/";
        var urlpr = (typeof ansTF['id'+elem['id']]!=undefined&&ansTF['id'+elem['id']]!=null)?"mrkr.png":"marker.png";

        var markerTitle = 'HSE RUN MARKER';

        var marker = new google.maps.Marker({
            position: {lat: parseFloat(elem['lat']), lng: parseFloat(elem['lng'])},
            map: map,
            title: markerTitle,
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
            icon: {
                url: urlhr + urlpr,
                scaledSize: new google.maps.Size(50, 50)
            }
        });

        makeListener(marker,elem);
    });
}

//todo debug end the game
function End_The_Game(){
    console.log('The quest is ended.');
    $('.user-id-link-block').fadeOut();
    $('#map').fadeOut();
    $('#my_score').text(getCookie("score"));
    opw();
}

function initMap(){
    if(navigator.cookieEnabled){
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

    // Create a map object, and include the MapTypeId to add
    // to the map type control.
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 55.755826, lng: 37.617300},
        zoom: 13,
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

	var jF, jS, ansQuest, ansTrueFalse, dT;
    infowindow = new google.maps.InfoWindow();
    if(isEmpty(localStorage.getItem(ftask_storage),localStorage.getItem(stask_storage))||getCookie("sess").localeCompare(localStorage.getItem("sess"))!=0){
        console.log('Downloading the data from server...');
        $.ajax({
            url:php_link,
            type:'POST',
            data:'type=setup',
            timeout:20000,
            beforeSend:function(){
                //something before send
            },
            success: function(result){
                console.log(result);
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
                else
                    makeSense(map,jF,jS);
                //something after success
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
		jF = JSON.parse(localStorage.getItem(ftask_storage));
		jS = JSON.parse(localStorage.getItem(stask_storage));
		dT = parseInt(getCookie("done_tasks"));
		if(dT==Object.keys(jF).length+Object.keys(jS).length)
		    End_The_Game();
		else
		    makeSense(map,jF,jS);
	}
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');
    } else {
        pushMsg("Turn on browser cookies, please.");
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
});

function opw(){
    $('.window-block').fadeIn();
}
function clw(){
    $('.window-block').fadeOut();
}

$(document).on('click','#out',function(){
    $.ajax({
        url:php_link,
        type:'POST',
        data:'type=logout',
        timeout:20000,
        beforeSend:function(){
            //something before send
        },
        success: function(result){
            console.log(result);
            localStorage.clear();
            deleteCookie("sess");
            deleteCookie(dt_storage);
            location.reload();
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
});