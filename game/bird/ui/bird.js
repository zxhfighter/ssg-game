var Bird, Game, Pipes, Runner, Score, ScoreBoard, Stage;

// 小鸟挂掉后，振动效果,6,3,100
jq.fn.shake = function(intShakes, intDistance, intDuration) {
  this.each(function() {
    var x;
    jq(this).css("position", "relative");
    x = 1;
    while (x <= intShakes) {
      jq(this).animate({
        left: intDistance * -1
      }, (intDuration / intShakes) / 4).animate({
        left: intDistance
      }, (intDuration / intShakes) / 2).animate({
        left: 0
      }, (intDuration / intShakes) / 4);
      x++;
    }
  });
  return this;
};

// 时间管理对象
Runner = (function() {
  function Runner() {
    // 每秒帧数
    this.FPS = 60;

    // 每一帧时间
    this.FRAME_TIME = 1000 / this.FPS;

    // 地面移动速度
    this.GROUND_SPEED = 190 / this.FPS;

    // 下降速度
    this.GRAVITY = 35 / this.FPS;

    // 跳跃速度
    this.BIRD_JUMP_SPEED = 510 / this.FPS;

    // ?
    this.roles = [];
  }

  Runner.prototype.add = function(role) {
    this.roles.push(role);
    role.runner = this;
    return role.runner;
  };

  Runner.prototype.run = function() {
    var start_time;
    start_time = new Date().getTime();

    return setInterval((function(_this) {
      return function() {
        var deltat, new_time, role, _i, _len, _ref;
        new_time = new Date().getTime();

        // 流逝时间
        deltat = new_time - start_time;

        // 超过一帧时间后重绘
        if (deltat > _this.FRAME_TIME) {
          _ref = _this.roles;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            role = _ref[_i];
            role.draw();
          }
          start_time = new_time;
          return new_time;
        }
      };
    })(this), 1);
  };

  return Runner;
})();

// 舞台
Stage = (function() {
  // 舞台构造函数
  function Stage() {
    this.$elm = jQuery('<div></div>').addClass('stage').appendTo(document.body);
    this.$ground = jQuery('<div></div>').addClass('ground').appendTo(this.$elm);
    this.bgleft = 0;
    this.move();
  }

  // 构建元素
  Stage.prototype.build_elm = function(name) {
    return jQuery('<div></div>').addClass(name).appendTo(this.$elm);
  };

  // 移动背景
  Stage.prototype.move = function() {
    return this.$elm.removeClass('stop');
  };

  // 停止背景
  Stage.prototype.stop = function() {
    return this.$elm.addClass('stop');
  };

  // 绘制舞台，改变地板的bgp
  Stage.prototype.draw = function() {
    if (this.$elm.hasClass('stop')) {
      return;
    }
    this.bgleft -= this.runner.GROUND_SPEED;
    return this.$ground.css({
      'background-position': "" + this.bgleft + "px 0"
    });
  };

  return Stage;
})();

// 小鸟
Bird = (function() {
  function Bird() {
    this.$elm = jQuery('<div></div>').addClass('bird');
    this.speed = 0;
    this.is_dead = false;
    this.gravity = 0;
  }

  Bird.prototype.draw = function() {
    this._repos();
    return this.hit();
  };

  Bird.prototype._repos = function() {
    var new_top;
    if (this.gravity !== 0) {
      if (this.speed > 0) {
        this.$elm.addClass('up').removeClass('down');
      } else {
        this.$elm.addClass('down').removeClass('up');
      }
      new_top = this.top - this.speed;
      if (new_top >= 418) {
        this.pos(this.left, 418);
        this.speed = 0;
        return this.gravity = 0;
      } else {
        this.pos(this.left, new_top);
        return this.speed = this.speed - this.gravity;
      }
    }
  };

  Bird.prototype.pos = function(left, top) {
    this.left = left;
    this.top = top;
    if (this.top < 0) {
      this.top = 0;
    }
    return this.$elm.css({
      left: this.left,
      top: this.top
    });
  };

  Bird.prototype.hit = function() {
    var bird_mx, p, pipe_mx, pipes;
    
    if (this.is_dead) {
      return;
    }

    // 小鸟已扑街
    if (this.top >= 418) {
      this.state_dead();
      return;
    }

    pipes = window.game.pipes.pipes;
    if (pipes.length > 0) {

      // 第一个管道，进行碰撞检测
      p = pipes[0];
      bird_mx = 120.5;
      pipe_mx = p.data('left') + 34.5;
      if (Math.abs(bird_mx - pipe_mx) <= 56) {
        if (this.top < p.data('y0') || this.top + 15 > p.data('y1')) {
          return this.state_dead();
        }
      }
    }
  };

  Bird.prototype.state_suspend = function() {
    this.$elm.removeClass('no-suspend').removeClass('down').removeClass('up');
    this.speed = 0;
    this.is_dead = false;
    this.$elm.removeClass('dead');
    return this.gravity = 0;
  };

  Bird.prototype.state_fly = function() {
    this.$elm.addClass('no-suspend');
    return this.jump();
  };

  Bird.prototype.state_dead = function() {
    this.is_dead = true;
    this.$elm.addClass('dead');
    return jQuery(document).trigger('bird:dead');
  };

  Bird.prototype.jump = function() {
    if (this.is_dead) {
      return;
    }
    this.gravity = this.runner.GRAVITY;
    return this.speed = this.runner.BIRD_JUMP_SPEED;
  };

  return Bird;
})();

Score = (function() {
  function Score() {
    this.$elm = jQuery('<div></div>').addClass('score');
  }

  Score.prototype.set = function(score) {
    var $n, num, _i, _len, _ref;
    this.score = score;
    this.$elm.html('');
    _ref = (score + '').split('');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      num = _ref[_i];
      $n = jQuery('<div></div>').addClass('number').addClass("n" + num);
      this.$elm.append($n);
    }
    return setTimeout((function(_this) {
      return function() {
        return _this.$elm.css({
          'margin-left': -_this.$elm.width() / 2
        });
      };
    })(this), 1);
  };

  Score.prototype.inc = function() {
    return this.set(this.score + 1);
  };

  return Score;

})();

ScoreBoard = (function() {
  function ScoreBoard() {
    this.$elm = jQuery('<div></div>').addClass('score_board');
    this.$score = jQuery('<div></div>').addClass('score').appendTo(this.$elm).css({
      left: 'auto',
      top: 45,
      right: 30
    });
    this.$max_score = jQuery('<div></div>').addClass('score').appendTo(this.$elm).css({
      left: 'auto',
      top: 102,
      right: 30
    });
    this.$new_record = jQuery('<div></div>').addClass('new_record').appendTo(this.$elm);
  }

  ScoreBoard.prototype.set = function(score) {
    var $n, num, _i, _j, _len, _len1, _ref, _ref1, _results;
    if (!localStorage.max_score) {
      localStorage.max_score = 0;
    }
    if (localStorage.max_score < score) {
      localStorage.max_score = score;
      this.$new_record.show();
    } else {
      this.$new_record.hide();
    }
    this.$score.html('');
    this.$max_score.html('');
    _ref = (score + '').split('');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      num = _ref[_i];
      $n = jQuery('<div></div>').addClass('number').addClass("n" + num);
      this.$score.append($n);
    }
    _ref1 = (localStorage.max_score + '').split('');
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      num = _ref1[_j];
      $n = jQuery('<div></div>').addClass('number').addClass("n" + num);
      _results.push(this.$max_score.append($n));
    }
    return _results;
  };

  return ScoreBoard;

})();

Pipes = (function() {
  function Pipes() {
    this.xgap = 209;
    this.ygap = 128;
    this.pipes = [];
    this.is_stop = true;
  }

  Pipes.prototype.generate = function() {
    var $bottom, $pipe, $top, last_pipe, left, y0, y1;
    y0 = ~~(Math.random() * (250 - 70 + 1) + 70);
    y1 = y0 + this.ygap;
    last_pipe = this.pipes[this.pipes.length - 1];
    if (last_pipe) {
      left = last_pipe.data('left') + this.xgap;
    } else {
      left = 384 * 2;
    }
    $pipe = jQuery('<div></div>').addClass('pipe').css('left', left).data('left', left).data('y0', y0).data('y1', y1);
    $top = jQuery('<div></div>').addClass('top').appendTo($pipe).css({
      height: y0
    });
    $bottom = jQuery('<div></div>').addClass('bottom').appendTo($pipe).css({
      top: y1
    });
    this.pipes.push($pipe);
    return jQuery(document).trigger('pipe:created', $pipe);
  };

  Pipes.prototype.draw = function() {
    var $pipe, left, pipe0, _i, _len, _ref;
    if (this.is_stop) {
      return;
    }
    _ref = this.pipes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      $pipe = _ref[_i];
      left = $pipe.data('left') - this.runner.GROUND_SPEED;
      $pipe.css('left', left).data('left', left);
    }
    if (this.pipes.length > 0) {
      if (this.pipes.length < 3) {
        this.generate();
      }
      pipe0 = this.pipes[0];
      if (pipe0.data('left') < -69) {
        pipe0.remove();
        this.pipes.splice(0, 1);
      }
      if (pipe0.data('left') < 86) {
        if (!pipe0.data('passed')) {
          pipe0.data('passed', true);
          return jQuery(document).trigger('score:add');
        }
      }
    }
  };

  Pipes.prototype.stop = function() {
    return this.is_stop = true;
  };

  Pipes.prototype.clear = function() {
    var p, _i, _len, _ref;
    _ref = this.pipes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      p.remove();
    }
    return this.pipes = [];
  };

  Pipes.prototype.start = function() {
    this.is_stop = false;
    return this.generate();
  };

  return Pipes;

})();

Sound = (function () {
    var jumpSound, overSound;
    function Sound() {
      this.init();
    }

    Sound.prototype.init = function() {
        soundManager.setup({
          url: 'asset/swf/soundmanager2_flash9.swf',
          flashVersion: 9,
          onready: function () {
              jumpSound = soundManager.createSound({
                  id: 'jump',
                  url: 'asset/mp3/jump.mp3',
                  autoLoad: true,
                  autoPlay: false,
                  onload: function () {
                  },
                  volume: 50
              });

              overSound = soundManager.createSound({
                  id: 'gameover',
                  url: 'asset/mp3/gameover.mp3',
                  autoLoad: true,
                  autoPlay: false,
                  onload: function () {
                  },
                  volume: 50
              });
          }
      });
    };

    Sound.prototype.play = function(soundName) {
        if (soundName == 'jump') {
            jumpSound.play();
        }
        else if (soundName == 'gameover') {
            overSound.play();
        }
    };

    return Sound;
})();

// 游戏主框架
Game = (function() {

  // 构造函数
  function Game(stage) {
    this.stage = stage;
    this.stage = new Stage();
    this.bird = new Bird();
    this.score = new Score();
    this.score_board = new ScoreBoard();
    this.pipes = new Pipes();
    this.runner = new Runner();
    this.sound = new Sound();

    // 每一帧需要重绘的三个对象
    this.runner.add(this.bird);
    this.runner.add(this.pipes);
    this.runner.add(this.stage);

    this.runner.run();

    this._init_objects();
    this._init_events();
  }

  // 将所有对象添加到stage并初始化
  Game.prototype._init_objects = function() {
    // 游戏名字Flappy Bird
    this.$logo = this.stage.build_elm('logo');

    // 开始按钮
    this.$start = this.stage.build_elm('start');

    // 游戏结束时的OK按钮
    this.$ok = this.stage.build_elm('ok');

    // 下一游戏按钮
    this.$next_game = this.stage.build_elm('next_game');

    // “get ready”提示
    this.$get_ready = this.stage.build_elm('get_ready');

    // “tap”提示
    this.$tap = this.stage.build_elm('tap');

    // “game over”提示
    this.$game_over = this.stage.build_elm('game_over');

    // 过关通知
    this.$game_pass = this.stage.build_elm('game_pass');

    // 计分面板
    this.$score_board = this.score_board.$elm.appendTo(this.stage.$elm);

    // 小鸟
    this.$bird = this.bird.$elm.appendTo(this.stage.$elm);

    // 实时分数
    this.$score = this.score.$elm.appendTo(this.stage.$elm);

    // 游戏相关所有元素
    this.objects = {
      'logo': this.$logo,
      'start': this.$start,
      'ok': this.$ok,
      'get_ready': this.$get_ready,
      'game_over': this.$game_over,
      'tap': this.$tap,
      'score': this.$score,
      'score_board': this.$score_board,
      'bird': this.$bird
    };

    return this.objects;
  };

  // 绑定各种事件
  Game.prototype._init_events = function() {
    // 开始
    this.$start.on('click', (function(_this) {
      return function() {
        // 主舞台渐隐，出现get ready界面然后主舞台渐显
        return _this.stage.$elm.fadeOut(200, function() {
          _this.ready();
          return _this.stage.$elm.fadeIn(200);
        });
      };
    })(this));

    // 点击重新开始，跳到start界面
    this.$ok.on('click', (function(_this) {
      return function() {
        return _this.stage.$elm.fadeOut(200, function() {
          _this.begin();
          return _this.stage.$elm.fadeIn(200);
        });
      };
    })(this));

    // 下一游戏
    this.$next_game.on('click', (function(_this) {
      return function () {
          window.location = '/';
      };
    })(this));

    // 鼠标按下
    this.stage.$elm.on('mousedown', (function(_this) {
      return function() {
        
        if (_this.state === 'ready') {
          _this.fly();
          return;
        }

        if (_this.state === 'fly') {
          _this.sound.play('jump');
          return _this.bird.jump();
        }
      };
    })(this));

    // 自定义事件：小鸟挂了
    jQuery(document).on('bird:dead', (function(_this) {
      return function() {
        return _this.over();
      };
    })(this));

    // 自定义事件：小鸟撞南墙了
    jQuery(document).on('bird:hit', (function(_this) {
      return function() {
        return _this.bird.state_dead();
      };
    })(this));

    // 自定义事件：管道建立完毕
    jQuery(document).on('pipe:created', (function(_this) {
      return function(evt, $pipe) {
        return _this.stage.$elm.append($pipe);
      };
    })(this));

    // 游戏通关
    jQuery(document).on('game:passed', (function(_this) {
      return function() {
        return _this.pass();
      };
    })(this));

    // 自定义事件：分数更新了
    return jQuery(document).on('score:add', (function(_this) {
      return function(evt, $pipe) {
        return _this.score.inc();
      };
    })(this));
  };

  // 显示界面元素
  Game.prototype._show = function() {
    var k, name, o, v, _i, _len, _ref, _results;
    _ref = this.objects;
    for (k in _ref) {
      v = _ref[k];
      v.hide();
    }
    _results = [];
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      name = arguments[_i];
      o = this.objects[name];
      if (o) {
        _results.push(o.show());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  // 准备界面
  Game.prototype.begin = function() {
    this.state = 'begin';
    this._show('logo', 'bird', 'start');
    this.bird.pos(310, 145);
    this.stage.move();
    this.bird.state_suspend();
    return this.pipes.clear();
  };

  Game.prototype.ready = function() {
    this.state = 'ready';
    this._show('bird', 'tap', 'score');
    this.$get_ready.fadeIn(400);
    this.bird.pos(99, 237);
    this.bird.state_suspend();
    return this.score.set(0);
  };

  Game.prototype.fly = function() {
    this.state = 'fly';
    this._show('get_ready', 'bird', 'tap', 'score');
    this.$get_ready.fadeOut(400);
    this.$tap.fadeOut(400);
    this.bird.state_fly();
    return this.pipes.start();
  };

  Game.prototype.over = function() {
    // TODO 如果过了5根水管，表示过关
    if (this.score.score > 4) {
      return jQuery(document).trigger('game:passed');
    }

    this.state = 'over';
    this._show('bird', 'score');
    this.sound.play('gameover');

    this.stage.stop();
    this.pipes.stop();
    
    // 振动，增强撞墙的真实感
    this.stage.$elm.shake(6, 3, 100);

    // 显示结束分数面板
    return setTimeout((function(_this) {
      return function() {
        _this.$score.fadeOut();
        return _this.$game_over.fadeIn(function() {
          _this.score_board.set(_this.score.score);
          return _this.$score_board.show().css({
            top: 512
          }).delay(300).animate({
            top: 179
          }, function() {
            return _this.$ok.fadeIn();
          });
        });
      };
    })(this), 500);
  };

  Game.prototype.pass = function() {
    this.state = 'pass';
    this._show('bird', 'score');
    
    this.stage.stop();
    this.pipes.stop();

    // 振动，增强撞墙的真实感
    this.stage.$elm.shake(6, 3, 100);

    // TODO发送请求
    var gameId = SSG.GAME_MAP.BIRD;
    if (!store.get('gameId-' + gameId)) {
        var paramObj = {
          gameId: gameId,
          gameResult: 1
        };

        SSG.Dao.passGame(
          paramObj,
          function (allData) {
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
              }
              else {
                SSG.Util.alert(allData.msg);
              }
          },
          function(allData) {
            SSG.Util.alert( (allData && allData.msg) || '系统内部错误');
          }
        );
    }

    // 显示结束分数面板
    return setTimeout((function(_this) {
      return function() {
        _this.$score.fadeOut();
        return _this.$game_pass.fadeIn(function() {
          _this.score_board.set(_this.score.score);
          return _this.$score_board.show().css({
            top: 512
          }).delay(300).animate({
            top: 179
          }, function() {
            // _this.$ok.fadeIn();
            return _this.$next_game.fadeIn();
          });
        });
      };
    })(this), 500);
  };

  return Game;

})();

jQuery(function() {
  window.game = new Game();
  return window.game.begin();
});