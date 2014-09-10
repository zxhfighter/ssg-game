var SSG = SSG || {};

SSG.Index = (function(){
    function init() {
        // 初始化数据，包括用户名，哪些游戏已过关
        initData();

        // 绑定事件，主要是页面调整
        bindEvents();

        if (!store.get('hasShowPhoneTip')) {
            showPhone();
        }
        else {
            jQuery('.main').show();
            jQuery('.logo-game').show();
            jQuery('.text-bottom').show();

            jQuery('.left-tri').show();
            jQuery('.right-tri').show();
            jQuery('.bottom-tri').show();

            fadeIn();
        }

        // 游戏列表浮出效果
        // fadeIn();
    }

    function showPhone() {
        jQuery('.phone-bg').show();

        jQuery('.phone').fadeIn('slow', function () {

            if (screen.availHeight > 1000) {
                jQuery(this).css('top', '115px');
            }
            else {
                jQuery(this).css('top', '15px');
            }
            

            delay(1000, function () {
                jQuery('.p1').css('top', '100px');
            });

            delay(3000, function () {
                jQuery('.p2').css('top', '170px');
            });

            delay(6000, function () {
                jQuery('.p3').css('top', '260px');
            });
            
            delay(9000, function () {
                jQuery('.p4').css('top', '330px');
            });

            delay(12000, function () {
                jQuery('.btn-go').fadeIn();
                
            });

            store.set('hasShowPhoneTip', true);
        });
    }

    function delay(time, callback) {
        setTimeout(
           function() {
               callback && callback();
           },
           time
       );   
    }

    // 游戏列表浮出效果
    function fadeIn() {
        var games = jQuery('.games li');
        var step = 500;
        var time = 500;
       
        games.eq(0).animate({'opacity': 1}, 800)
            .end().delay(250)
            .eq(1).animate({'opacity': 1}, 800)
            .end().delay(250)
            .eq(2).animate({'opacity': 1}, 800)
            .end().delay(250)
            .eq(3).animate({'opacity': 1}, 800)
            .end().delay(250)
            .eq(4).animate({'opacity': 1}, 800)
            .end().delay(250)
            .eq(5).animate({'opacity': 1}, 800);
    }

    // 初始化
    function initData() {
        var userName = store.get('userName');
        var games  = store.get('games');
        var allPass = store.get('allPass');
        var prizeId = store.get('prizeId');

        if (!userName) {
            window.location = '/login.html';
        }

        if (prizeId) {
            jQuery('.prizeName').text(SSG.PRIZES[prizeId]);
            jQuery('#noPassTip').hide();
            jQuery('#passTip').show();
        }

        jQuery('#userName').text(userName);

        jQuery('.games li').each(function (index, li) {
            var pass = games ? games[index + 1] : 0;
            if (pass) {
                // 如果游戏过关，模糊并使游戏不可点击
                jQuery(li).addClass('passed');
            }
        });
    }

    function bindEvents() {

        jQuery('.btn-go').on('click', function () {
            jQuery('.phone').hide();
            jQuery('.phone-bg').hide();
            // jQuery('.footer').hide();

            jQuery('.main').show();
            jQuery('.logo-game').show();
            jQuery('.text-bottom').show();
            jQuery('.left-tri').show();
            jQuery('.right-tri').show();
            jQuery('.bottom-tri').show();
            
            fadeIn();
        });
    }

    return {
        init: init
    };
})();

jQuery(function () {
    SSG.Index.init();
});