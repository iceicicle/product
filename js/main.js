let stage;
let mainPuyo;
let puyoImgList;
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
}

/*==================
	Animation
====================*/
class Animation extends Draw {
  constructor() {
    super();
  }

  movePuyo(imgArray, fromArray, toArray) {
    return new Promise((resolve) => {
      let frame = 0;
      let animationSpeed = 5;
      let movedArray = JSON.parse(JSON.stringify(fromArray));
    
      let requestId;
      let loop = () => {
        this.erasePuyo(fromArray);
        this.erasePuyo(movedArray);
        if (frame < animationSpeed) {
          movedArray.forEach((moved, i) => {
            moved[0] += (toArray[i][0] - fromArray[i][0]) / animationSpeed;
            moved[1] += (toArray[i][1] - fromArray[i][1]) / animationSpeed;
          });
          this.puyo(imgArray, movedArray);
    
        } else {          
          this.puyo(imgArray, toArray);
          cancelAnimationFrame(requestId);
          return resolve();
        }      
        frame++;      
        requestId = requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    })
  }
}

/*==================
	Stage
====================*/
class Stage {
  init() {    
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
    let img = new Image();
    img.src = Config.charaSrc;

    let draw = new Draw();
    draw.stage(img, true);
  }

  setMainPuyo(isInit = false) {
    stage[0][3] = puyoImgList[0][0];
    stage[1][3] = puyoImgList[0][1];

    let draw = new Draw();
    draw.puyo(puyoImgList[0], [mainPuyo[1], mainPuyo[2]], isInit);
  }

  setMovePuyo(fromArray, toArray) {
    let imageList = [];
    fromArray.forEach((from) => {
      imageList.push(stage[from[1]][from[0]]);
      stage[from[1]][from[0]] = 0;
    });

    toArray.forEach((to, i) => {
      stage[to[1]][to[0]] = imageList[i];
    });
  }

  getErasePuyoList() {    
    const direction = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    let erasePuyo = [];
    let searchPuyo = [];

    let setErasePuyoList = (sx, sy) => {  
      for(let i = 0; i < direction.length; i++) {
        let tx = sx + direction[i][0];
        let ty = sy + direction[i][1];

        if (!searchPuyo.some(puyo => { return puyo[0] == tx && puyo[1] == ty; }) &&
            typeof stage[ty][tx] == 'object' &&
            stage[sy][sx].src == stage[ty][tx].src) {

          searchPuyo.push([tx, ty]);
          setErasePuyoList(tx, ty);
        }        
      }      
    };

    for (let x = 1; x <= 6; x++) {
      for (let y = 12; y >= 1; y--) {
        searchPuyo = [];
        setErasePuyoList(x, y);
        if (!erasePuyo.some(puyo => { return puyo[0] == x && puyo[1] == y; }) &&
            searchPuyo.length >= 4) {
          searchPuyo.forEach(puyo => { erasePuyo.push(puyo); });
        }
      }
    }

    return erasePuyo;
  }

  getPuyoImgList(coordArray) {
    let puyoImgList = [];
    coordArray.forEach(coord => {
      puyoImgList.push(stage[coord[1]][coord[0]]);
    });
    return puyoImgList;
  }

  erasePuyo() {
    let erasePuyoList = this.getErasePuyoList();    
    
    erasePuyoList.forEach(coord => {
      stage[coord[1]][coord[0]] = 0
    })
    
    let draw = new Draw();
    return draw.erasePuyo(erasePuyoList);    
  }

  fallingPuyo() {
    let fromArray = [];
    let toArray = [];

    for (let x = 1; x <= 6; x++) {
      let b = 0;
      let isFalling = false;

      for (let y = 12; y >= 0; y--) {
        if (stage[y][x] == 0) isFalling = true;
        if (isFalling && stage[y][x] == 0) b++;
        if (isFalling && stage[y][x] != 0) {
          fromArray.push([x,  y]);
          toArray.push([x,  y + b]);
        }
      }
    }
    let imgList = this.getPuyoImgList(fromArray);    
    this.setMovePuyo(fromArray, toArray);

    let animation = new Animation();
    return animation.movePuyo(imgList, fromArray, toArray);
  }
}

/*==================
	MoveMainPuyo
====================*/
class MoveMainPuyo {
  constructor(keyDown) {
    this.keyDown = keyDown;
    this.currentPuyo = [mainPuyo[1], mainPuyo[2]];
  }

  getMovedPuyo() {
    let x1 = mainPuyo[1][0]; let y1 = mainPuyo[1][1];
    let x2 = mainPuyo[2][0]; let y2 = mainPuyo[2][1];

    switch (this.keyDown) {
      case Config.moveDownKey:  return [ [x1, y1+1], [x2, y2+1] ];
      case Config.moveRightKey: return [ [x1+1, y1], [x2+1, y2] ];
      case Config.moveLeftKey:  return [ [x1-1, y1], [x2-1, y2] ];
    }
  }

  checkStatus() {
    let x1 = mainPuyo[1][0]; let y1 = mainPuyo[1][1];
    let x2 = mainPuyo[2][0]; let y2 = mainPuyo[2][1];

    // 1. 下移動
    if( this.keyDown == Config.moveDownKey ) {
      switch ( mainPuyo.rotate ) {
        case 0 :
          if ( stage[y2+1][x2] != 0 ) return 'turnChange';
          break;
        case 90:
        case 270:
          if ( stage[y1+1][x1] != 0 ) return 'turnChange';
          if ( stage[y2+1][x2] != 0 ) return 'turnChange';
          break;
        case 180:
          if ( stage[y1+1][x1] != 0 ) return 'turnChange';
      }
    }

    // 2. 右移動
    if( this.keyDown == Config.moveRightKey ) {
      switch ( mainPuyo.rotate ) {
        case 0 :
        case 180 :
          if ( stage[y1][x1+1] != 0 ) return 'failed';
          if ( stage[y2][x2+1] != 0 ) return 'failed';
          break;
        case 90 :
          if ( stage[y1][x1+1] != 0 ) return 'failed';
          break;
        case 270 :
          if ( stage[y2][x2+1] != 0 ) return 'failed';
      }
    }

    // 3. 左移動
    if( this.keyDown == Config.moveLeftKey ) {
      switch ( mainPuyo.rotate ) {
        case 0 :
        case 180 :
          if ( stage[y1][x1-1] != 0 ) return 'failed';
          if ( stage[y2][x2-1] != 0 ) return 'failed';
          break;
        case 90 :
          if ( stage[y2][x2-1] != 0 ) return 'failed';
          break;
        case 270 :
          if ( stage[y1][x1-1] != 0 ) return 'failed';
      }
    }
    return 'succeeded';
  }

  execute() {
    let stage = new Stage();
    let imgList = stage.getPuyoImgList(this.currentPuyo);
    let movedPuyo = this.getMovedPuyo();
    stage.setMovePuyo( this.currentPuyo, movedPuyo );
    
    mainPuyo[1] = movedPuyo[0];
    mainPuyo[2] = movedPuyo[1];
    
    let animation = new Animation(); 
    animation.movePuyo(imgList, this.currentPuyo, movedPuyo);
  }
}

/*==================
	RotateMainPuyo
====================*/
class RotateMainPuyo {
  constructor(keyDown) {
    this.keyDown = keyDown;
    this.currentPuyo = [mainPuyo[1], mainPuyo[2]];
  }

  getRotatedPuyo(status) {
    let x1 = mainPuyo[1][0]; let y1 = mainPuyo[1][1];
    let x2 = mainPuyo[2][0]; let y2 = mainPuyo[2][1];

    if( this.keyDown == Config.rotateRightKey ) {
      if( status == 'normal' ) {
        switch (mainPuyo.rotate) {
          case 0:   return [ [x1+1, y1+1], [x2, y2] ];
          case 90:  return [ [x1-1, y1+1], [x2, y2] ];
          case 180: return [ [x1-1, y1-1], [x2, y2] ];
          case 270: return [ [x1+1, y1-1], [x2, y2] ];
        }
      }
      if( status == 'sp1' ) return [ [x1, y1+1], [x2-1, y2] ];
      if( status == 'sp2' ) return [ [x1-1, y1], [x2, y2-1] ];
      if( status == 'sp3' ) return [ [x1, y1-1], [x2+1, y2] ];
    }

    if( this.keyDown == Config.rotateLeftKey ) {
      if( status == 'normal' ) {
        switch (mainPuyo.rotate) {
          case 0:   return [ [x1-1, y1+1], [x2, y2] ];
          case 90:  return [ [x1-1, y1-1], [x2, y2] ];
          case 180: return [ [x1+1, y1-1], [x2, y2] ];
          case 270: return [ [x1+1, y1+1], [x2, y2] ];
        }
      }
      if( status == 'sp4' ) return [ [x1, y1+1], [x2+1, y2] ];
      if( status == 'sp5' ) return [ [x1+1, y1], [x2, y2-1] ];
      if( status == 'sp6' ) return [ [x1, y1-1], [x2-1, y2] ];
    }
  }

  checkStatus() {
    let x1 = mainPuyo[1][0]; let y1 = mainPuyo[1][1];
    let x2 = mainPuyo[2][0]; let y2 = mainPuyo[2][1];

    if( this.keyDown == Config.rotateRightKey ) {
      switch ( mainPuyo.rotate ) {
        case 0 :
          if ( stage[y1][x1+1] != 0 && stage[y2][x2-1] != 0 ) return 'failed';
          if ( stage[y2][x2-1] != 0 && stage[y2][x2+1] != 0 ) return 'failed';
          if ( stage[y2][x2+1] != 0 && stage[y2][x2-1] == 0 ) return 'sp1';
          break;
        case 90 :
          if ( stage[y1+1][x1] != 0 ) return 'sp2';
          if ( stage[y2+1][x2] != 0 ) return 'sp2';
          break;
        case 180 :
          if ( stage[y1][x1-1] != 0 && stage[y2][x2+1] != 0 ) return 'failed';
          if ( stage[y2][x2-1] != 0 && stage[y2][x2+1] != 0 ) return 'failed';
          if ( stage[y1][x1-1] != 0 && stage[y1][x1+1] == 0 && stage[y2][x2+1] == 0 ) return 'sp3';
      }
    }

    if( this.keyDown == Config.rotateLeftKey ) {
      switch ( mainPuyo.rotate ) {
        case 0 :
          if ( stage[y1][x1-1] != 0 && stage[y2][x2+1] != 0 ) return 'failed';
          if ( stage[y2][x2-1] != 0 && stage[y2][x2+1] != 0 ) return 'failed';
          if ( stage[y2][x2-1] != 0 && stage[y2][x2+1] == 0 ) return 'sp4';
          break;
        case 270 :
          if ( stage[y1+1][x1] != 0 ) return 'sp5';
          if ( stage[y2+1][x2] != 0 ) return 'sp5';
          break;
        case 180 :
          if ( stage[y1][x1+1] != 0 && stage[y2][x2-1] != 0 ) return 'failed';
          if ( stage[y2][x2-1] != 0 && stage[y2][x2+1] != 0 ) return 'failed';
          if ( stage[y1][x1+1] != 0 && stage[y1][x1-1] == 0 && stage[y2][x2-1] == 0 ) return 'sp6';
      }
    }
    return 'normal';
  }

  execute(status) {
    let stage = new Stage();    
    let imgList = stage.getPuyoImgList(this.currentPuyo);
    let rotatedPuyo = this.getRotatedPuyo(status);

    stage.setMovePuyo( this.currentPuyo, rotatedPuyo );
    
    mainPuyo[1] = rotatedPuyo[0];
    mainPuyo[2] = rotatedPuyo[1];

    switch (this.keyDown) {
      case Config.rotateRightKey:
        mainPuyo.rotate = (mainPuyo.rotate + 90) % 360;
        break;
      case Config.rotateLeftKey:
        mainPuyo.rotate = (mainPuyo.rotate - 90 + 360) % 360;        
    }

    let animation = new Animation();
    animation.movePuyo( imgList, this.currentPuyo, rotatedPuyo )
  }
}
/*==================
	TurnChange
====================*/
class TurnChange {
  constructor() {
    this.stage = new Stage();
  }

  init() {
    puyoImgList = [];
    this.setMainPuyo(true);
    this.setNextPuyo();
  }

  setMainPuyo(isInit = false) {
    puyoImgList[0] = !isInit ? puyoImgList[1] : [this.makePuyo(), this.makePuyo()];
    mainPuyo = { 'rotate': 0, '1': [3, 0], '2': [3, 1] };
    this.stage.setMainPuyo(isInit);
  }

  setNextPuyo() {
    puyoImgList[1] = [];
    let nextPuyoList = [this.makePuyo(), this.makePuyo()];    
    nextPuyoList.forEach((img, i) => {
      img.onload = () => { puyoImgList[1][i] = img; };
    });
  };

  makePuyo() {
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

  async execute() {    
    try {
      // ぷよをステージ最下部まで落下させる
      await this.stage.fallingPuyo();

      // ぷよが消せるか判定し、すべて消すまでループ
      while(this.stage.getErasePuyoList().length) {
        this.stage.erasePuyo();
        await this.stage.fallingPuyo();
      }

      // 消し終わったら次のぷよを設定
      this.setMainPuyo();
      this.setNextPuyo();
    } catch(e) {
      // do nothing 
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
      let mStatus = moveMainPuyo.checkStatus();
      switch (mStatus) {
        case 'succeeded':  moveMainPuyo.execute(); return;
        case 'turnChange': isTurnChange = true; break;
        case 'failed': return;
      }
      break;
    
    case Config.rotateRightKey:
    case Config.rotateLeftKey:
      let rotateMainPuyo = new RotateMainPuyo(e.key);
      let rStatus = rotateMainPuyo.checkStatus();
      switch (rStatus) {
        case 'turnChange': isTurnChange = true; break;
        case 'failed': return;
        default: rotateMainPuyo.execute(rStatus); return;
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
  turnChange.init();
});
