class StartMenu {
  constructor(ctx) {
    this.ctx = ctx;
    this.title = new Image();
    this.title.src = "src/assets/MazeRunner.png";
    this.pressStart = new Image();
    this.pressStart.src = "src/assets/press-start.png";
    this.control = new Image();
    this.control.src = "src/assets/controls.png";
    this.howToPlay = new Image();
    this.howToPlay.src = "src/assets/how-to-play.png";
    this.startGame = new Image();
    this.startGame.src = "src/assets/start-game.png";
    this.options = new Image();
    this.options.src = "src/assets/options.png";
    this.titlePosition = { x: 300, y: -135 };
    this.pressStartPosition = { x: 400, y: -150 };
    this.startGamePosition = { x: 450, y: 550 };
    this.howToPlayPosition = { x: 450, y: 585 };
    this.controlPosition = { x: 450, y: 620 };
    this.optionsPosition = { x: 450, y: 655 };
    this.selector = { x: 450, y: 590 };
    this.titleSpeed = .85;
    this.titleAnimation = false;
    this.titleStartReady = false;
    this.controlsDisplay = false;
    this.howToPlayDisplay = false;
    this.optionsDisplay = false;
    this.canvasHeight = 700;
    this.canvasWidth = 1200;
    this.pressStartTimer = 200;
    this.pressStartBoolean = false;
    this.globalAlpha = 1;
    window.addEventListener("keydown", this.keyDown.bind(this));
    window.addEventListener("keyup", this.keyUp.bind(this));
  };

  keyDown(e) {
    console.log(this.selector.y);
    if ((e.keyCode === 83 || e.keyCode === 40) && this.selector.y < 675) {
      this.selector.y += 35
    } else if ((e.keyCode === 87 || e.keyCode === 38) && this.selector.y > 610) {
      this.selector.y -= 35
    }
  };

  keyUp(e) {

  };

  update() {
    this.drawTitle();
    this.drawPressStart();
    this.moveTitle();
  };

  updateSelector() {
    this.drawTitle();
    this.drawStartGame();
    this.drawHowToPlay();
    this.drawControl();
    this.drawSelectorTriangle();
    this.drawOptions();
  }

  updateControls() {

  };

  updateHowToPlay() {

  };

  finishAnimation() {
    this.titlePosition.y = 20;
    this.pressStartPosition.y = 170;
    this.titleAnimation = true;
  };

  moveTitle() {
    if (this.titlePosition.y < 20) {
      this.titlePosition.y += this.titleSpeed;
    } else if (this.titlePosition.y >= 20) {
      this.finishAnimation();
    }
  };

  drawSelectorTriangle() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.selector.x, this.selector.y - 20);
    this.ctx.lineTo(this.selector.x - 20, this.selector.y);
    this.ctx.lineTo(this.selector.x - 20, this.selector.y - 40);
    this.ctx.fillStyle = "rgba(200, 200, 200, 1)";
    this.ctx.fill();
  }

  drawOptions() {
    this.ctx.drawImage(this.options, 0, 0, 401, 152, this.optionsPosition.x, this.optionsPosition.y, 200, 50);
  };

  drawStartGame() {
    this.ctx.drawImage(this.startGame, 0, 0, 681, 152, this.startGamePosition.x, this.startGamePosition.y, 300, 50);
  };

  drawHowToPlay() {
    this.ctx.drawImage(this.howToPlay, 0, 0, 681, 152, this.howToPlayPosition.x, this.howToPlayPosition.y, 300, 50);
  };

  drawControl() {
    this.ctx.drawImage(this.control, 0, 0, 485, 152, this.controlPosition.x, this.controlPosition.y, 200, 50);
  };
  
  drawPressStart() {
    this.ctx.save();
    if (this.titlePosition.y >= 20 && !this.pressStartBoolean) {
      this.pressStartTimer -= 1;
      this.ctx.globalAlpha = this.globalAlpha -= .0075
      if (this.pressStartTimer <= 0) {
        this.pressStartBoolean = true
      }
    }
    if (this.pressStartBoolean) {
      this.ctx.globalAlpha = this.globalAlpha = 1
      this.pressStartTimer = 200;
      this.pressStartBoolean = false;
    }
    this.ctx.drawImage(this.pressStart, 0, 0, 1567, 152, this.pressStartPosition.x, this.pressStartPosition.y, 400, 50)
    this.ctx.restore();
  };

  drawTitle() {
    // ctx.drawImage(image, sourcex, sy, sWidth, sHeight, destinationx, dy, dWidth, dHeight);
    this.ctx.drawImage(this.title, 0, 0, 494, 114, this.titlePosition.x, this.titlePosition.y, 600, 150);
  };

};

export default StartMenu;