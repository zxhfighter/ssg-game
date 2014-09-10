var SSG = SSG || {};

SSG.Login = (function(){
    function init() {
        jQuery('#UserName').focus();
        bindEvents();
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
                else {
                    var msg = data.msg || '登录失败，请仔细检查输入邮箱哦！';
                    showErrorMsg(msg);

                    jQuery('#loginText').text('LOGIN');
                    // jQuery('#Login').on('click', login);
                }
            },
            function (data) {
                showErrorMsg('网络或者其他未知错误，请重试！');
                jQuery('#loginText').text('LOGIN');
                // jQuery('#Login').on('click', login);
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