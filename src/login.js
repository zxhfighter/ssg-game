var SSG = SSG || {};

SSG.Login = (function(){
    function init() {
        jQuery('#UserName').focus();
        bindEvents();

        clearLocalStorage();
    }

    // 清除前端缓存
    function clearLocalStorage() {
        // 设置所有游戏未通关
        for (var i = 1; i <= 6; i++) {
            store.set('gameId-' + i, false);
        }

        // 如果1024已经通过，需要清空数据复原到出事状态
        var gameState = JSON.parse(localStorage.gameState);
        var defaultState = '{"grid":{"size":4,"cells":[[null,null,null,{"position":{"x":0,"y":3},"value":2}],[{"position":{"x":1,"y":0},"value":2},null,null,null],[null,null,null,null],[null,null,null,null]]},"score":0,"over":false,"won":false,"keepPlaying":false}';
        if (gameState.won) {
            localStorage.gameState = defaultState;
        }
    }

    // 绑定事件
    function bindEvents() {
        // 登录
        jQuery('#Login').on('click', login);
        
        // 回车登录
        jQuery('#UserName').on('keydown', function (e) {
            if (e.keyCode == 13) {
                login();
            }
        });
    }

    // 显示错误信息，并于3s后消失
    function showErrorMsg(msg) {
        jQuery('.error-block').text(msg).fadeIn('slow');

        setTimeout(
            function() {
                jQuery('.error-block').fadeOut();
            },
            3000
        );
    }

    // 登录
    function login() {
        var userName = jQuery('#UserName').val();
        if (!userName) {
            showErrorMsg('请输入邮箱名！');
            return;
        }
        else if (userName.indexOf('@baidu.com') != -1) {
            userName = userName.replace('@baidu.com', '');
        }

        jQuery('#loginText').text('登录中...');
        // jQuery('#Login').un('click', login);

        SSG.Dao.userLogin(
            { userName: userName },
            function (data) {

                if (data.status === 0) {
                    // 用户名
                    store.set('userName', userName);

                    // 是否通关
                    store.set('allPass', data.data.allPass);

                    // 是否领取奖品
                    store.set('prizeId', data.data.prizeId);

                    // 游戏过关情况
                    store.set('games', data.data.games);

                    if (data.data.allPass && !data.data.prizeId) {
                        window.location = '/prize.html';
                    }
                    else {
                        window.location = '/';
                    }
                }
                else if (data.status === 1) {
                    showErrorMsg(data.msg || '登录失败，请仔细检查输入邮箱哦！');
                    jQuery('#loginText').text('LOGIN');
                    window.location = 'http://neitui.baidu.com/';
                }
                else {
                    var msg = data.msg || '登录失败，请仔细检查输入邮箱哦！';
                    showErrorMsg(msg);

                    jQuery('#loginText').text('LOGIN');
                }
            },
            function (data) {
                showErrorMsg('网络或者其他未知错误，请重试！');
                jQuery('#loginText').text('LOGIN');
            }
        );
    }

    return {
        init: init
    };
})();

jQuery(function () {
    SSG.Login.init();
});