var SSG = SSG || {};

SSG.Prize = (function() {
    // 当前角度，每360度清零
    var deg = 0;

    // 已经旋转总度数
    var degCount = 0;

    // 总共需要旋转度数
    var degrees = 0;

    // 每转120度进行一次速度变换
    var changeNum = 120;

    // 实际变换的图片
    var img = jQuery('.round-inner').eq(0);

    // 最小圈数
    var minLoop = 7;

    // 最大圈数
    var maxLoop = 12;
    
    // 角度
    var angle = 0;

    // 抽取到的奖品ID
    var prizeId = 0;

    // 入口
    function init() {
        var prizeId = store.get('prizeId');
        var userName = store.get('userName');
        jQuery('#userName').text(userName);

        if (!userName) {
            window.location = '/login.html';
        }
        else {
            if (!store.get('allPass')) {
                window.location = '/';
            }
        }

        // 抽奖按钮，如果已经领取奖品，则抽奖按钮不可用
        if (!prizeId) {
            jQuery('.start-btn').bind('click', lottery);
            jQuery('.round-outer').fadeIn();
        }
        else {
            jQuery('.prizeName').text(SSG.PRIZES[prizeId]);
            jQuery('.wrapper').fadeOut('slow', function () {
                jQuery('.friends-wrapper').fadeIn();
                jQuery('#firstFriendName').focus();
            });
        }

        // 邀请好友
        jQuery('#btnInvite').bind('click', inviteFriends);
        jQuery('.tell-friends').bind('click', showInviteFriends);
    }

    function showInviteFriends() {
        jQuery('.prize-info').hide();
        jQuery('.overlay').hide();
        jQuery('.wrapper').fadeOut('slow', function () {
            jQuery('.friends-wrapper').fadeIn();
            jQuery('#firstFriendName').focus();
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

    // 开始抽奖
    function lottery() {
        
        SSG.Dao.winPrize(
            {},
            function (allData) {
                if (allData.status === 0) {
                    prizeId = allData.data.prizeId;
                    store.set('prizeId', prizeId);
                    angle = getAngle(prizeId);
                    rotateImage();
                    jQuery('.start-btn').unbind('click', lottery);
                }
                else {
                    SSG.Util.alert(allData.msg);
                }
            }
        );

        function rotateImage() {
            reset();

            var rotateAngle = 0;
            var rotateAngleAdd = 3;
            var rotateTotalAngle = 0;
            var progress = 0;

            console.log(degrees);

            jQuery('.arrow').rotate({
                animateTo: degrees,
                duration: 10000,
                callback: function () {
                    if (prizeId == 4) {
                        jQuery('.egg-wrapper').show();
                        jQuery('.egg').shake(10, 3, 200, function () {
                            delay(500, function() {
                                jQuery('.egg-right').css('transform', 'rotate(60deg)');
                                jQuery('.egg-left').css('transform', 'rotate(-60deg)');

                                delay(500, function () {
                                    jQuery('.egg-text').show();

                                    delay(1500, function () {
                                        jQuery('.prizeName').text(SSG.PRIZES[prizeId]);
                                        jQuery('.overlay').show();
                                        jQuery('.prize-info').show();
                                    });
                                });
                            });                               
                        });
                    }
                    else if (prizeId === 0) {
                        SSG.Util.alert('骚年，运气不错哦，再来一次吧！', function () {
                            window.location.reload();
                        });
                    }
                    else {
                        jQuery('.prizeName').text(SSG.PRIZES[prizeId]);
                        jQuery('.overlay').show();
                        jQuery('.prize-info').show();
                    }
                }
            });
        }       
    }

    // 邀请好友
    function inviteFriends() {
        var firstFriendName = jQuery('#firstFriendName').val();
        var secondFriendName = jQuery('#secondFriendName').val();
        var thirdFriendName = jQuery('#thirdFriendName').val();

        var param = {};
        if (firstFriendName.length) {
            param.friendName1 = firstFriendName.replace('@baidu.com', '');
        }

        if (secondFriendName.length) {
            param.friendName2 = secondFriendName.replace('@baidu.com', '');
        }

        if (thirdFriendName.length) {
            param.friendName3 = thirdFriendName.replace('@baidu.com', '');
        }

        SSG.Dao.inviteFriends(param, function (allData) {
            if (allData.status === 0) {
                SSG.Util.alert(allData.msg);
            }
            else {
                SSG.Util.alert(allData.msg);
            }
        }, function () { });
    }

    // 再来一次，重置
    function reset() {
        degrees = getRandomDegrees(minLoop, maxLoop, angle);
        degCount = 0;
        deg = 0;
        jQuery('.arrow').css('transform', 'rotate(0deg)');
        jQuery('.arrow').css('-webkit-transform', 'rotate(0deg)');
    }

    // 随机获取需要旋转的总角度
    function getRandomDegrees(minLoop, maxLoop, angle) {
        var loops = minLoop +  Math.floor((maxLoop - minLoop) * Math.random());
        return loops * 360 + angle;
    }

    // 根据奖品ID获取随机角度
    function getAngle(prizeId) {
        switch (parseInt(prizeId, 10)) {
            case 0:
                // 再来一次
                return between(81, 126);
            case 1:
                // 华夏良子券
                return between(31, 76);
            case 2:
                // 电影票
                return between(339, 384);
            case 3:
                // 味多美
                if (Math.random() > 0.5) {
                    return between(131, 176);
                }

                return between(286, 331);
            case 4:
                // 鸭蛋
                return between(181, 227);
            default:
                break;
        }

        function between(min, max) {
            return min + Math.floor((max - min) * Math.random());
        }
    }

    return {
        init: init
    };
})();

jQuery.fn.shake = function(intShakes, intDistance, intDuration, callback) {
    this.each(function() {
        var x;
        x = 1;
        while (x <= intShakes) {
          jQuery(this).animate({
            left: intDistance * -1
          }, (intDuration / intShakes) / 4).animate({
            left: intDistance
          }, (intDuration / intShakes) / 2).animate({
            left: 0 
          }, (intDuration / intShakes) / 4);
          x++;
        }

        callback && callback();
    });
    return this;
};

jQuery(function () {
    SSG.Prize.init(); 
});

