$.alerty = function(options) {

    var defaults = {
        widthPercent: 80,
        heightPercent: 80,
        fadeSpeed: 1000,
        buttonTimeOut: 200,
        buttonAlign: 'right',
        bodyCSS : {position:"fixed",
                   'z-index': 2000,
                   overflow: 'hidden',
                   backgroundColor: '#EBEBEB',
                   borderColor: 'darkred',
                   color: '#FFF',
                   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                   },
        barCSS : { overflow: 'hidden',
                   background: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAoCAYAAAAPOoFWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAPZJREFUeNq81tsOgjAMANB2ov7/7ypaN7IlIwi9rGuT8QSc9EIDAsAznxvY4pXPKr05RUE5MEVB+TyWfCEl9LZApYopCmo9C4FKSMtYoI8Bwv79aQJU4l6hXXCZrQbokJEksxHo9KMOgc6w1atHXM8K9DVC7FQnJ0i8iK3QooGgbnyKgMDygBWyYFZoqx4qS27KqLZJjA1D0jK6QJcYEQEiWv9PGkTsbqxQ8oT+ZtZB6AkdsJnQDnMoHXHLGKOgDYuCWmYhEERCI5gaamW0bnHdA3k2ltlIN+2qKRyCND0bhqSYCyTB3CAOc4WusBEIpkeBuPgJMAAX8Hs1NfqHRgAAAABJRU5ErkJggg==') repeat-x scroll left top #fff",
                   backgroundColor: 'red',
                   borderColor: 'darkred',
                   color: '#FFF',
                   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                 },
        buttons : {
                    "close": {"value": "Aizvērt!", onClick: function(){}}
                    },
        onAlertShow : function(){},
        onAlertClose: function(){}
    };

    var settings = $.extend({}, defaults, options);

    var alertySPData = calculateSizePosition(settings.heightPercent, settings.widthPercent);

    var alerty = showAlerty(alertySPData.width, alertySPData.height, alertySPData.top, alertySPData.left, settings);

    alerty.ready(function(){
        $("body").append(alerty.fadeIn(settings.fadeSpeed));
    });
};

$.closeAlerty = function(options) {
    var defaults = {
        fadeSpeed: 1000,
        onAlertClose: function(){}
    };

    var settings = $.extend({}, defaults, options);

    $("#alert_box").fadeOut(settings.fadeSpeed, function(){
        settings.onClick.call(this);
        $("#alert_box").remove();
    })
}

function calculateSizePosition(widthPercent, heightPercent) {
    var width = Math.round($(window).width() / 100 * widthPercent);
    var height = Math.round($(window).height() / 100 * heightPercent);
    var top = Math.max(0, (($(window).height() - height) / 2) + $(window).scrollTop());
    var left = Math.max(0, (($(window).width() - width) / 2) + $(window).scrollLeft());

    return {'width': width, 'height': height, 'top': top, 'left': left}
}

function showAlerty(width, height, top, left, settings) {
    var alertBox = $("<div>").attr("id", "alert_box").attr("style", "width: "+width+"px; height: "+height+"px; top:"+top+"px; left:"+left+"px;").css(settings.bodyCSS);
    var buttonBar = $("<div>").attr("id", "button_bar").css(settings.barCSS);

    if (settings.btnBarCss == undefined) {
        switch(settings.buttonAlign)
        {
            case 'right':
                buttonBar.attr("align","right");
                break;
            case 'left':
                buttonBar.attr("align","left");
                break;
        }
    }

    buttonBar.ready(function(){
        alertBox.append(buttonBar);

        if (settings.text != undefined) {
            var text = $("<div>").html(settings.text);
            if (settings.textCSS != undefined) {
                text.css(settings.textCSS);
            }
            alertBox.append(text);
        }

        if (settings.url != undefined) {
            var content = $("<div>").load(settings.url);
             alertBox.append(content);
        }
    });

    $.each(settings.buttons, function(btnname, btnSettings) {
        buttonBar.append(Btn(btnname, btnSettings));
    })

    settings.onAlertShow.call(this);
    return alertBox;
}

function Btn(btnname, btnSettings) {
    var button = null;
    if (undefined == btnSettings.img) {
        if(undefined != btnSettings.value) {
             button = $("<input>").attr("type", "button").attr("value", btnSettings.value).attr("id", btnname);
             button.hide();
        }
    } else {
            button = $("<img>").attr("src", btnSettings.img);
            button.hide();
        }
    if (btnSettings.delay != undefined) {
        if (btnSettings.speed != undefined) {
            setTimeout(function() {button.fadeIn(btnSettings.speed);}, btnSettings.delay);
        } else {
            setTimeout(function() {button.fadeIn(1000);}, btnSettings.delay);
        }
    } else {
        button.show();
    }
    if (btnSettings.css != undefined){
        button.css(btnSettings.css);
    }
    button.bind('click', function(){btnClick(btnSettings);});
    return button;
}

function btnClick(btnSettings) {
    btnSettings.onClick.call(this);
}
