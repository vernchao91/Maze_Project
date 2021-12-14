import MovingObject, { call } from "./moving_object";
import Util from "./util";
import Player from './player';
import Wraith from './wraith'
import Item from './items'

class Maze {
  constructor(ctx) {
    this.ctx = ctx;
    this.items = new Item(ctx);
    this.player = new Player(ctx, 3, 41);
    this.wraith = new Wraith(ctx, 980, 41);
    this.wallImg = new Image();
    this.wallImg.src = "src/assets/tile-sheet.png";
    // this.wallImg.onload = () => this.update();
    this.topWall = new Image();
    this.topWall.src = "src/assets/tile-sheet2.png";
    // this.topWall.onload = () => this.update();
    this.innerWall = new Image();
    this.innerWall.src = "src/assets/tile-sheet.png";
    this.objects = [];
    this.isColliding = false;
    // ctx.drawImage(image, sourcex, sy, sWidth, sHeight, destinationx, dy, dWidth, dHeight)
    // this.ctx.drawImage(this.wallImg, 725, 0, 50, 75, x, y, 55, 80) // top/bottom wall
    // this.ctx.drawImage(this.wallImg, 775, 0, 50, 75, x, y, 55, 80) // side wall
  }

  eventListeners() {
    window.addEventListener("keydown", this.player.keyDown.bind(this));
    window.addEventListener("keyup", this.player.keyUp.bind(this));
    window.addEventListener("keydown", this.items.keyDown.bind(this));
    window.addEventListener("keyup", this.items.keyUp.bind(this));
  }

  update() {
    this.eventListeners();
    // this.drawMaze();
    this.drawBorder();
    this.drawWireFrame();
    this.updateItems();
    this.player.update();
    this.wraith.update();
    this.activate(this.player, this.wraith);
    this.wraithChase();
    this.attacking(this.player, this.wraith);
    this.blueSwitchDistanceCheck(this.player, this.items.frameSwitchDestinationX, this.items.frameSwitchDestinationY);
    this.keyDistanceCheck(this.player, this.items.keyItem);
    this.redDoorDistanceCheck(this.player, this.items.redDoor);
    // this.testFunction();
    this.Colliding(this.player, this.objects);
    // this.move();
  }

  testFunction() {
    // setTimeout(() => alert("Hello"), 3000);
  }

  updateItems() {
    this.items.drawRedDoor(1103, 415);
    this.items.drawBlueDoor(51, 194);
    this.items.drawSwitch(this.items.frameSwitchDestinationX, this.items.frameSwitchDestinationY);
    this.items.drawHeart(915, 625);
    this.items.drawTorch(50, 630);
    this.items.drawKey(this.items.keyItem.x, this.items.keyItem.y);
  }

  getDistance(x1, y1, x2, y2) { // util function
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
  }

  // Colliding(player, objects) { //util function
  //   objects.forEach( object => {
  //     if (player.x < (object.x + object.w) &&
  //       (player.x + 60) > object.x &&
  //       player.y < (object.y + object.h) &&
  //       (60 + player.y) > object.y)
  //     {
  //       player.speed = 0
  //       console.log("collided");
  //     } else {
  //       if ( (player.keys[83]) ) {
  //         player.speed = 2
  //         player.y += player.speed;
  //         player.lastInput = "down";
  //       } else if ( player.keys[87] ) {
  //         player.speed = 2
  //         player.y -= player.speed;
  //         player.lastInput = "up";
  //       } else if ( player.keys[65] ) {
  //         player.x -= player.speed;
  //         player.lastInput = "left";
  //       } else if ( player.keys[68] ) {
  //         player.x += player.speed;
  //         player.lastInput = "right";
  //       }
  //     }
  //   })
  // }
  
  Colliding(player, objects) { //util function
    for (let object of objects) {
      if (player.x < object.x + object.w &&
        player.x + player.w > object.x &&
        player.y < object.y + object.h &&
        player.h + player.y > object.y
        ) {
          if ( player.lastInput === "up" ) {
            if ( player.keys[87] ) {
              this.player.speed = 0
              player.lastInput = "up";
              return;
            } else if (player.keys[65] ) {
              player.x -= player.speed;
              player.lastInput = "left";
            } else if (player.keys[68]) {
              player.x += player.speed;
              player.lastInput = "right";
            } else if ( player.keys[83]) {
              player.y += player.speed;
              player.lastInput = "down";
            }
          }
          if ( player.lastInput === "right" ) {
            if ( player.keys[68] ) {
              this.player.speed = 0
              player.lastInput = "right";
              this.player.speed = 0
              return;
            } else if (player.keys[65] ) {
              player.x -= player.speed;
              player.lastInput = "left";
            } else if (player.keys[87]) {
              player.x += player.speed;
              player.lastInput = "up";
            } else if ( player.keys[83]) {
              player.y += player.speed;
              player.lastInput = "down";
            }
          }
        } else {
          this.player.speed = 2
          if ( player.keys[83] ) {
              player.y += player.speed;
              player.lastInput = "down";
          } else if (player.keys[87] ) {
              player.y -= player.speed;
              player.lastInput = "up";
          } else if (player.keys[65] ) {
              player.x -= player.speed;
              player.lastInput = "left";
          } else if ( player.keys[68] ) {
              player.x += player.speed;
              player.lastInput = "right";
          }
        }
    }
  }

  // move() {
  //   if (this.player.keys[83]) {
  //     this.player.y += this.player.speed;
  //     this.player.lastInput = "down";
  //   } else if (this.player.keys[87]) {
  //     this.player.y -= this.player.speed;
  //     this.player.lastInput = "up";
  //   } else if (this.player.keys[65]) {
  //     this.player.x -= this.player.speed;
  //     this.player.lastInput = "left";
  //   } else if (this.player.keys[68]) {
  //     this.player.x += this.player.speed;
  //     this.player.lastInput = "right";
  //   }
  // }

  blueSwitchDistanceCheck(player, blueSwitchX, blueSwitchY) {
    const distance = this.getDistance(player.x, player.y, blueSwitchX, blueSwitchY);
    if (distance < 25 && this.items.keys[32]) {
      this.items.animateBlueSwitch();
    }
  }

  keyDistanceCheck(player, key) {
    const distance = this.getDistance(player.x, player.y, key.x, key.y);
    if (distance < 40 && this.items.keys[32]) {
      this.items.keyGrab = true;
      key.x = player.x
      key.y = player.y
    }
  }

  redDoorDistanceCheck(player) {
    const distance = this.getDistance(player.x, player.y, 1103, 415);
    if (distance < 40 && this.items.keyGrab === true) {
      this.items.animateRedDoor();
    }
  }

  attacking(player, wraith) { // wraith attacking
    const distance = this.getDistance(player.x, player.y, wraith.x, wraith.y)
    if (distance < 30)  {
      this.wraith.attacking = true;
    } else if ( distance > 30) {
      this.wraith.attacking = false;
    }
  }

  activate(player, wraith) { // wraith activate
    const distance = this.getDistance(player.x, player.y, wraith.x, wraith.y)
    if (distance < 100) {
      this.wraith.activated = true;
    }
  }

  wraithChase() {  // wraith AI chase
    if (this.wraith.activated === true) {
      if (this.wraith.x < this.player.x && this.wraith.y < this.player.y) {
        this.wraith.x += this.wraith.speed;
        this.wraith.y += this.wraith.speed;
        this.wraith.direction = "right";

      } else if (this.wraith.x > this.player.x && this.wraith.y > this.player.y) {
        this.wraith.x -= this.wraith.speed;
        this.wraith.y -= this.wraith.speed;
        this.wraith.direction = "left";

      } else if (this.wraith.y < this.player.y && this.wraith.x > this.player.x) {
        this.wraith.y += this.wraith.speed;
        this.wraith.x -= this.wraith.speed;
        this.wraith.direction = "left";

      } else if (this.wraith.y > this.player.y && this.wraith.x < this.player.x) {
        this.wraith.y -= this.wraith.speed;
        this.wraith.x += this.wraith.speed;
        this.wraith.direction = "right";

      } else if (this.wraith.x < this.player.x) {
        this.wraith.x += this.wraith.speed;
        this.wraith.direction = "right";

      } else if (this.wraith.x > this.player.x) {
        this.wraith.x -= this.wraith.speed;
        this.wraith.direction = "left";

      } else if (this.wraith.y < this.player.y) {
        this.wraith.y += this.wraith.speed;
        this.wraith.direction = "left";

      } else if (this.wraith.y > this.player.y) {
        this.wraith.y -= this.wraith.speed;
        this.wraith.direction = "right";
      }
    }
  }
  
  drawWireFrame() {
    this.ctx.beginPath();
    //x, y, width, height
    // this.ctx.rect(302, 40, 15, 200)
    this.ctx.rect(302, 40, 15, 350); // first room right wall
    this.ctx.rect(52, 228, 248, 15); // first room bottom wall
    this.ctx.rect(0, 39, 1150, 0); // top wall border
    this.objects = [{x:0,y:40,w:1150,h:0}, {x:302, y:40, w:15, h:350}]
    this.ctx.stroke();
  }
  
  drawMaze() {
    for (let y = 37; y < 350; y += 50) {
      this.ctx.drawImage(this.innerWall, 775, 0, 50, 75, 300, y, 55, 80) // top to bottom wall
    }
    for (let x = 100; x < 251; x += 50) {
      this.ctx.drawImage(this.wallImg, 725, 0, 50, 75, x, 227, 55, 80) // side to side wall
    }
    for (let y = 37; y < 300; y += 50) {
      this.ctx.drawImage(this.innerWall, 775, 0, 50, 75, 1050, y, 55, 80) // top to bottom wall
    }
    for (let x = 50; x < 200; x += 50) {
      this.ctx.drawImage(this.wallImg, 725, 0, 50, 75, x, 400, 55, 80) // side to side wall
    }
    for (let x = 50; x < 201; x += 50) {
      this.ctx.drawImage(this.wallImg, 725, 0, 50, 75, x, 580, 55, 80) // side to side wall
    }
    for (let x = 375; x < 450; x += 50) {
      this.ctx.drawImage(this.wallImg, 725, 0, 50, 75, x, 400, 55, 80) // side to side wall
    }
    for (let y = 113; y < 400; y += 50) {
      this.ctx.drawImage(this.innerWall, 775, 0, 50, 75, 475, y, 55, 80) // top to bottom wall
    }
    for (let x = 492; x < 750; x += 50) {
      this.ctx.drawImage(this.wallImg, 725, 0, 50, 75, x, 114, 55, 80) // side to side wall
    }
    for (let y = 28; y < 100; y += 50) {
      this.ctx.drawImage(this.innerWall, 775, 0, 50, 75, 790, y, 55, 80) // top to bottom wall
    }
    for (let x = 700; x < 1050; x += 50) {
      this.ctx.drawImage(this.wallImg, 725, 0, 50, 75, x, 250, 55, 80) // side to side wall
    }
    for (let y = 250; y < 500; y += 50) {
      this.ctx.drawImage(this.innerWall, 775, 0, 50, 75, 685, y, 55, 80) // top to bottom wall
    }
    for (let y = 358; y < 650; y += 50) {
      this.ctx.drawImage(this.innerWall, 775, 0, 50, 75, 585, y, 55, 80) // top to bottom wall
    }
    for (let y = 458; y < 650; y += 50) {
      this.ctx.drawImage(this.innerWall, 775, 0, 50, 75, 900, y, 55, 80) // top to bottom wall
    }
    for (let x = 900; x < 1100; x += 50) {
      this.ctx.drawImage(this.wallImg, 725, 0, 50, 75, x, 445, 55, 80) // side to side wall
    }
  }

  drawBorder() {
    // this.ctx.drawImage(this.wallImg, 0, 0, 950, 70)
    // this.ctx.drawImage(this.wallImg, 100, 100)
    // this.ctx.drawImage(this.wallImg, 482, 0, 50, 100, 50, 660, 60, 80)
    for (let x = 0; x < 1200; x += 50) {
      this.ctx.drawImage(this.wallImg, 482, 0, 50, 100, x, 660, 60, 80)
    }
    for (let y = 550; y >= 0; y -= 50) {
      this.ctx.drawImage(this.wallImg, 582, 0, 55, 80, 1150, y, 60, 83)
    }
    // this.ctx.drawImage(this.topWall, 270, 0, 50, 100, 0, 0, 60, 80)
    for (let x = 0; x < 1150; x += 50) {
      this.ctx.drawImage(this.topWall, 270, 0, 50, 100, x, 0, 60, 80)
    }
    for (let y = 110; y < 650; y += 50) {
      this.ctx.drawImage(this.wallImg, 638, 0, 55, 80, 0, y, 60, 83)
    }
  }
  
}

export default Maze;