"use strict";$(function(){$(document).foundation(),$("[data-responsive-toggle] button").on("click",function(){$("body").toggleClass("site-header-is-active")}),$(".text-carousel").slick({dots:!0,speed:300,infinite:!0,mobileFirst:!0,slidesToShow:1,slidesToScroll:1,prevArrow:'<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',nextArrow:'<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>'}),$(".carousel").slick({dots:!0,infinite:!0,speed:300,mobileFirst:!0,slidesToShow:1,slidesToScroll:1,prevArrow:'<button type="button" class="slick-prev"><span class="show-for-sr">Previous</span></button>',nextArrow:'<button type="button" class="slick-next"><span class="show-for-sr">Next</span></button>',responsive:[{breakpoint:640,settings:{slidesToShow:2,slidesToScroll:2}}]})}),$(function(){$(".more-section-menuitem").on("click",function(t){t.preventDefault();var o=$(this).attr("class").match(/[\w-]*category[\w-]*/g);$(".more-section-menu-dropdown-category").show().filter(":not(."+o+")").hide();var e=$(this).text();$("p.more-section-tagline-tag").hide(),$("h1.more-section-tagline-tag").addClass("active").text(e);var s=$(this),n=s.offset(),i=s.width(),r=n.left+i/2-50;$(".more-section-menu-dropdown-arrow-up").show(),$(".more-section-menu-dropdown-arrow-up").css({left:r}),$(".tertiary-cta-more").addClass("active")}),$(".more-section-menu-mobile-title").on("click",function(t){t.preventDefault(),$(".more-section-menu-mobile").toggle()})}),$(".help-topics-accordion").on("up.zf.accordion",function(t){setTimeout(function(){$("html,body").animate({scrollTop:$(".is-active").offset().top},"slow")},10)});