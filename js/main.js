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
  constructor() {
    super();
  }

  stage() {
    this.layer1.width = Config.stageWidth;
    this.layer1.height = Config.stageHeight;
    this.layer2.width = Config.stageWidth;
    this.layer2.height = Config.stageHeight;

    this.layer1ctx.fillRect(0, 0, Config.stageWidth, Config.stageHeight);
    this.image(this.layer1ctx, Config.charaSrc);
  }

  image(layer, src, x = 0, y = 0) {
    let img = new Image();
    img.src = src;
    img.onload = () => {
      layer.drawImage(img, x, y);
    }
  }

  puyo(color, stageX, stageY) {
    let x = Config.stageBaseX + stageX * (Config.puyoImgWidth + Config.puyoImgPadding);
    let y = Config.stageBaseY + stageY * (Config.puyoImgHeight + Config.puyoImgPadding);

    switch (color) {      
      case 0:
        this.image(this.layer2ctx, Config.puyoBlueSrc, x, y);
        break;
      case 1:
        this.image(this.layer2ctx, Config.puyoGreenSrc, x, y);
        break;
      case 2:
        this.image(this.layer2ctx, Config.puyoRedSrc, x, y);
        break;
      case 3:
        this.image(this.layer2ctx, Config.puyoYellowSrc, x, y);
    }    
  }

  erasePuyo(stageX, stageY) {
    let x = Config.stageBaseX + stageX * (Config.puyoImgWidth + Config.puyoImgPadding);
    let y = Config.stageBaseY + stageY * (Config.puyoImgHeight + Config.puyoImgPadding);

    this.layer2ctx.clearRect(x, y, Config.puyoImgWidth, Config.puyoImgHeight);
  }
}

/*==================
	Init
====================*/
class Init {
  constructor() {
    // ステージを描画
    let draw = new Draw();
    draw.stage();
    
    // ぷよぷよを描画
    draw.puyo(0, 2, 0);
    draw.puyo(3, 2, 1);
  }
}

/*==================
	Operation
====================*/
window.onkeydown = (e) => {
  switch (e.keyCode) {
    case 40: // 下移動

    case 37: // 左移動

    case 39: // 右移動
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