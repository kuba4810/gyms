$(document).ready(function(){
    //------------------------------------------------------------//
    //  ZDARZENIA POJAWIAJĄCE SIĘ NA STRONIE , GŁÓWNIE KLIKNIĘCIA //
    //------------------------------------------------------------//
    //------------------------------------------------------------//




    //Kliknięcie na kategorie wyszukiwania zapytań
    $(".category").on('click', function () {
        $(".topicsGroupTitle").text($(this).text().toUpperCase());
    });
    //------------------------------------------------



    $(window).on('scroll', function () {

        if ($(document).scrollTop() > 100) {
            $(".arrow").fadeIn(300);
        } else {
            $(".arrow").fadeOut(530);
        }

    });


    $(".arrow").on('click', function () {
        $("html, body").animate({
            scrollTop: '0'
        }, 500);
    });

    var isLoginShowed = false;

    /*LOGOWANIE*/
    //------------------------------------------------
    $("#login").on('click', function () {
        // $("body").css("overflow", "hidden");
        $(".login").fadeIn(500);

    });

    $(".login .close").on('click', function () {
        $(".login").fadeOut(500);
        $("body").css("overflow", "auto");
    });
    //------------------------------------------------
    //------------------------------------------------

    //REJESTRACJA
    //------------------------------------------------

    $("#registration").on('click', function () {
        // $("body").css("overflow", "hidden");
        $(".register").fadeIn(500);

    });

    $(".register .close").on('click', function () {
        $(".register").fadeOut(500);
        $("body").css("overflow", "auto");
    });
    //------------------------------------------------

    //SHOW USER MENU
    //------------------------------------------------
    var userMenuHidden = true;

    $(".loginUser").on('click', function () {
        $(".userMenu").slideToggle(100);
        if (userMenuHidden) {
            $(".userMenuContainer").animate({
                top: '0'
            }, 100);
            userMenuHidden = false;
        } else {
            $(".userMenuContainer").animate({
                top: '-15px'
            }, 100);
            userMenuHidden = true;
        }
    });

    //LOGOUT
    //------------------------------------------------

    $(".logOut").on('click', function () {
        localStorage.removeItem("logedIn");
        localStorage.removeItem("logedNick");

        $(".loginUser").fadeOut();
        $(".userMenu").fadeOut();

        location = "forum.html";

    })

    //------------------------------------------------
    //------------------------------------------------


});