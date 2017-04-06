!function(){"use strict";var t=function(){return window.location.pathname.indexOf("/fr.")!==-1||window.location.pathname.indexOf("/fr/")!==-1?"fr":"en"}(),e=function(){return window.outerWidth}(),a=new EventEmitter,n=function(t,e,a){var n;return function(){var o=this,i=arguments,r=function(){n=null,a||t.apply(o,i)},s=a&&!n;clearTimeout(n),n=setTimeout(r,e),s&&t.apply(o,i)}},o=function(){function t(){a(),$(".more-section-menuitem").on("click",n(o,500,!0)),$(".more-section-menu-mobile-title").on("click",d),$(".close-button").on("click",l),$(".js-open-socialdrawer").on("click",u)}function a(){$(window).resize(function(){e<640?($(".tertiary-cta-more").removeClass("animate"),"flex"===$(".more-section-menu").css("display")&&$(".more-section-menu").css("display","block")):"block"===$(".more-section-menu").css("display")&&$(".more-section-menu").css("display","flex")})}function o(t){try{t.returnValue=!1}catch(e){t.preventDefault()}var a=$(this),n=a.offset(),o=a.width(),l=n.left+o/2-50,d=a.attr("class").match(/[\w-]*category[\w-]*/g),u=a.text();i(d),r(u),s(l),c()}function i(t){$(".more-section-menu-dropdown-category-wrapper").hide(),$("."+t[0]).fadeIn("slow").focus(),$(".more-section-menu-dropdown").addClass("active")}function r(t){$("p.more-section-tagline-tag").fadeOut(),$("h1.more-section-tagline-tag").removeClass("active"),setTimeout(function(){$("h1.more-section-tagline-tag").addClass("active").text(t)},200)}function s(t){$(".more-section-menu-dropdown-arrow-up").delay(5e3).show().css({left:t})}function c(){$(".tertiary-cta-more").removeClass("animate"),setTimeout(function(){$(".tertiary-cta-more").addClass("animate")},100)}function l(){$(".more-section-menu-dropdown-category-wrapper").hide(),$(".more-section-menu-dropdown-arrow-up").hide(),$(".tertiary-cta-more").removeClass("animate"),$("h1.more-section-tagline-tag").removeClass("active"),$("p.more-section-tagline-tag").fadeIn("slow"),$(".more-section-menu-dropdown").removeClass("active")}function d(){$(".more-section-menu").toggleClass("active"),$(this).toggleClass("active")}function u(){var t=$(this).next();t.hasClass("js-socialdrawer-opened")?t.removeClass("js-socialdrawer-opened"):t.addClass("js-socialdrawer-opened")}return{init:t}}(),i=function(){function t(){l=$(".ig-form"),c=l.find("form"),r=l.find("form").data("endpoint"),s=l.find("form").data("cancel"),e(),i()}function e(){var t=$(":input, textarea");t.change(function(t){$(this).addClass("dirty")}),$.validator.setDefaults({debug:!0,success:"valid"}),$.validator.addMethod("cdnPostal",function(t,e){return this.optional(e)||t.match(/[a-zA-Z][0-9][a-zA-Z](-| |)[0-9][a-zA-Z][0-9]/)},"Please specify a valid postal code."),c.validate({submitHandler:function(){a()},errorPlacement:function(t,e){$(e).closest(".row").find(".custom-error-location").length?$(e).closest(".row").find(".custom-error-location").append(t):$(e).parent().append(t)},rules:{phone:{required:!0,phoneUS:!0},phone2:{required:!0,phoneUS:!0},postal_code:{required:!0,cdnPostal:!0},firstname:{required:!0,maxlength:100},lastname:{required:!0,maxlength:100},email:{required:!0,maxlength:100},email2:{required:!0,maxlength:100}}}),c.find("button.cancel").on("click",function(){window.location.replace(s)})}function a(t){var e,a;return c.valid()&&(c.removeClass("server-error"),l.addClass("submitting"),e=c.serializeArray(),a=n(e),o(a)),!1}function n(t){return t}function o(t){$.ajax({method:"POST",url:r,data:t}).success(function(t){l.addClass("success"),l.removeClass("submitting")}).error(function(t){c.addClass("server-error"),l.removeClass("submitting"),ScrollMan.to($("#server-error"))})}function i(){$(".toggler").on("click",function(){$(".toggle-content").hide(),$("."+$(this).data("content")).show()})}var r,s,c,l;return{init:t}}(),r=function(){function t(){console.log("Carousel Initialized!"),$("[data-responsive-toggle] button").on("click",function(){$("body").toggleClass("site-header-is-active")}),e()}function e(){var t,e,a;$(".ig-carousel").each(function(n){a=$(this),t=a.data("prevArrowText")?'<button type="button" class="slick-prev"><span class="show-for-sr">'+a.data("prevArrowText")+"</span></button>":'<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',e=a.data("nextArrowText")?'<button type="button" class="slick-next"><span class="show-for-sr">'+a.data("nextArrowText")+"</span></button>":'<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>',a.slick({adaptiveHeight:a.data("adaptiveHeight")||!1,arrows:a.data("arrows")||!1,autoPlay:a.data("autoPlay")||!1,dots:a.data("dots")||!1,fade:a.data("fade")||!1,infinite:a.data("infinite")||!1,mobileFirst:!0,nextArrow:e,prevArrow:t,responsive:a.data("responsive")||"",slide:a.data("slide")||"",slidesToScroll:a.data("slideToScroll")||1,slidesToShow:a.data("slidesToShow")||1,speed:a.data("speed")||300})})}return{init:t}}(),s=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var a=arguments[e];for(var n in a)Object.prototype.hasOwnProperty.call(a,n)&&(t[n]=a[n])}return t},c=function(){function t(){f=e(),d=$(".ig-shuffled-carousel").data("articles").articles,p=$(".ig-shuffled-carousel").data("name"),v=$(".ig-shuffled-carousel").data("limit"),u=f[p]?f[p]:{},c(i())}function e(){return"undefined"!=typeof Storage?localStorage.getItem("ig")?JSON.parse(localStorage.getItem("ig")):a():void console.warn("localstorage is not available!")}function a(){return localStorage.setItem("ig",JSON.stringify({})),JSON.parse(localStorage.getItem("ig"))}function n(t){var e=s({},u);t.forEach(function(t,a){a<=1&&Object.keys(t).map(function(a){e[a]=t[a]})}),f[p]=e,localStorage.setItem("ig",JSON.stringify(f))}function o(){delete f[p],localStorage.setItem("ig",JSON.stringify(f))}function i(){var e,a=[];return Object.keys(d).forEach(function(t,e){var n={};n[t]=d[t],u[t]||a.push(n)}),e=a.splice(0,v),e.length<v?(u={},o(),t()):r(e)}function r(t){for(var e,a,n=t.length;0!==n;)a=Math.floor(Math.random()*n),n-=1,e=t[n],t[n]=t[a],t[a]=e;return t}function c(t){var e,a=[];t&&(t.forEach(function(t){Object.keys(t).map(function(e){a.push(t[e])})}),e=Mustache.to_html($("#"+p).html(),{articles:a}),$(".ig-shuffled-carousel").html(e),n(t),l())}function l(){var t,e,a;$(".ig-carousel").not(".slick-initialized").each(function(n){a=$(this),t=a.data("prevArrowText")?'<button type="button" class="slick-prev"><span class="show-for-sr">'+a.data("prevArrowText")+"</span></button>":'<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',e=a.data("nextArrowText")?'<button type="button" class="slick-next"><span class="show-for-sr">'+a.data("nextArrowText")+"</span></button>":'<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>',a.slick({adaptiveHeight:a.data("adaptiveHeight")||!1,arrows:a.data("arrows")||!1,autoPlay:a.data("autoPlay")||!1,dots:a.data("dots")||!1,fade:a.data("fade")||!1,infinite:a.data("infinite")||!1,mobileFirst:!0,nextArrow:e,prevArrow:t,responsive:a.data("responsive")||"",slide:a.data("slide")||"",slidesToScroll:a.data("slideToScroll")||1,slidesToShow:a.data("slidesToShow")||1,speed:a.data("speed")||300})})}var d,u,f,p,v;return{init:t}}(),l=function(){function t(){e(),s=setInterval(function(){$(".vjs-plugins-ready").length&&(o(),clearInterval(s))},500),r()}function e(){var t,e,o={},i=["auto","metadata","none"];$(".ig-video-group").each(function(){t=$(this),o.account=t.data("account"),o.player=t.data("player"),a(o),t.find(".ig-video-js").each(function(t){e=$(this),o.id=e.data("id"),o.overlay=e.data("overlay")?e.data("overlay"):"",o.title=e.data("title")?e.data("title"):"",o.description=e.data("description")?e.data("description"):"",o.auto=e.data("autoplay")?"autoplay":"",o.ctrl=e.data("controls")?"controls":"",o.preload=i.indexOf(e.data("preload"))>-1?e.data("preload"):"auto",o.transcript=e.data("transcript")?e.data("transcript"):"",c.push(o.id),n(e,o,t)})})}function a(t){var e='<script src="//players.brightcove.net/'+t.account+"/"+t.player+'_default/index.min.js"></script>';$("body").append(e)}function n(t,e,a){var n='<div class="video-container"><div class="video-container-responsive">';e.overlay.length>0&&(n+='<span class="video-overlay '+e.id+'" style="background-image: url(\'../'+e.overlay+"');\"></span>"),n+='<video data-setup=\'{"techOrder": ["html5"]}\' data-video-id="'+e.id+'" preload="'+e.preload+'" data-account="'+e.account+'" data-player="'+e.player+'" data-embed="default" data-application-id="'+a+'" class="video-js" id="'+e.id+'" '+e.ctrl+" "+e.auto+"></video></div>",e.transcript.length>0&&(n+='<div class="video-transcript"><a target="_blank" href="'+e.transcript+'">Transcript</a></div>'),n+='</div><h2 class="video-title">'+e.title+'</h2><p class="video-description">'+e.description+"</p>",t=t.replaceWith(n),e.overlay&&$(document).on("click","#"+e.id,function(){$(this).siblings(".video-overlay").hide()})}function o(){var t;c.forEach(function(e){videojs("#"+e).ready(function(){t=this,t.on("play",i),l.push(t)})})}function i(t){var e=t.target.id;l.forEach(function(t){t.id()!==e&&videojs(t.id()).pause()})}function r(){$(window).scroll(function(){l.forEach(function(t){$("#"+t.id()).visible()||videojs(t.id()).pause()})})}var s,c=[],l=[];return{init:t}}(),d=function(){function t(t){var a=$(t);n=["Hello!","Is it me you're looking for?","I can see it in your eyes","I can see it in your smile","You're all I've ever wanted","And my arms are open wide","'cause you know just what to say","And you know just what to do","And I want to tell you so much"],a.find("a.button.message").on("click",event,e)}function e(){a.emit("hello",n[o]),o+=1}var n=[],o=0;return{init:t}}(),u=function(){function t(t){n=$(t),e()}function e(){a.on("hello",function(t){$('<p class="alert-box alert">'+t+"</p>").hide().appendTo(n).fadeIn("fast")})}var n;return{init:t}}(),f=function(){function e(){$(document).foundation(),$(".ig-form").length&&i.init(),$(".more-section").length&&o.init(),$(".ig-carousel").length&&r.init(),$(".ig-shuffled-carousel").length&&c.init(),$(".ig-video-group").length&&l.init(),$(".ig-evt1").length&&d.init(".ig-evt1"),$(".ig-evt2").length&&u.init(".ig-evt2"),a()}function a(){$("body").addClass(t)}return{init:e}}();$(document).ready(function(){f.init()})}();