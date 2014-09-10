// 避免冲突，以后jQuery操作全部用jq来代替
window.jq = jQuery.noConflict();

// 全局命名空间
var SSG = SSG || {};

// 实用函数
SSG.Util = {

    // 解析JSON
    parseJSON: function (data) {

        // 如果是对象就直接返回
        if (typeof data === 'object') {
            return data;
        }

        if (typeof data === 'string') {
            if (window.JSON) {
                return JSON.parse(data);
            }
            else {
                return eval('(' + data + ')');
            }
        }

        return {};
    },

    // 包装AJAX请求
    request: function(method, url, params, onsuccess, onfail) {
        // 所有请求附带userName
        var userName = store.get('userName') || '';
        if (typeof params === 'object' && !params.userName) {
            params.userName = userName;
        }
        else if (typeof params === 'string') {
            params += '&userName=' + userName;
        }

        jQuery.ajax({ 
            type: method,
            url: url,
            data: params
        }).done(function (data) {
            onsuccess(SSG.Util.parseJSON(data));
        }).fail(function (data) {
            onfail(SSG.Util.parseJSON(data));
        });
    },

    // GET请求
    get: function(url, params, onsuccess, onfail) {
        SSG.Util.request('GET', url, params, onsuccess, onfail);
    },

    // POST请求
    post: function(url, params, onsuccess, onfail) {
        SSG.Util.request('POST', url, params, onsuccess, onfail);
    },

    // 网页大小改变，计算高度
    calcHeight: function() {
        var headerHeight = jQuery('header').eq(0).height();
        var footerHeight = jQuery('footer').eq(0).height();
        var clientHeight = jQuery(window).height();
        var contentHeight = jQuery('.content').eq(0).height();
        var main = jQuery('#Main');
        var mainHeight = clientHeight - headerHeight - footerHeight - 40;

        main.height(mainHeight + 'px');
    },

    // 简易clone方法
    clone: function(obj) {
        var i, newObj = (obj instanceof Array) ? [] : {};
        for (i in obj) {
            if (i === 'clone') {
                continue;
            }
            if (obj[i] && typeof obj[i] === "object") {
                newObj[i] = SSG.Util.clone(obj[i]);
            } else {
                newObj[i] = obj[i];
            }
        }
        return newObj;
    },

    // 弹出款
    alert: function(msg, callback, buttonText) {
        var overlay = jQuery('#overlay');
        if (!overlay.length) {
            overlay = jQuery('<div id="overlay" class="overlay">1</div>')
                      .css('width', jQuery(document).width())
                      .css('height', jQuery(document).height());

            document.body.appendChild(overlay[0]);
        }

        var dialog = jQuery('.dialog');
        if (!dialog.length) {
            var dialogHtml = [
                '<div class="dialog">',
                    '<div class="dialog-title">提示</div>',
                    '<div class="dialog-content"></div>',
                    '<div class="dialog-foot clearfix">',
                        '<div class="dialog-ok">关 闭</div>',
                    '</div>',
                '</div>'
            ];

            dialog = jQuery(dialogHtml.join(''));
            document.body.appendChild(dialog[0]);

            jQuery('.dialog-ok', dialog).on('click', function () {
                dialog.hide();
                overlay.fadeOut();
                callback && callback();
            });
        }
        
        var dialogContent = jQuery('.dialog-content', dialog);
        dialogContent.html(msg);

        if (buttonText) {
            jQuery('.dialog-ok', dialog).text(buttonText);
        }
        else {
            jQuery('.dialog-ok', dialog).text('关 闭');
        }

        overlay.fadeIn(function () {
            dialog.show();
        }); 
    },

    // 检查支持canvas
    checkCanvas: function () {
        var canvas = document.createElement('canvas');
        if (typeof canvas.getContext != 'undefined') {
            return true;
        }
        window.location = '/ie.html';
    }
};

// DAO请求
SSG.Dao = {
    userLogin: function(paramObj, onsuccess, onfail) {
        SSG.Util.get('/user/userLogin.action', paramObj, onsuccess, onfail);    
    },

    passGame: function(paramObj, onsuccess, onfail) {
        SSG.Util.get('/user/passGame.action', paramObj, onsuccess, onfail);
    },

    getPrizes: function(paramObj, onsuccess, onfail) {
        SSG.Util.get('/user/getPrizes.action', paramObj, onsuccess, onfail);
    },

    winPrize: function(paramObj, onsuccess, onfail) {
        SSG.Util.get('/user/winPrize.action', paramObj, onsuccess, onfail);
    },

    inviteFriends: function(paramObj, onsuccess, onfail) {
        SSG.Util.get('/user/inviteFriends.action', paramObj, onsuccess, onfail);
    }
};

// 游戏列表
SSG.GAME_MAP = {
    '1024': 1,
    'BIRD': 2,
    'BREAKOUT': 3,
    'COLOR': 4,
    'PACMAN': 5,
    'SNAKE': 6
};

// 游戏详情
SSG.GAMES = [
    {
        'gameId': SSG.GAME_MAP['1024'],
        'gameName': '1024'
    },
    {
        'gameId': SSG.GAME_MAP.BIRD,
        'gameName': 'Flappy Bird'
    },
    {
        'gameId': SSG.GAME_MAP.BREAKOUT,
        'gameName': 'Breakout'
    },
    {
        'gameId': SSG.GAME_MAP.COLOR,
        'gameName': 'Color'
    },
    {
        'gameId': SSG.GAME_MAP.PACMAN,
        'gameName': 'Pacman'
    },
    {
        'gameId': SSG.GAME_MAP.SNAKE,
        'gameName': 'Snake'
    }
];

// 奖品映射
SSG.PRIZE_MAP = {
    'NONE': 0,
    'HUAXIA': 1,
    'TICKET': 2,
    'WEIDUOMEI': 3,
    'JD100': 4
};

// 奖品名字
SSG.PRIZES = {
    '0': '再来一次',
    '1': '华夏良子券',
    '2': '电影票',
    '3': '味多美',
    '4': '京东100元购物卡'
};

// 奖品名字
// SSG.PRIZES = [
//     {
//         'prizeId': SSG.PRIZE_MAP.NONE,
//         'prizeName': '再来一次'
//     },
//     {
//         'prizeId': SSG.PRIZE_MAP.HUAXIA,
//         'prizeName': '华夏良子券'
//     },
//     {
//         'prizeId': SSG.PRIZE_MAP.TICKET,
//         'prizeName': '电影票'
//     },
//     {
//         'prizeId': SSG.PRIZE_MAP.WEIDUOMEI,
//         'prizeName': '味多美'
//     },
//     {
//         'prizeId': SSG.PRIZE_MAP.JD100,
//         'prizeName': '京东100元购物卡'
//     }
// ];

// IE8-以及不支持canvas的浏览器进行跳转
SSG.Util.checkCanvas();

jQuery(function () {
  if (store.get('userName')) {
      if (jQuery('#userName').length) {
          jQuery('#userName').text(store.get('userName') || '佚名');
      }   
  }
});

SSG.BG_IMAGES = [
    '/asset/img/terraces.jpg',
    '/asset/img/tree.jpg',
    '/asset/img/galaxy.jpg',
    '/asset/img/yellow.jpg',
    '/asset/img/lake.jpg'
];