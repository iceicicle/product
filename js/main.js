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
  puyoImgWidth: 73,  
  puyoImgHeight: 73,

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
      let x = Config.stageBaseX + puyo.x * Config.puyoImgWidth;
      let y = Config.stageBaseY + puyo.y * Config.puyoImgHeight;

      this.image(this.layer2ctx, puyo.img, x, y);
    });
  }

  erasePuyo() {
    let x1 = Config.stageBaseX + Config.puyoImgWidth * mainPuyo[1].x / 1;
    let y1 = Config.stageBaseY + Config.puyoImgHeight * mainPuyo[1].y / 1;
    this.layer2ctx.clearRect(x1, y1, Config.puyoImgWidth, Config.puyoImgHeight);

    let x2= Config.stageBaseX + Config.puyoImgWidth * mainPuyo[2].x / 1;
    let y2 = Config.stageBaseY + Config.puyoImgHeight * mainPuyo[2].y / 1;    
    this.layer2ctx.clearRect(x2, y2, Config.puyoImgWidth, Config.puyoImgHeight);
  }
  
  render(array) {
    for(let coord of array) {
      let x = Config.stageBaseX + Config.puyoImgWidth * coord[0];
      let y = Config.stageBaseY + Config.puyoImgHeight * coord[1];
      
      let flag = true;
      let newY = coord[1];
      while(flag) {        
        if(stage[newY + 1][coord[0]] == 0) {
          newY++;
        } else {
          this.layer2ctx.clearRect(x, y, Config.puyoImgWidth, Config.puyoImgHeight);
          let YY = Config.stageBaseY + Config.puyoImgHeight * newY;
          this.image(this.layer2ctx, stage[coord[1]][coord[0]].img, x, YY); // 本来はアニメーション
          flag = false;
        }
      }
    }
  }
}

/*==================
	Init
====================*/
class Init {
  constructor() {
    this.draw = new Draw(true);
    this.nextTurn = new NextTurn();
    
    this.setStage();             // ステージ設定
    this.nextTurn.setMainPuyo(); // メインぷよ設定
    this.draw.puyo(mainPuyo);
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

  
}
/*==================
	Stage
====================*/
class Stage {
  constructor() {
    this.draw = new Draw();
    this.fallingPuyoList = [];
  }
  setMainPuyo() {
    stage[mainPuyo[1].y][mainPuyo[1].x] = mainPuyo[1]
    stage[mainPuyo[2].y][mainPuyo[2].x] = mainPuyo[2]
  }

  getFallingPuyoList() {
    for (let i = 1; i < 7; i++) {
      let isFalling = false;
      stage.slice(1, 13).reverse().map((col, j) => {
        if (col[i] == 0) isFalling = true;
        if (isFalling && col[i] != 0) {
          this.fallingPuyoList.push([i, 12 - j]);
        }
      })
    }
    this.draw.render(this.fallingPuyoList);
  }
}

/*==================
	NextTurn
====================*/
class NextTurn {
  setMainPuyo() {
    let makePuyo = (position) => {
      let img = new Image();
      let color = Math.floor(Math.random() * Config.puyoKind) + 1;
      img.src = (() => {      
        switch (color) {      
          case 1:
            return Config.puyoBlueSrc;
          case 2:
            return Config.puyoGreenSrc;
          case 3:
            return Config.puyoRedSrc;
          case 4:
            return Config.puyoYellowSrc;
        }
      })();

      return !position ?
        { img: img, color: color, x: 3, y: 0 } :
        { img: img, color: color, x: 3, y: 1 }
    }

    mainPuyo = [{ rotate: 0 }, makePuyo(0), makePuyo(1)];
  };
}

class MoveMainPuyo {
  constructor(keyDown, rotate, puyo1, puyo2) {
    this.draw = new Draw();
    this.stage = new Stage();
    this.keyDown = keyDown;
    this.rotate = rotate;
    this.puyo1 = Object.assign({}, puyo1);
    this.puyo2 = Object.assign({}, puyo2);
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

  checkStatus() {
    if(this.keyDown == Config.moveDownKey &&
      ( stage[this.movedMainPuyo[0].y][this.movedMainPuyo[0].x] != 0 ||
         stage[this.movedMainPuyo[1].y][this.movedMainPuyo[0].x] != 0 ) ) {
      return 'next';
    }

    if( !( stage[this.movedMainPuyo[0].y][this.movedMainPuyo[0].x] == 0 &&
           stage[this.movedMainPuyo[1].y][this.movedMainPuyo[1].x] == 0 ) ) {
      return 'failed';
    }

    return 'succeeded';
  }

  execute() {
    let frame = 0;
    let animationSpeed = 5;
    
    let requestId;
    let loop = () => {      
      if (frame < animationSpeed) {
        this.draw.erasePuyo();       
        mainPuyo[1].x += (this.movedMainPuyo[0].x - this.puyo1.x) / animationSpeed;
        mainPuyo[1].y += (this.movedMainPuyo[0].y - this.puyo1.y) / animationSpeed;
        mainPuyo[2].x += (this.movedMainPuyo[1].x - this.puyo2.x) / animationSpeed;
        mainPuyo[2].y += (this.movedMainPuyo[1].y - this.puyo2.y) / animationSpeed;
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
      this.draw.puyo(mainPuyo);      
      frame++;
      
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
      switch (moveMainPuyo.checkStatus()) {
        case 'succeeded':
          moveMainPuyo.execute();
          break;        
        case 'next':
          let stage = new Stage();
          let nextTurn = new NextTurn();
          // メインぷよをステージ最下部まで落下させる
          stage.setMainPuyo();
          stage.getFallingPuyoList();          
          
          // ぷよが消せるか判定し、すべて消すまでループ

          // 消し終わったら次のメインぷよを設定
          nextTurn.setMainPuyo();
          break;
        case 'failed':
          break;
      }
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