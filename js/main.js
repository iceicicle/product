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
    array.forEach(val => {
      let x = Config.stageBaseX + val[2] * (Config.puyoImgWidth + Config.puyoImgPadding);
      let y = Config.stageBaseY + val[3] * (Config.puyoImgHeight + Config.puyoImgPadding);

      this.image(this.layer2ctx, val[0], x, y);
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
    // ステージ設定
    let draw = new Draw(true);
    let img = new Image();
    img.src = Config.charaSrc;
    draw.stage(img);

    // メインぷよ設定（色はランダム）
    this.setMainPuyo(2, 0);
    this.setMainPuyo(2, 1);

    // メインぷよ描画
    draw.puyo(mainPuyo);
  }

  setMainPuyo(stageX, stageY) {
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

    mainPuyo.push([img, color, stageX, stageY]);
  }
}

/*==================
	Operation
====================*/
window.onkeydown = (e) => {
  let draw = new Draw();
  let cnt = 0;
  let speed = 5;

  move = (direction) => {
    loop = () => {
      if (cnt >= speed) return;
      switch (direction) {      
        case 'down':
          mainPuyo[0][3] = mainPuyo[0][3] + 1 / speed;
          mainPuyo[1][3] = mainPuyo[1][3] + 1 / speed;
          break;
        case 'left':
          mainPuyo[0][2] = mainPuyo[0][2] - 1 / speed;
          mainPuyo[1][2] = mainPuyo[1][2] - 1 / speed;
          break;
        case 'right':
          mainPuyo[0][2] = mainPuyo[0][2] + 1 / speed;
          mainPuyo[1][2] = mainPuyo[1][2] + 1 / speed;
      }
      draw.eraseLayer();
      draw.puyo(mainPuyo);
      requestAnimationFrame(loop);
      cnt++;
    }
    loop();
  }

  switch (e.keyCode) {
    case 40: // 下移動
    this.move('down');
    break;

    case 37: // 左移動
    this.move('left');
    break;

    case 39: // 右移動
    this.move('right');
  }
};

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