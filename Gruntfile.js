module.exports= function (grunt) {
    grunt.initConfig({
        cssmin: {
            options: {
                banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> zengxiaohui@baidu.com */\n'
            },
            combine: {
                files: {
                    // 登录页
                    'asset/css/login.min.css': ['src/css/common.css', 'src/css/login.css'],

                    // 首页
                    'asset/css/index.min.css': ['src/css/common.css', 'src/css/index.css'],

                    // 抽奖
                    'asset/css/prize.min.css': ['src/css/common.css', 'src/css/login.css', 'src/css/prize.css']
                }
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> zengxiaohui@baidu.com */\n'
            },
            build: {
                files: {
                    // 登陆页
                    'asset/js/login.min.js': [
                        'dep/store.js',
                        'src/common.js',
                        'src/login.js'
                    ],

                    // 首页
                    'asset/js/index.min.js': [
                        'dep/store.js',
                        'src/common.js',
                        'src/main.js'
                    ],

                    // 抽奖
                    'asset/js/prize.min.js': [
                        'dep/jQueryRotate.2.2.js',
                        'dep/store.js',
                        'src/common.js',
                        'src/prize.js'
                    ],

                    // 1024
                    'asset/js/1024.min.js': [
                        'dep/store.js',
                        'src/common.js',
                        'game/1024/js/bind_polyfill.js',
                        'game/1024/js/classlist_polyfill.js',
                        'game/1024/js/animframe_polyfill.js',
                        'game/1024/js/keyboard_input_manager.js',
                        'game/1024/js/html_actuator.js',
                        'game/1024/js/grid.js',
                        'game/1024/js/tile.js',
                        'game/1024/js/local_storage_manager.js',
                        'game/1024/js/game_manager.js',
                        'game/1024/js/application.js'
                    ],

                    // 小鸟
                    'asset/js/bird.min.js': [
                        'dep/store.js',
                        'src/common.js',
                        'game/bird/ui/bird.js'
                    ],

                    // 打砖块
                    'asset/js/breakout.min.js': [
                        'dep/store.js',
                        'src/common.js',
                        'game/breakout/game.js',
                        'game/breakout/breakout.js',
                        'game/breakout/levels.js'
                    ],

                    // 看你有多色
                    'asset/js/color.min.js': [
                        'dep/store.js',
                        'src/common.js',
                        'game/color/src/color.js'
                    ],

                    // 吃豆人
                    'asset/js/pacman.min.js': [
                        'dep/store.js',
                        'src/common.js',
                        'game/pacman/pacman.js'
                    ],

                    // 贪吃蛇
                    'asset/js/snake.min.js': [
                        'dep/store.js',
                        'src/common.js',
                        'game/snake/snakes.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['cssmin', 'uglify']);
};