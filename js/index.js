const commentList = $("#testimonial ul");
const copyright = $(".copyright");
const emailAddress = $(".inbox-update input");
const innerSlider = $("#testimonial .container .slider ul");
const menu = $(".menu-section");
const menuToggler = $(".menu-toggler");
const slider = $("#testimonial .container .slider");
const sliderBtn = $(".slider-btn button");
const warning = $(".warning");

let sliderItem;

function CheckEmail() {
    const emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (emailRegex.test(emailAddress.val()) === false) {
        warning.show();
    }
    else {
        warning.hide();
    }
}

function CheckBoundary() {
    let outer = slider[0].getBoundingClientRect();
    let inner = innerSlider[0].getBoundingClientRect();

    if (parseInt(innerSlider.css("left")) > 0) {
        innerSlider.eq(0).css("left", "0");
    }
    else if (inner.right < outer.right) {
        innerSlider.eq(0).css("left", `-${inner.width - outer.width}px`);
    }
}

function CarouselDesktop() {
    let pressed = false;
    let startX;
    let x;

    slider.mousedown(function(e) {
        pressed = true;
        startX = e.offsetX - innerSlider.offset().left;
    });

    $(window).mouseup(function() {
        pressed = false;
    });

    slider.mousemove(function(e) {
        if (!pressed) return;
        e.preventDefault();

        x = e.offsetX;

        innerSlider.eq(0).css("left", `${x - startX}px`);

        CheckBoundary();
    });
}

function CarouselMobile() {
    innerSlider.css("left", "0");
    sliderBtn.eq(0).addClass("chosen");
    sliderBtn.click(function() {
        sliderBtn.removeClass("chosen");
        $(this).addClass("chosen");
        innerSlider.eq(1).css("left", "-" + ($(this).index() * 100) + "%");
    });
}

function ChangeScreenWidth() {
    if ($(window).width() < 992) {
        CarouselMobile();
    }
    else {
        CarouselDesktop();
    }
}

$("a").click(function(event) {
    event.preventDefault();
});

menu.hide();
warning.hide();

copyright.text("Copyright " + new Date().getFullYear() + ". All Rights Reserved");

$(document).ready(function(){
    menuToggler.on('click', function(){
        if (menu.is(":hidden")) {
            menuToggler.addClass("active");
            menu.show();
        }
        else {
            menuToggler.removeClass("active");
            menu.hide();
        }
    });
    
    // Close modal on click outside at anywhere
    $(document).on('click',function(e){
        if(!(($(e.target).closest("#menu").length > 0) || ($(e.target).closest(".menu-toggler").length > 0))){
            menuToggler.removeClass("active");
            menu.hide();
        }
    });
});

$(function() {
    $.getJSON("data.json", function(data) {
        $.each(data.comment, function(i, f) {
            var commentHTML = "" +
            "<img class='avatar' src='" + f.avatar + "' alt='Avatar'>" +
            "<h3>" + f.name + "</h3>" +
            "<p>" + f.text + "</p>";

            $("<li>" + commentHTML + "</li>").appendTo(commentList);
        });
    })
});

ChangeScreenWidth();
$(window).resize(ChangeScreenWidth);
$(window).resize(CarouselDesktop);