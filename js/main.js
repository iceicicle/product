let stage;
let mainPuyo;
/*==================
	Config
====================*/
const Config = {
  stageWidth: 540,
  stageHeight: 960,
  
  stageBaseX: -20.5,
  stageBaseY: -63,

  charaSrc: './img/chara.png',
  puyoBlueSrc: './img/puyo_blue.png',
  puyoGreenSrc: './img/puyo_green.png',
  puyoRedSrc: './img/puyo_red.png',
  puyoYellowSrc: './img/puyo_yellow.png',

  puyoKind: 4,
  puyoImgWidth: 68,  
  puyoImgHeight: 68,
  puyoImgPadding: 5,

  moveDownKey: 'ArrowDown',
  moveRightKey: 'ArrowRight',
  moveLeftKey: 'ArrowLeft',
  rotateRightKey: 'd',
  rotateLeftKey: 's',
}

/*==================
	Layer
====================*/
class Layer {
  constructor() {
    this.layer1 = document.getElementById('layer1');
    this.layer1ctx = document.getElementById('layer1').getContext('2d');
    this.layer2 = document.getElementById('layer2');
    this.layer2ctx = document.getElementById('layer2').getContext('2d');
  }  
}

/*==================
	Draw
====================*/
class Draw extends Layer {
  constructor(isInit = false) {
    super();
    this.isInit = isInit;
  }

  stage(img) {
    this.layer1.width = Config.stageWidth;
    this.layer1.height = Config.stageHeight;
    this.layer2.width = Config.stageWidth;
    this.layer2.height = Config.stageHeight;

    this.layer1ctx.fillRect(0, 0, Config.stageWidth, Config.stageHeight);
    this.image(this.layer1ctx, img);
  }

  image(layer, img, x = 0, y = 0) {
    if (!this.isInit) {
      layer.drawImage(img, x, y);      
    } else {
      img.onload = () => {
        layer.drawImage(img, x, y);
      }
    }
  }

  puyo(array) {
    if(array == mainPuyo) array = array.slice(1, 3);
    array.forEach(puyo => {
      let x = Config.stageBaseX + puyo.x * (Config.puyoImgWidth + Config.puyoImgPadding);
      let y = Config.stageBaseY + puyo.y * (Config.puyoImgHeight + Config.puyoImgPadding);

      this.image(this.layer2ctx, puyo.img, x, y);
    });
  }

  eraseLayer() {
    this.layer2ctx.clearRect(0, 0, this.layer2.width, this.layer2.height);
  }
}

/*==================
	Init
====================*/
class Init {
  constructor() {
    this.draw = new Draw(true);

    // ステージ設定    
    this.setStage();

    // メインぷよ設定
    this.setMainPuyo();
  }

  setStage() {
    let img = new Image();
    img.src = Config.charaSrc;
    this.draw.stage(img);

    stage = [
      [9, 0, 0, 0, 0, 0, 0, 9],
      [9, 0, 0, 0, 0, 0, 0, 9],
      [9, 0, 0, 0, 0, 0, 0, 9],
      [9, 0, 0, 0, 0, 0, 0, 9],
      [9, 0, 0, 0, 0, 0, 0, 9],
      [9, 0, 0, 0, 0, 0, 0, 9],
      [9, 0, 0, 0, 0, 0, 0, 9],
      [9, 0, 0, 0, 0, 0, 0, 9],
      [9, 0, 0, 0, 0, 0, 0, 9],
      [9, 0, 0, 0, 0, 0, 0, 9],
      [9, 0, 0, 0, 0, 0, 0, 9],
      [9, 0, 0, 0, 0, 0, 0, 9],
      [9, 0, 0, 0, 0, 0, 0, 9],
      [9, 9, 9, 9, 9, 9, 9, 9],
    ];
  }

  setMainPuyo() {
     let makePuyo = (position) => {
      let img = new Image();
      let color = Math.floor(Math.random() * Config.puyoKind);
      img.src = (() => {      
        switch (color) {      
          case 0:
            return Config.puyoBlueSrc;
          case 1:
            return Config.puyoGreenSrc;
          case 2:
            return Config.puyoRedSrc;
          case 3:
            return Config.puyoYellowSrc;
        }
      })();

      return !position ?
        { img: img, color: color, x: 3, y: 0 } :
        { img: img, color: color, x: 3, y: 1 }
    }

    mainPuyo = [{ rotate: 0 }, makePuyo(0), makePuyo(1)];
    this.draw.puyo(mainPuyo);
  };
}

class MoveMainPuyo {
  constructor(keyDown, rotate, puyo1, puyo2) {
    this.draw = new Draw();
    this.keyDown = keyDown;
    this.rotate = rotate;
    this.movedMainPuyo = this.get(puyo1.x, puyo1.y, puyo2.x, puyo2.y);
  }

  get(x1, y1, x2, y2) {
    switch (this.keyDown) {
      case Config.moveDownKey:
        return [ {x: x1, y: y1 + 1}, {x: x2, y: y2 + 1} ];

      case Config.moveRightKey:
        return [ {x: x1 + 1, y: y1}, {x: x2 + 1, y: y2} ];

      case Config.moveLeftKey:
        return [ {x: x1 - 1, y: y1}, {x: x2 - 1, y: y2} ];
        
      case Config.rotateRightKey:
        switch (this.rotate) {
          case 0:   return [ {x: x1 + 1, y: y1 + 1}, {x: x2, y: y2} ];
          case 90:  return [ {x: x1 - 1, y: y1 + 1}, {x: x2, y: y2} ];
          case 180: return [ {x: x1 - 1, y: y1 - 1}, {x: x2, y: y2} ];
          case 270: return [ {x: x1 + 1, y: y1 - 1}, {x: x2, y: y2} ];
        }

      case Config.rotateLeftKey:
        switch (this.rotate) {
          case 0:   return [ {x: x1 - 1, y: y1 + 1}, {x: x2, y: y2} ];
          case 90:  return [ {x: x1 - 1, y: y1 - 1}, {x: x2, y: y2} ];
          case 180: return [ {x: x1 + 1, y: y1 - 1}, {x: x2, y: y2} ];
          case 270: return [ {x: x1 + 1, y: y1 + 1}, {x: x2, y: y2} ];
        }
    }
  }

  isMovedFailed() {
    if( !( stage[this.movedMainPuyo[0].y][this.movedMainPuyo[0].x] == 0 &&
           stage[this.movedMainPuyo[1].y][this.movedMainPuyo[1].x] == 0 ) ) {
      return true;
    }
    return false;
  }

  execute() {
    if(this.isMovedFailed()) return;
    let speed = 10;
    let cnt = 0;
    let tempPuyo = [
      (this.movedMainPuyo[0].x - mainPuyo[1].x),
      (this.movedMainPuyo[0].y - mainPuyo[1].y),
      (this.movedMainPuyo[1].x - mainPuyo[2].x),
      (this.movedMainPuyo[1].y - mainPuyo[2].y),
    ]
    
    let requestId;
    let loop = () => {
      if (cnt < speed) {
        mainPuyo[1].x += (tempPuyo[0] / speed);
        mainPuyo[1].y += (tempPuyo[1] / speed);
        mainPuyo[2].x += (tempPuyo[2] / speed);
        mainPuyo[2].y += (tempPuyo[3] / speed);
      } else {
        // 丸め誤差
        mainPuyo[1].x = Math.round(mainPuyo[1].x);
        mainPuyo[1].y = Math.round(mainPuyo[1].y);
        mainPuyo[2].x = Math.round(mainPuyo[2].x);
        mainPuyo[2].y = Math.round(mainPuyo[2].y);
  
        switch (this.keyDown) {
          case Config.rotateRightKey:
            mainPuyo[0].rotate = (mainPuyo[0].rotate + 90) % 360;
            break;
          case Config.rotateLeftKey:
            mainPuyo[0].rotate = (mainPuyo[0].rotate - 90 + 360) % 360;        
        }
        return cancelAnimationFrame(requestId);      
      }
      this.draw.eraseLayer();
      this.draw.puyo(mainPuyo);      
      cnt++;
      
      requestId = requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

/*==================
	Operation
====================*/
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case Config.moveDownKey:
    case Config.moveRightKey:
    case Config.moveLeftKey:
    case Config.rotateRightKey:
    case Config.rotateLeftKey:
      let moveMainPuyo = new MoveMainPuyo(e.key, mainPuyo[0].rotate, mainPuyo[1], mainPuyo[2]);
      moveMainPuyo.execute();
      break;      
  }  
});

window.addEventListener("load", () => {
  new Init();
});

/*==================
	Memo
====================*/
// stage2d.fillRect(53.5, 10, 68, 68);
// stage2d.fillRect(53.5, 83, 68, 68);
// stage2d.fillRect(53.5, 156, 68, 68);
// stage2d.fillRect(53.5, 229, 68, 68);
// stage2d.fillRect(53.5, 302, 68, 68);
// stage2d.fillRect(53.5, 375, 68, 68);
// stage2d.fillRect(53.5, 448, 68, 68);
// stage2d.fillRect(53.5, 521, 68, 68);
// stage2d.fillRect(53.5, 594, 68, 68);
// stage2d.fillRect(53.5, 667, 68, 68);
// stage2d.fillRect(53.5, 740, 68, 68);
// stage2d.fillRect(53.5, 813, 68, 68);
// stage2d.fillRect(126.5, 10, 68, 68);
// stage2d.fillRect(199.5, 10, 68, 68);
// stage2d.fillRect(272.5, 10, 68, 68);
// stage2d.fillRect(345.5, 10, 68, 68);
// stage2d.fillRect(418.5, 10, 68, 68);