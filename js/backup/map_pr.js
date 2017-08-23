function BolgeWindow(a){a=a||{},this.content=a.content||"",this.bodyContent=a.bodyContent||"","undefined"==typeof a.visible&&("undefined"==typeof a.isHidden?a.visible=!0:a.visible=!opt_opts.isHidden),this.isHidden_=!a.visible,this.enableEventPropagation_=a.enableEventPropagation||!1,this.div_=null,this.closeListener_=null,this.eventListeners_=null}BolgeWindow.prototype={},BolgeWindow.prototype.createDiv=function(){var a,b=this,c=function(g){g.cancelBubble=!0,g.stopPropagation&&g.stopPropagation()};this.div_||(this.div_=document.createElement("div"),this.div_.setAttribute("class","window-block"),"undefined"==typeof this.content.nodeType?this.div_.innerHTML+=this.content:this.div_.appendChild(this.content),$(this.div_).find(".window-block-img").append(this.getCloseIcon()),this.addCloseClick(),$("#map").after(this.div_),$(window).resize(function(){$(".window-block").css({position:"absolute",left:"50%",top:"50%",display:"none","margin-left":function(){return-$(this).outerWidth()/2},"margin-top":function(){return-$(this).outerHeight()/2}})}),$(window).resize(),!this.enableEventPropagation_&&(this.eventListeners_=[],a=["mousedown","mouseover","mouseout","mouseup","click","dblclick","touchstart","touchend","touchmove"],a.forEach(function(g){this.div_&&b.eventListeners_.push(this.div_.addEventListener(g,c))}),this.eventListeners_.push(this.div_.addEventListener("mouseover",function(){this.style.cursor="default"}))))},BolgeWindow.prototype.getCloseIcon=function(){var a=document.createElement("div");a.setAttribute("id","close-window"),a.setAttribute("class","close-block");var b=document.createElement("div");return b.setAttribute("class","close-block-inner"),b.textContent="CLOSE",a.appendChild(b),a},BolgeWindow.prototype.draw=function(){this.createDiv()},BolgeWindow.prototype.addCloseClick=function(){$(this.div_).find("#close-window").click(this.closeClickHandler_())},BolgeWindow.prototype.closeClickHandler_=function(){var a=this;return function(b){b.cancelBubble=!0,b.stopPropagation&&b.stopPropagation(),a.trigger("closeclick"),a.close()}},BolgeWindow.prototype.open=function(){this.draw(),this.setVisible(!0)},BolgeWindow.prototype.close=function(){this.closeListener_,this.eventListeners_,$(".user-id-link-block").show(),this.setVisible(!1),this.div_.parentNode.removeChild(this.div_),this.div_=null;var a=JSON.parse(localStorage.getItem(ftask_storage)),b=JSON.parse(localStorage.getItem(stask_storage));console.log("Check if the game is ended..."),parseInt(getCookie(dt_storage))==Object.keys(a).length+Object.keys(b).length?End_The_Game():console.log("Not ended")},BolgeWindow.prototype.trigger=function(a){var b;document.createEvent?(b=document.createEvent("HTMLEvents"),b.initEvent(a,!0,!0)):(b=document.createEventObject(),b.eventType=a),document.createEvent?this.div_.dispatchEvent(b):this.div_.fireEvent("on"+b.eventType,b)},BolgeWindow.prototype.setVisible=function(a){this.isHidden_=!a,this.div_&&(a?$(this.div_).fadeIn(400):$(this.div_).fadeOut(400))},BolgeWindow.prototype.setContent=function(a){this.content=a,this.div_&&("undefined"==typeof a.nodeType?this.div_.innerHTML=a:(this.div_.innerHTML="",this.div_.appendChild(a)),$(this.div_).find(".window-block-img").append(this.getCloseIcon()),this.addCloseClick())},BolgeWindow.prototype.setBodyContent=function(a){this.bodyContent=a,this.div_&&$(this.div_).find(".window-block-content-inner-padding").html(a)},BolgeWindow.prototype.addListener=function(a,b){this.div_&&("closeclick"==a?this.div_.lastChild.addEventListener("click",b()):this.div_.addEventListener(a,b()))};var php_link="https://hserun.ru/online-quest/bolge.php";const dt_storage="done_tasks",ftask_storage="first",stask_storage="second",ans_true_false="ans_true_false",ans_quest="ans_quest",fact="fact";function getCookie(a){var b=document.cookie.match(new RegExp("(?:^|; )"+a.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,"\\$1")+"=([^;]*)"));return b?decodeURIComponent(b[1]):void 0}function setCookie(a,b,c){c=c||{};var f=c.expires;if("number"==typeof f&&f){var g=new Date;g.setTime(g.getTime()+1e3*f),f=c.expires=g}f&&f.toUTCString&&(c.expires=f.toUTCString()),b=encodeURIComponent(b);var h=a+"="+b;for(var j in c){h+="; "+j;var k=c[j];!0!==k&&(h+="="+k)}document.cookie=h}function deleteCookie(a){setCookie(a,"",{expires:-1})}function pushMsg(a){var b=document.createElement("div");b.setAttribute("class","load-window");var c=document.createElement("div");c.setAttribute("class","load-window-inner"),c.innerHTML+=a,c.addEventListener("click",function(){this.parentNode.removeChild(this)}),b.appendChild(c),$("#map").after(b)}var infowindow,bolgewindow;function customWindowContent(a){a=a||{};var b=document.createElement("div");b.setAttribute("id","container");var c=document.createElement("div");c.setAttribute("class","window-block-header");var f=document.createElement("div");f.setAttribute("class","window-block-header-inner"),f.textContent=a.main_header.toUpperCase(),c.appendChild(f);var g=document.createElement("div");g.setAttribute("class","window-block-content");var h=document.createElement("div");if(h.setAttribute("class","window-block-content-inner"),a.bodyContent)"undefined"==typeof a.bodyContent.nodeType?h.innerHTML=a.bodyContent:(h.innerHTML="",h.appendChild(a.bodyContent));else{var j=document.createElement("div");j.setAttribute("class","window-block-content-inner-padding"),j.textContent=a.bContentText||"Empty",h.appendChild(j)}if(g.appendChild(h),a.picture){var k=document.createElement("div");k.style.backgroundImage="url("+a.picture+")",k.setAttribute("class","window-block-img"),b.appendChild(k)}return b.appendChild(c),b.appendChild(g),b}function applyDoneTaskToLocalStorage(a,b,c,f,g){console.log("Inserting done tasks into local storage...");try{var h;"1"==b?(localStorage.setItem(ans_true_false,JSON.stringify(g)),h=JSON.parse(localStorage.getItem(ftask_storage))):"2"==b&&(localStorage.setItem(ans_quest,JSON.stringify(g)),h=JSON.parse(localStorage.getItem(stask_storage)));var j=$.map(h,function(k,l){if(k.id===a)return l});h[j[0]].text=c,h[j[0]].fact=f,"1"==b?localStorage.setItem(ftask_storage,JSON.stringify(h)):"2"==b&&localStorage.setItem(stask_storage,JSON.stringify(h))}catch(k){console.log(k),pushMsg("An error occured.")}}function makeCheckAjax(a,b,c,f){var g;$.ajax({url:php_link,type:"POST",data:"type=getAnswer&task_id="+a+"&task_type="+b+"&answer="+c,timeout:2e4,beforeSend:function(){pushMsg("\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0434\u0430\u043D\u043D\u044B\u0445"),bolgewindow.setBodyContent("\u0417\u0430\u0433\u0440\u0443\u0437\u043E\u0447\u043A\u0430...")},success:function(h){g=JSON.parse(h),console.log(g),f(g[0],g[1],g[2],g[3]),$(".load-window").remove()},statusCode:{404:function(){pushMsg("<b>Can't reach server.</b>")},500:function(){pushMsg("<b>Internal error.</b>")}},error:function(){pushMsg("<b>Ask admins for help</b>")}})}function getAnswerFromServer(a,b){makeCheckAjax(a.id,a.line,b,function(c,f,g,h){var j="";j=400===c?"true":401===c?"false":"fuck";a.text=f,a.fact=g,setCookie(dt_storage,parseInt(getCookie(dt_storage))+1),applyDoneTaskToLocalStorage(a.id,a.line,f,g,h),bolgewindow.setContent(makeCompletedTask(a,j))})}function makeUncompletedTaskLabels(a,b){if("1"==b){var c=document.createElement("p");return c.textContent=a,c}if("2"==b){var f=Object.values(a),c=document.createElement("p");return f.forEach(function(g,h){var k=document.createElement("label");k.innerHTML+=g,k.setAttribute("for","radio"+h),k.setAttribute("class","control control-radio");var l=document.createElement("input");l.setAttribute("id","radio"+h),l.setAttribute("class","radios"),l.setAttribute("type","radio"),l.setAttribute("value",h),l.setAttribute("name","radio"),k.appendChild(l);var m=document.createElement("div");m.setAttribute("class","control_indicator"),k.appendChild(m),c.appendChild(k),c.appendChild(document.createElement("br"))}),c}return"What the hell, dude?"}function makeUncompletedElement(a,b){var c=makeUncompletedTaskLabels(a.task,a.line),f="1"==a.line?"\u0412\u0435\u0440\u043D\u043E \u044D\u0442\u043E \u0438\u043B\u0438 \u043D\u0435\u0442?":"\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0432\u0435\u0440\u043D\u043E\u0435, \u043D\u0430 \u0432\u0430\u0448 \u0432\u0437\u0433\u043B\u044F\u0434, \u0443\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435:",g=document.createElement("p");if("1"==a.line){var h=document.createElement("input");h.value="\u0412\u0415\u0420\u041D\u041E",h.type="button",h.setAttribute("class","send-button-true"),google.maps.event.addDomListener(h,"click",function(){getAnswerFromServer(a,"true");var r={url:"https://hserun.ru/online-quest/img/mrkr.png",scaledSize:new google.maps.Size(50,50)};b.setIcon(r)});var j=document.createElement("input");j.value="\u041D\u0415\u0412\u0415\u0420\u041D\u041E",j.type="button",j.setAttribute("class","send-button-false"),google.maps.event.addDomListener(j,"click",function(){getAnswerFromServer(a,"false");var r={url:"https://hserun.ru/online-quest/img/mrkr.png",scaledSize:new google.maps.Size(50,50)};b.setIcon(r)}),g.appendChild(h),g.appendChild(j)}else{var k=document.createElement("input");k.value="\u041F\u0420\u041E\u0412\u0415\u0420\u0418\u0422\u042C",k.type="button",k.setAttribute("class","send-button"),google.maps.event.addDomListener(k,"click",function(){for(var r=document.getElementsByName("radio"),s=1,t=0,u=r.length;t<u;t++)if(r[t].checked){s+=parseInt(r[t].value);break}console.log(s),getAnswerFromServer(a,s.toString());var v={url:"https://hserun.ru/online-quest/img/mrkr.png",scaledSize:new google.maps.Size(50,50)};b.setIcon(v)}),g.appendChild(k)}var l=document.createElement("div");l.setAttribute("id","siteNotice");var m=document.createElement("div");m.setAttribute("class","window-block-content-inner-padding");var n=document.createElement("p");n.textContent=f;var o=document.createElement("span"),p=document.createElement("b");p.textContent="\u0410\u0434\u0440\u0435\u0441: ",o.appendChild(p),o.innerHTML+=a.address,m.appendChild(l),m.appendChild(o),m.appendChild(n),m.appendChild(c),m.appendChild(g);var q={picture:a.picture,main_header:a.name,bodyContent:m};return customWindowContent(q)}function makeCompletedTask(a,b){var c=document.createElement("div");c.setAttribute("class","window-block-content-inner-padding");var f=document.createElement("p");f.setAttribute("id","siteNotice");var g="";"true"==b?(g="\u0412\u044B \u0443\u0433\u0430\u0434\u0430\u043B\u0438!",f.style.color="#009933"):"false"==b&&(g="\u0412\u044B \u043E\u0448\u0438\u0431\u043B\u0438\u0441\u044C!",f.style.color="#ff0000"),f.textContent=g;var h=document.createElement("p");"1"==a.line?h.textContent=a.text:"2"==a.line&&(h.innerHTML+="<b>\u041F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u044B\u0439 \u043E\u0442\u0432\u0435\u0442</b>: <span style=\"color:#009933\">"+a.text+"</span>");var j=document.createElement("span"),k=document.createElement("b");k.textContent="\u0410\u0434\u0440\u0435\u0441: ",j.appendChild(k),j.innerHTML+=a.address,c.appendChild(j),c.appendChild(f),c.appendChild(h),c.innerHTML+="<b>\u0414\u0440\u0443\u0433\u0438\u0435 \u0444\u0430\u043A\u0442\u044B \u043E\u0431 \u044D\u0442\u043E\u043C \u043C\u0435\u0441\u0442\u0435</b>:<br>"+a[fact];var l={picture:a.picture,main_header:a.name,bodyContent:c};return customWindowContent(l)}function makeSingleMarker(a,b){try{var c;return"1"==a.line?c=JSON.parse(localStorage.getItem(ans_true_false)):"2"==a.line&&(c=JSON.parse(localStorage.getItem(ans_quest))),void 0!=typeof c["id"+a.id]&&null!=c["id"+a.id]?makeCompletedTask(a,c["id"+a.id]):makeUncompletedElement(a,b)}catch(f){return console.log(f),makeUncompletedElement(a,b)}}function makeListener(a,b){google.maps.event.addListener(a,"click",function(){$(".window-block2").is(":visible")||($(".user-id-link-block").hide(),bolgewindow.setContent(makeSingleMarker(b,a)),bolgewindow.open())})}function isEmpty(a,b){var c=a==void 0||null==a||""==a||1>a.length||b==void 0||null==b||""==b||1>b.length,f=!1;try{JSON.parse(a),JSON.parse(b),f=!1}catch(g){f=!0}return c||f}function makeSense(a,b,c){var f=JSON.parse(localStorage.getItem(ans_true_false)),g=JSON.parse(localStorage.getItem(ans_quest));infowindow=new google.maps.InfoWindow,bolgewindow=new BolgeWindow,Array.prototype.forEach.call(b,function(h){var k=typeof f["id"+h.id]!=void 0&&null!=f["id"+h.id]?"mrkr.png":"marker.png",m=new google.maps.Marker({position:{lat:parseFloat(h.lat),lng:parseFloat(h.lng)},map:a,title:"HSE RUN MARKER",animation:google.maps.Animation.DROP,icon:{url:"https://hserun.ru/online-quest/img/"+k,scaledSize:new google.maps.Size(50,50)}});makeListener(m,h)}),Array.prototype.forEach.call(c,function(h){var k=typeof g["id"+h.id]!=void 0&&null!=g["id"+h.id]?"mrkr.png":"marker2.png",m=new google.maps.Marker({position:{lat:parseFloat(h.lat),lng:parseFloat(h.lng)},map:a,title:"HSE RUN MARKER",animation:google.maps.Animation.DROP,icon:{url:"https://hserun.ru/online-quest/img/"+k,scaledSize:new google.maps.Size(50,50)}});makeListener(m,h)})}function End_The_Game(){console.log("The quest is ended."),$(".user-id-link-block").fadeOut(),$("#map").fadeOut(),$("#my_score_last").text(getCookie("score")),$(".result-block").hide().fadeIn(400),$(".bolge").hide().fadeIn(400)}function initialize(a,b){$(".load-window").show(),$(".user-id-link-block").show();var c=new google.maps.StyledMapType([{elementType:"geometry",stylers:[{color:"#242f3e"}]},{elementType:"labels.text.stroke",stylers:[{color:"#242f3e"}]},{elementType:"labels.text.fill",stylers:[{color:"#746855"}]},{featureType:"administrative.locality",elementType:"labels.text.fill",stylers:[{color:"#d59563"}]},{featureType:"poi",elementType:"labels.text.fill",stylers:[{color:"#999999"}]},{featureType:"poi.park",elementType:"geometry",stylers:[{color:"#263c3f"}]},{featureType:"poi.park",elementType:"labels.text.fill",stylers:[{color:"#6b9a76"}]},{featureType:"road",elementType:"geometry",stylers:[{color:"#38414e"}]},{featureType:"road",elementType:"geometry.stroke",stylers:[{color:"#212a37"}]},{featureType:"road",elementType:"labels.text.fill",stylers:[{color:"#9ca5b3"}]},{featureType:"road.highway",elementType:"geometry",stylers:[{color:"#746855"}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#1f2835"}]},{featureType:"road.highway",elementType:"labels.text.fill",stylers:[{color:"#f3d19c"}]},{featureType:"transit",elementType:"geometry",stylers:[{color:"#2f3948"}]},{featureType:"transit.station",elementType:"labels.text.fill",stylers:[{color:"#d59563"}]},{featureType:"water",elementType:"geometry",stylers:[{color:"#17263c"}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{color:"#515c6d"}]},{featureType:"water",elementType:"labels.text.stroke",stylers:[{color:"#17263c"}]}],{name:"HSERUN Map"}),f=new google.maps.Map(document.getElementById("map"),{center:{lat:55.751244,lng:37.618423},zoom:11,streetViewControl:!1,fullscreenControl:!1,mapTypeControl:!1,mapTypeControlOptions:{mapTypeIds:["styled_map"]}});google.maps.event.addListener(f,"zoom_changed",function(){google.maps.event.addListenerOnce(f,"bounds_changed",function(){10>this.getZoom()&&this.setZoom(10)})}),makeSense(f,a,b),f.mapTypes.set("styled_map",c),f.setMapTypeId("styled_map"),google.maps.event.addListener(f,"tilesloaded",function(){setTimeout(function(){$(".load-window").remove()},1500)})}function mapLoad(){if(navigator.cookieEnabled){var a,b,c,f,g;isEmpty(localStorage.getItem(ftask_storage),localStorage.getItem(stask_storage))||0!=getCookie("sess").localeCompare(localStorage.getItem("sess"))?(console.log("Downloading the data from server..."),$.ajax({url:php_link,type:"POST",data:"type=setup",timeout:2e4,beforeSend:function(){pushMsg("Loading map data...")},success:function(h){console.log(h);var j=JSON.parse(h);a=j[ftask_storage],b=j[stask_storage],f=j[ans_true_false],c=j[ans_quest],g=getCookie("done_tasks"),localStorage.setItem(ftask_storage,JSON.stringify(a)),localStorage.setItem(stask_storage,JSON.stringify(b)),localStorage.setItem(ans_true_false,JSON.stringify(f)),localStorage.setItem(ans_quest,JSON.stringify(c)),localStorage.setItem("sess",getCookie("sess")),parseInt(g)==Object.keys(a).length+Object.keys(b).length?End_The_Game():initialize(a,b),$(".load-window").remove()},statusCode:{404:function(){pushMsg("<b>Can't reach server</b>")},500:function(){pushMsg("<b>Internal server error.</b>")}},error:function(){pushMsg("Ask admins for help...")}})):(console.log("Loading the data from cache..."),a=JSON.parse(localStorage.getItem(ftask_storage)),b=JSON.parse(localStorage.getItem(stask_storage)),g=parseInt(getCookie("done_tasks")),g==Object.keys(a).length+Object.keys(b).length?End_The_Game():initialize(a,b))}else pushMsg("Turn on browser cookies, please")}$(document).ready(function(){$(window).resize(function(){$(".window-block").css({position:"absolute",display:"none",color:"#1D1D1D",background:"rgba(255,255,255,0.8)","border-radius":"7px",left:($(window).width()-$(".window-block").outerWidth())/2,top:($(window).height()-$(".window-block").outerHeight())/2})}),$(window).resize(),$(window).resize(function(){$(".load-window").css({position:"absolute",left:"50%",top:"50%","margin-left":function(){return-$(this).outerWidth()/2},"margin-top":function(){return-$(this).outerHeight()/2}})}),$(window).resize(),$(window).resize(),$(window).resize(function(){$(".result-block").css({position:"absolute",left:"50%",top:"50%","margin-left":function(){return-$(this).outerWidth()/2},"margin-top":function(){return-$(this).outerHeight()/2}})}),$(window).resize(),$(window).resize(function(){$(".window-block2").css({position:"absolute",left:"50%",top:"50%",display:"none","margin-left":function(){return-$(this).outerWidth()/2},"margin-top":function(){return-$(this).outerHeight()/2}})}),$(window).resize()});function sendFlushorOut(a){$.ajax({url:php_link,type:"POST",data:"type="+a,timeout:2e4,beforeSend:function(){},success:function(b){console.log(b),localStorage.clear(),"logout"==a?(deleteCookie("sess"),deleteCookie(dt_storage)):"flush"==a&&localStorage.setItem("sess",getCookie("sess")),location.reload()},statusCode:{404:function(){pushMsg("<b>Can't reach server.</b>")},500:function(){pushMsg("<b>Internal server error.</b>")}},error:function(){pushMsg("Ask admins for help...")}})}$(document).on("click","#out",function(){sendFlushorOut("logout")}),$(document).on("click","#get_vk",function(a){a.preventDefault(),window.open("https://vk.com/"+$(this).attr("domain"))}),$(document).on("click",".user-id-link",function(){$(".window-block").is(":visible")||($("#my_score").text(getCookie("score")),$(".window-block2").fadeIn(400))}),$(document).on("click","#closeprofile",function(){$(".window-block2").fadeOut(400)}),$(document).on("click",".restart-button",function(){sendFlushorOut("flush")}),$(document).on("click",".share-vk",function(){getCookie("score");window.open("https://vk.com/share.php?url=https://hserun.ru/online-quest/share.php?score="+getCookie("score"),"VK Share","width=500,height=500")});function testing(){var a=prompt("\u0417\u0434\u0435\u0441\u044C \u0432\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u043D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u0438\u043B\u0438 \u043E\u0448\u0438\u0431\u043A\u0443.\n\u0412\u0441\u0435\u0433\u043E \u0434\u0432\u0430 \u043F\u0440\u0430\u0432\u0438\u043B\u0430:\n1.\u041F\u0438\u0448\u0438\u0442\u0435, \u043F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430, \u0441 \u043A\u043E\u0442\u043E\u0440\u043E\u0433\u043E \u0432\u044B \u0437\u0430\u0448\u043B\u0438 \u043D\u0430 \u0441\u0430\u0439\u0442\n2.\u0414\u0430\u0432\u0430\u0439\u0442\u0435 \u0431\u0435\u0437 \u0433\u043B\u0443\u043F\u043E\u0441\u0442\u0435\u0439:)");""!=a&&null!=a&&a!=void 0&&$.ajax({url:php_link,type:"POST",data:"type=sendMsg&message="+a,timeout:2e4,beforeSend:function(){console.log("Sending message...")},success:function(b){console.log(b);"115"===b?(alert("\u0421\u043F\u0430\u0441\u0438\u0431\u043E. \u041E\u0442\u0432\u0435\u0442 \u0437\u0430\u043F\u0438\u0441\u0430\u043D)"),console.log("Done")):"100"===b?alert("\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430."):alert("\u0427\u0442\u043E-\u0442\u043E \u043D\u0435 \u0442\u043E. \u0412\u043E\u0437\u043C\u043E\u0436\u043D\u043E \u0430\u0434\u043C\u0438\u043D \u043F\u044C\u044F\u043D :)")},statusCode:{404:function(){pushMsg("<b>Can't reach server.</b>")},500:function(){pushMsg("<b>Internal server error.</b>")}},error:function(){pushMsg("Ask admins for help...")}})}