let mainPuyo = [];
/*==================
	Config
====================*/
const Config = {
  stageWidth: 540,
  stageHeight: 960,
  
  stageBaseX: 53.5,
  stageBaseY: 10,

  charaSrc: './img/chara.png',
  puyoBlueSrc: './img/puyo_blue.png',
  puyoGreenSrc: './img/puyo_green.png',
  puyoRedSrc: './img/puyo_red.png',
  puyoYellowSrc: './img/puyo_yellow.png',

  puyoKind: 4,
  puyoImgWidth: 68,  
  puyoImgHeight: 68,
  puyoImgPadding: 5,
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
        { img: img, color: color, x: 2, y: 0 } :
        { img: img, color: color, x: 2, y: 1 }
    }

    mainPuyo.push({ rotate: 0 }); // メインぷよ：ヘッダ
    mainPuyo.push(makePuyo(0));   // メインぷよ：上
    mainPuyo.push(makePuyo(1));   // メインぷよ：下

    this.draw.puyo(mainPuyo); // ヘッダ以外を描画
  };
}

/*==================
	Operation
====================*/
window.addEventListener('keydown', (e) => {
  let draw = new Draw();
  let cnt = 0;
  let speed = 5;

  move = (direction) => {
    loop = () => {
      if (cnt >= speed) return;
      switch (direction) {      
        case 'down':
          mainPuyo[1].y += (1 / speed);
          mainPuyo[2].y += (1 / speed);
          break;
        case 'left':
          mainPuyo[1].x -= (1 / speed);
          mainPuyo[2].x -= (1 / speed);
          break;
        case 'right':
          mainPuyo[1].x += (1 / speed);
          mainPuyo[2].x += (1 / speed);
      }
      draw.eraseLayer();
      draw.puyo(mainPuyo);
      requestAnimationFrame(loop);
      cnt++;
    }
    loop();
  }

  rotateRight = () => {
    loop = () => {
      if (cnt < speed) {      
        switch (mainPuyo[0].rotate) {
          case 0:
            mainPuyo[1].x += (1 / speed);
            mainPuyo[1].y += (1 / speed);
            break;
          case 90:
            mainPuyo[1].x -= (1 / speed);
            mainPuyo[1].y += (1 / speed);
            break;
          case 180:
            mainPuyo[1].x -= (1 / speed);
            mainPuyo[1].y -= (1 / speed);
            break;
          case 270:
            mainPuyo[1].x += (1 / speed);
            mainPuyo[1].y -= (1 / speed);
          }
      } else {
        mainPuyo[0].rotate = (mainPuyo[0].rotate + 90) % 360;
        return;
      }

      draw.eraseLayer();
      draw.puyo(mainPuyo);      
      cnt++;

      requestAnimationFrame(loop);
    }
    loop();    
  }

  rotateLeft = () => {
    loop = () => {
      if (cnt < speed) {      
        switch (mainPuyo[0].rotate) {
          case 0:
            mainPuyo[1].x -= (1 / speed);
            mainPuyo[1].y += (1 / speed);
            break;
          case 90:
            mainPuyo[1].x -= (1 / speed);
            mainPuyo[1].y -= (1 / speed);
            break;
          case 180:
            mainPuyo[1].x += (1 / speed);
            mainPuyo[1].y -= (1 / speed);
            break;
          case 270:
            mainPuyo[1].x += (1 / speed);
            mainPuyo[1].y += (1 / speed);
          }
      } else {
        mainPuyo[0].rotate = (mainPuyo[0].rotate - 90 + 360) % 360;
        return;
      }

      draw.eraseLayer();
      draw.puyo(mainPuyo);      
      cnt++;

      requestAnimationFrame(loop);
    }
    loop();    
  }

  switch (e.key) {
    case 'ArrowDown': // 下移動
    this.move('down');
    break;

    case 'ArrowLeft': // 左移動
    this.move('left');
    break;

    case 'ArrowRight': // 右移動
    this.move('right');
    break;

    case 'd': // 右回転
    this.rotateRight();    
    break;

    case 's': // 左回転
    this.rotateLeft();
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