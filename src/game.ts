import Phaser from "phaser";
import sky from "src/assets/sprites/bg.jpg";
import pig0 from "src/assets/sprites/pig-0.png";
import pig1 from "src/assets/sprites/pig-1.png";
import pig2 from "src/assets/sprites/pig-2.png";
import pig3 from "src/assets/sprites/pig-3.png";
import squeak from "src/assets/sfx/pig-squeak.mp3";

class Pig extends Phaser.Physics.Arcade.Sprite {
  particles: Phaser.GameObjects.Particles.ParticleEmitter;
  speed = 500;
  size = 6;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "pig" + Phaser.Math.Between(0, 3));

    this.particles = scene.add.particles(0, 0, "red", {
      speed: 200,
      scale: { start: 0.4, end: 0 },
      blendMode: "ADD",
      quantity: 40,
    });
    this.particles.startFollow(this);
    this.particles.stop();

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(this.size)
      .setInteractive()
      .setCollideWorldBounds(true)
      .setBounce(0.2, 0.5)
      .setDrag(400);

    this.on("pointerdown", this.pointerdown, this);
  }

  update() {
    if (this.body!.velocity.x < 0) {
      this.setFlipX(true);
    } else {
      this.setFlipX(false);
    }

    if (Math.random() < 0.005) {
      this.setVelocityX(Phaser.Math.Between(-this.speed, this.speed));
    }
    if (Math.random() < 0.005) {
      this.setVelocityY(Phaser.Math.Between(-this.speed, this.speed));
    }
  }

  pointerdown() {
    this.scene.sound.play("squeak");

    this.setVelocity(
      Phaser.Math.Between(-this.speed, this.speed),
      Phaser.Math.Between(-this.speed, this.speed)
    );
    this.particles.explode();

    this.scene.tweens.add({
      targets: this,
      duration: 50,
      scale: this.scale * 1.3,
      yoyo: true,
      ease: 'Power1',
    });
  }
}

class Example extends Phaser.Scene {
  pigs: Pig[] = [];
  // Number of pigs per pixel
  pigDensity = 0.00003;
  clickCount = 0;
  clickText!: Phaser.GameObjects.Text;
  constructor() {
    super();
  }

  preload() {
    this.load.image("sky", sky);
    this.load.image("pig0", pig0);
    this.load.image("pig1", pig1);
    this.load.image("pig2", pig2);
    this.load.image("pig3", pig3);
    this.load.image("red", "https://labs.phaser.io/assets/particles/red.png");

    this.load.audio("squeak", squeak);
  }

  create() {
    this.add
      .tileSprite(0, 0, this.scale.width, this.scale.height, "sky")
      .setOrigin(0)
      .setTileScale(0.3, 0.3);

    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

    this.updatePigs();

    this.clickText = this.add.text(10, 10, `Clicks: ${this.clickCount}`, {
      fontSize: "30px",
      color: "#000",
      fontStyle: "bold"
    });

    window.addEventListener("resize", () => {
      // this.scale.resize(window.innerWidth, window.innerHeight);
      this.physics.world.setBounds(0, 0, window.innerWidth, window.innerHeight);
      this.updatePigs();
    });
  }

  updatePigs() {
    const screenArea = window.innerWidth * window.innerHeight;
    const targetNumberOfPigs = Math.floor(screenArea * this.pigDensity);

    while (this.pigs.length > targetNumberOfPigs) {
      const pig = this.pigs.pop();
      pig?.destroy();
    }

    while (this.pigs.length < targetNumberOfPigs) {
      const pig = new Pig(
        this,
        Phaser.Math.Between(0, window.innerWidth),
        Phaser.Math.Between(0, window.innerHeight)
      );
      pig.on('pointerdown', () => {
        this.clickCount++;
        this.updateClickCountText();
      });

      this.pigs.push(pig);
    }
  }

  updateClickCountText() {
    this.clickText.setText(`Clicks: ${this.clickCount}`);
  }

  update() {
    // this.children.list.forEach((child) => {
    //   if ("update" in child) {
    //     child.update();
    //   }
    // });
    this.pigs.forEach((pig) => pig.update());
  }
}

export function start(elem: HTMLElement) {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: "100%",
    height: "100%",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0, x: 0 },
      },
    },
    parent: elem,
    scene: Example,
  };

  const game = new Phaser.Game(config);

  return game;
}
