"use strict";$(function(){$(document).foundation(),$("[data-responsive-toggle] button").on("click",function(){$("body").toggleClass("site-header-is-active")}),$(".text-carousel").slick({dots:!0,speed:300,infinite:!0,mobileFirst:!0,slidesToShow:1,slidesToScroll:1,prevArrow:'<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',nextArrow:'<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>'}),$(".carousel").slick({dots:!0,infinite:!0,speed:300,mobileFirst:!0,slidesToShow:1,slidesToScroll:1,prevArrow:'<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',nextArrow:'<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>',responsive:[{breakpoint:640,settings:{slidesToShow:2,slidesToScroll:2}}]}),$(".homepage-carousel").slick({dots:!0,infinite:!0,speed:500,mobileFirst:!0,slidesToShow:1,slidesToScroll:1,arrows:!1,prevArrow:'<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',nextArrow:'<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>',responsive:[{breakpoint:640,settings:{fade:!0}},{breakpoint:1024,settings:{arrows:!0,fade:!0}}]}),$(".js-open-socialdrawer").click(function(){var e=$(this).next();e.hasClass("js-socialdrawer-opened")?e.removeClass("js-socialdrawer-opened"):e.addClass("js-socialdrawer-opened")})}),$(function(){$(".more-section-menuitem").on("click",function(e){e.preventDefault();var s=$(this).attr("class").match(/[\w-]*category[\w-]*/g);$(".more-section-menu-dropdown-category-wrapper").fadeIn("slow").focus().filter(":not(."+s+")").hide(),$(".more-section-menu-dropdown").addClass("active");var o=$(this).text();$("p.more-section-tagline-tag").fadeOut(),$("h1.more-section-tagline-tag").removeClass("active"),setTimeout(function(){$("h1.more-section-tagline-tag").addClass("active").text(o)},200);var t=$(this),n=t.offset(),i=t.width(),a=n.left+i/2-50;$(".more-section-menu-dropdown-arrow-up").show().css({left:a}),$(".tertiary-cta-more").removeClass("animate"),setTimeout(function(){$(".tertiary-cta-more").addClass("animate")},100)}),$(".more-section-menu-mobile-title").on("click",function(){$(".more-section-menu").toggleClass("active"),$(this).toggleClass("active")}),$(".close-button").on("click",function(){$(".more-section-menu-dropdown-category-wrapper").hide(),$(".more-section-menu-dropdown-arrow-up").hide(),$(".tertiary-cta-more").removeClass("animate"),$("h1.more-section-tagline-tag").removeClass("active"),$("p.more-section-tagline-tag").fadeIn("slow"),$(".more-section-menu-dropdown").removeClass("active")})}),$(window).resize(function(){var e=$(document).width();e<640&&($(".tertiary-cta-more").removeClass("animate"),"flex"===$(".more-section-menu").css("display")&&$(".more-section-menu").css("display","block")),e>640&&"block"===$(".more-section-menu").css("display")&&$(".more-section-menu").css("display","flex")}),$(".help-topics-accordion").on("up.zf.accordion",function(e){setTimeout(function(){$("html,body").animate({scrollTop:$(".is-active").offset().top},"slow")},10)});