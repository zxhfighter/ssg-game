jQuery(function () {
    SSG.Color.init(); 
});

var SSG = SSG || {};

SSG.Color = (function(){
    var box = jQuery('#colorBox');
    var levelDom = jQuery('#level');
    var timeDom = jQuery('#countdown');
    var boxTpl = '<span style="background-color: {0}; width: {1}; height: {1}; border-width: {2}px"></span>';
    var randomPos = 0;
    var rows = 2;
    var mainColor;
    var lightColor;
    var level = 1;
    var borderWidth = 5;
    var time = 60;
    var timer;
    var playing = false;
    var soundLoaded = false;
    var countdownSound, overSound;
    function init() {
        

        function loadResources(callback) {
            soundManager.setup({
                url: 'asset/swf/soundmanager2_flash9.swf',
                flashVersion: 9,
                onready: function () {
                    countdownSound = soundManager.createSound({
                        id: 'star',
                        url: 'asset/mp3/countdown.mp3',
                        autoLoad: true,
                        autoPlay: false,
                        onload: function () {
                            soundLoaded = true;
                        },
                        volume: 50
                    });

                    overSound = soundManager.createSound({
                        id: 'over',
                        url: 'asset/mp3/gameover.mp3',
                        autoLoad: true,
                        autoPlay: false,
                        onload: function () {
                        },
                        volume: 50
                    });
                }
            });

            t = setInterval(function () {
                if (soundLoaded === true) {
                    clearInterval(t);
                    callback && callback();
                }
            }, 16);
        }

        loadResources(function () {
            jQuery('#btnStart').on('click', function (evt) {
                jQuery('.game-pass').hide();
                jQuery('#nextGame').hide();

                if (playing === false) {
                    jQuery(this).text('暂 停');
                    playing = true;
                    countdownSound.play();
                    start();
                }
                else {
                    playing = false;
                    countdownSound.pause();
                    clearInterval(timer);
                    jQuery('.layer').show();
                }
            });

            jQuery('#btnContinue').on('click', function (evt) {
                jQuery('.layer').hide();
                countdownSound.play();
                playing = true;

                timer = setInterval(
                    function() {
                        if (time <= 1) {
                            clearInterval(timer);
                            timer = null;
                            jQuery('#btn').text('开 始');
                            gameOver();
                        }

                        time = time - 1;
                        timeDom.text(time);
                    },
                    1000
                );
            });

            jQuery('#nextGame').on('click', function () {
                window.location = '/'; 
            });

            function start() {
                draw();
                
                timer = setInterval(
                    function() {
                        if (time <= 1) {
                            clearInterval(timer);
                            timer = null;
                            jQuery('#btn').text('开 始');
                            gameOver();
                        }

                        time = time - 1;
                        timeDom.text(time);
                    },
                    1000
                );
            }
        });
    }

    function gameOver() {
        if (level >= 30) {
            var gameId = SSG.GAME_MAP.COLOR;

            jQuery('.game-pass').fadeIn('slow', function(){
                jQuery('#nextGame').fadeIn(100);
            });

            if (!store.get('gameId-' + gameId)) {
                var paramObj = {
                    gameId: gameId,
                    gameResult: 1
                };

                SSG.Dao.passGame(
                    paramObj,
                    function(allData) {
                        if (allData.status === 0) {

                            store.set('gameId-' + gameId, true);

                            var games = store.get('games');
                            games[gameId] = 1;
                            store.set('games', games);

                            var frontPass = true;
                            for (var i = 1; i <= 6; i++) {
                                frontPass = frontPass && games[i];
                            }

                            if (allData.data.allPass || frontPass) {
                                store.set('allPass', 1);
                                window.location = '/prize.html';
                            }
                        } else {
                            SSG.Util.alert(allData.msg);
                        }
                    },
                    function(allData) {
                        SSG.Util.alert((allData && allData.msg) || '系统内部错误');
                    }
                );
            }
        }
        else {
            overSound && overSound.play();
        }

        box.html('');
        playing = false;
        jQuery('#btnStart').text('开 始');
        time = 61;
        level = 1;
        borderWidth = 5;
        rows = 2;
    }

    function draw() {
        var htmlStr = [];
        var width = (1 / rows) * 100 + '%';
        randomPos = Math.floor(Math.random() * rows * rows);
        var color = randomColor();
        mainColor = color.mainColor;
        lightColor = color.lightColor;

        levelDom.text(level);
        for (var i = 0; i < rows * rows; i++) {
            if (i === randomPos) {
                htmlStr.push(format(boxTpl, lightColor, width, borderWidth));
            }
            else {
                htmlStr.push(format(boxTpl, mainColor, width, borderWidth));
            }
        }

        box.html(htmlStr.join(''));

        // 绑定事件
        jQuery('#colorBox span').on('click', function (evt) {
            var pos = jQuery('#colorBox span').index(evt.target);

            if (pos === randomPos) {
                rows += getFrequency(level);
                level += 1;
                if (level > 5) {
                    borderWidth = 3;
                }

                if (level > 11) {
                    borderWidth = 1;
                }
                draw();
            }
        });
    }

    function format(source, opts) {
        if ('[object Object]' == Object.prototype.toString.call(opts)) {
            return source.replace(/\$\{(.+?)\}/g,
                function (match, key) {
                    var replacer = opts[key];
                    if ('function' == typeof replacer) {
                        replacer = replacer(key);
                    }
                    return ('undefined' == typeof replacer ? '' : replacer);
                });
        } else {
            var data = Array.prototype.slice.call(arguments, 1),
                len = data.length;
            return source.replace(/\{(\d+)\}/g,
                function (match, index) {
                    index = parseInt(index, 10);
                    return (index >= len ? match : data[index]);
                });
        }
    }

    function getFrequency(level) {
        var levels = [1, 2, 3, 6, 9, 12, 18, 26, 30, 35, 40, 45, 50];
        if (levels.indexOf(level) != -1) {
            return 1;
        }
        else {
            return 0;
        }
    }

    function randomColor() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);

        var r1, g1, b1;
        if (level < 5) {
            r1 = r + Math.floor(Math.random() * 60);           
            g1 = g + Math.floor(Math.random() * 20);           
            b1 = b + Math.floor(Math.random() * 40);           
        }
        else if (level <= 10 && level >= 5 ) {
            r1 = r + Math.floor(Math.random() * 40);           
            g1 = g + Math.floor(Math.random() * 30);           
            b1 = b + Math.floor(Math.random() * 20);
        }
        else {
            r1 = r + Math.floor(Math.random() * 30);           
            g1 = g + Math.floor(Math.random() * 20);           
            b1 = b + Math.floor(Math.random() * 10);
        }

        return {
            mainColor: 'rgb(' + r + ',' + g + ',' + b + ')',
            lightColor: 'rgb(' + r1 + ',' + g1 + ',' + b1 + ')'
        };
    }

    return {
        init: init
    };
})();