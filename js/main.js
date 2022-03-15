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
  constructor() {
    super();
  }

  image(layer, img, x, y, isInit) {
    if (!isInit) { layer.drawImage(img, x, y); }
    else         { img.onload = () => { layer.drawImage(img, x, y); } }
  }

  stage(img, isInit = false) {
    this.layer1.width = Config.stageWidth;
    this.layer1.height = Config.stageHeight;
    this.layer2.width = Config.stageWidth;
    this.layer2.height = Config.stageHeight;

    this.layer1ctx.fillRect(0, 0, Config.stageWidth, Config.stageHeight);
    this.image(this.layer1ctx, img, 0, 0, isInit);
  }

  puyo(imgArray, coordArray, isInit = false) {    
    imgArray.forEach((img, i) => {
      let x = Config.stageBaseX + coordArray[i][0] * Config.puyoImgWidth;
      let y = Config.stageBaseY + coordArray[i][1] * Config.puyoImgHeight;
  
      this.image(this.layer2ctx, img, x, y, isInit);
    })
  }

  erasePuyo(coordArray) {
    coordArray.forEach(coord => {
      let x = Config.stageBaseX + Config.puyoImgWidth * coord[0] / 1;
      let y = Config.stageBaseY + Config.puyoImgHeight * coord[1] / 1;

      this.layer2ctx.clearRect(x, y, Config.puyoImgWidth, Config.puyoImgHeight);
    })
  }
  
  moveAnimation(imgArray, fromArray, toArray) {
    let frame = 0;
    let animationSpeed = 5;
    let movedArray = JSON.parse(JSON.stringify(fromArray));

    let requestId;
    let loop = () => {
      this.erasePuyo(movedArray);
      if (frame < animationSpeed) {
        movedArray.forEach((moved, i) => {
          moved[0] += (toArray[i][0] - fromArray[i][0]) / animationSpeed;
          moved[1] += (toArray[i][1] - fromArray[i][1]) / animationSpeed;
        });
        this.puyo(imgArray, movedArray);

      } else {
        this.puyo(imgArray, toArray);
        return cancelAnimationFrame(requestId);
      }      
      frame++;      
      requestId = requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
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
	Stage
====================*/
class Stage {
  constructor() {
    this.draw = new Draw();
    this.fallingPuyoList = [];
  }

  init() {
    let img = new Image();
    img.src = Config.charaSrc;
    this.draw.stage(img, true);

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
    let makePuyo = () => {
      let img = new Image();
      let color = Math.floor(Math.random() * Config.puyoKind) + 1;
      switch (color) {      
        case 1: img.src = Config.puyoBlueSrc;   break;
        case 2: img.src = Config.puyoGreenSrc;  break;
        case 3: img.src = Config.puyoRedSrc;    break;
        case 4: img.src = Config.puyoYellowSrc;
      }
      return img;
    }
    let mainPuyoImgList = [makePuyo(), makePuyo()];

    stage[0][3] = mainPuyoImgList[0];
    stage[1][3] = mainPuyoImgList[1];

    mainPuyo = { 'rotate': 0, '1': [3, 0], '2': [3, 1] };
    this.draw.puyo(mainPuyoImgList, [mainPuyo[1], mainPuyo[2]], true);
  }

  getPuyoImgList(coordArray) {
    let puyoImgList = [];
    coordArray.forEach(coord => {
      puyoImgList.push(stage[coord[1]][coord[0]]);
    });
    return puyoImgList;
  }

  movePuyo(fromArray, toArray) {
    let imageList = [];
    fromArray.forEach((from) => {
      imageList.push(stage[from[1]][from[0]]);
      stage[from[1]][from[0]] = 0;
    });

    toArray.forEach((to, i) => {
      stage[to[1]][to[0]] = imageList[i];
    });
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
	TurnChange
====================*/
class TurnChange {
  constructor() {
    this.stage = new Stage();
  }

  execute() {    
    // メインぷよをステージ最下部まで落下させる

    // ぷよが消せるか判定し、すべて消すまでループ

    // 消し終わったら次のメインぷよを設定
    this.stage.setMainPuyo();
  }
}

/*==================
	MoveMainPuyo
====================*/
class MoveMainPuyo {
  constructor(keyDown) {
    this.keyDown = keyDown;
    this.currentPuyo = [mainPuyo[1], mainPuyo[2]];
    this.movedPuyo = this.init();
  }

  init() {
    let x1 = mainPuyo[1][0]; let y1 = mainPuyo[1][1];
    let x2 = mainPuyo[2][0]; let y2 = mainPuyo[2][1];

    switch (this.keyDown) {
      case Config.moveDownKey:  return [ [x1, y1 + 1], [x2, y2 + 1] ];
      case Config.moveRightKey: return [ [x1 + 1, y1], [x2 + 1, y2] ];
      case Config.moveLeftKey:  return [ [x1 - 1, y1], [x2 - 1, y2] ];
    }
  }

  checkStatus() {
    // if(this.keyDown == Config.moveDownKey &&
    //   ( stage[this.movedMainPuyo[0][1]][this.movedMainPuyo[0][0]] != 0 ||
    //     stage[this.movedMainPuyo[1][1]][this.movedMainPuyo[1][0]] != 0 ) ) {
    //   return 'turnChange';
    // }

    // if( !( stage[this.movedMainPuyo[0][1]][this.movedMainPuyo[0][1]] == 0 &&
    //        stage[this.movedMainPuyo[1][1]][this.movedMainPuyo[1][1]] == 0 ) ) {
    //   return 'failed';
    // }

    return 'succeeded';
  }

  execute() {
    let draw = new Draw(); 
    let stage = new Stage();
    
    let imgList = stage.getPuyoImgList(this.currentPuyo);
    draw.moveAnimation( imgList, this.currentPuyo, this.movedPuyo );
    stage.movePuyo( this.currentPuyo, this.movedPuyo );
    
    mainPuyo[1] = this.movedPuyo[0];
    mainPuyo[2] = this.movedPuyo[1];
  }
}

/*==================
	RotateMainPuyo
====================*/
class RotateMainPuyo {
  constructor(keyDown) {
    this.keyDown = keyDown;
    this.currentPuyo = [mainPuyo[1], mainPuyo[2]];
    this.rotatedPuyo = this.init();
  }

  init() {
    let x1 = mainPuyo[1][0]; let y1 = mainPuyo[1][1];
    let x2 = mainPuyo[2][0]; let y2 = mainPuyo[2][1];

    switch (this.keyDown) {
      case Config.rotateRightKey:
        switch (mainPuyo.rotate) {
          case 0:   return [ [x1 + 1, y1 + 1], [x2, y2] ];
          case 90:  return [ [x1 - 1, y1 + 1], [x2, y2] ];
          case 180: return [ [x1 - 1, y1 - 1], [x2, y2] ];
          case 270: return [ [x1 + 1, y1 - 1], [x2, y2] ];
        }

      case Config.rotateLeftKey:
        switch (mainPuyo.rotate) {
          case 0:   return [ [x1 - 1, y1 + 1], [x2, y2] ];
          case 90:  return [ [x1 - 1, y1 - 1], [x2, y2] ];
          case 180: return [ [x1 + 1, y1 - 1], [x2, y2] ];
          case 270: return [ [x1 + 1, y1 + 1], [x2, y2] ];
        }
    }
  }

  checkStatus() {
    return 'succeeded';
  }

  execute() {
    let draw = new Draw(); 
    let stage = new Stage();
    
    let imgList = stage.getPuyoImgList(this.currentPuyo);
    draw.moveAnimation( imgList, this.currentPuyo, this.rotatedPuyo );
    stage.movePuyo( this.currentPuyo, this.rotatedPuyo );
    
    mainPuyo[1] = this.rotatedPuyo[0];
    mainPuyo[2] = this.rotatedPuyo[1];

    switch (this.keyDown) {
      case Config.rotateRightKey:
        mainPuyo.rotate = (mainPuyo.rotate + 90) % 360;
        break;
      case Config.rotateLeftKey:
        mainPuyo.rotate = (mainPuyo.rotate - 90 + 360) % 360;        
    }
  }
}

/*==================
	Operation
====================*/
window.addEventListener('keydown', (e) => {
  let isTurnChange = false;
  switch (e.key) {
    case Config.moveDownKey:
    case Config.moveRightKey:
    case Config.moveLeftKey:
      let moveMainPuyo = new MoveMainPuyo(e.key);
      switch (moveMainPuyo.checkStatus()) {
        case 'succeeded':  moveMainPuyo.execute(); return;
        case 'turnChange': isTurnChange = true;    break;
        case 'failed':    return;
      }
    
    case Config.rotateRightKey:
    case Config.rotateLeftKey:
      let rotateMainPuyo = new RotateMainPuyo(e.key);
      switch (rotateMainPuyo.checkStatus()) {
        case 'succeeded':  rotateMainPuyo.execute(); return;
        case 'turnChange': isTurnChange = true;      break;
        case 'failed':    return;
      }
  }

  if (isTurnChange) {
    let turnChange = new TurnChange();
    turnChange.execute();
  }
});

window.addEventListener("load", () => {
  // ステージ設定
  let stage = new Stage();
  stage.init();

  // メインぷよ設定
  let turnChange = new TurnChange();
  turnChange.execute();
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