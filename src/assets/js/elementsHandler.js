function resizeHorizontalLine() {
    $(".horizontal-line1").css('width',
        $(window).width() -
        parseInt($(".container").css('marginRight')) -
        parseInt($(".container").css('paddingRight')) - 1
    );

    if ($(window).width() <= 991) {
        $(".horizontal-line2").css('width',
            $(window).width() -
            parseInt($("#section_content .container").css('marginRight')) -
            parseInt($("#section_content .container").css('paddingRight')) - 1

        );
        if ($(window).width() <= 575) {
            $(".horizontal-line3").css('width',
                $(window).width() -
                parseInt($("#section_content .container").css('marginRight')) -
                parseInt($("#section_content .container").css('paddingRight')) - 30
            );
        } else {
            $(".horizontal-line2").css('width',
                $(window).width() -
                parseInt($("#section_content .container").css('marginRight')) -
                parseInt($("#section_content .container").css('paddingRight')) -
                parseInt($("#sidebar").css('width')) - 1
            );
            $(".horizontal-line3").css('width',
                $(window).width() -
                parseInt($("#section_content .container").css('marginRight')) -
                parseInt($("#section_content .container").css('paddingRight')) -
                parseInt($(".user-info").css('width')) - 35
            );
        }
    }
}

function positionPercent() {
    var element = $("#page-conta .course-outter .number");
    element.each(function () {
        var value = Number($(this).text());

        if (value <= 10)
            $(this).parent().css('left', value + 10 + '%');
        else if (value >= 90)
            $(this).parent().css('left', value - 20 + '%');
        else if (value > 10)
            $(this).parent().css('left', value - 10 + '%');
    });
}

$(document).ready(function () {
    resizeHorizontalLine();
    positionPercent();
});

$(window).resize(function () {
    resizeHorizontalLine();
    positionPercent();
});

function resizeBanner() {
    $(".header-trilha-sobre").css('width',
        $(window).width() -
        parseInt($(".container").eq(0).css('marginRight')) -
        parseInt($(".container").eq(0).css('paddingRight')) - 1
    );
}


$(document).ready(function () {
    resizeBanner();
});

function displayRecover() {
    $("#login_screen").hide();
    $("#recover_screen").show();
  }
  
  function displayLogin() {
    $("#login_screen").show();
    $("#recover_screen").hide();
  }


  function changeNameTutoria(e) {
     
}

