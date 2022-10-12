const gameCanvas = document.querySelector("#gameCanvas");
const c = gameCanvas.getContext("2d");

gameCanvas.width = 1024;
gameCanvas.height = 576;
c.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
const gravity = 0.7;
const background = new Sprite({
  position: { x: 0, y: 0 },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: { x: 600, y: 96 },
  imageSrc: "./img/shop.png",
  scale: 3,
  framesMax: 6,
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
  ArrowDown: {
    pressed: false,
  },
};

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/samuraiMack/idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },

  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/jump.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/attack1.png",
      framesMax: 6,
    },
    fall: {
      imageSrc: "./img/samuraiMack/fall.png",
      framesMax: 2,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/death.png",
      framesMax: 6,
    },
  },
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 215,
    y: 170,
  },
  imageSrc: "./img/kenji/idle.png",
  framesMax: 4,
  attackBox: {
    offset: {
      x: -172,
      y: 50,
    },
    width: 172,
    height: 50,
  },
  scale: 2.5,
  sprites: {
    idle: {
      imageSrc: "./img/kenji/idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/jump.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/attack1.png",
      framesMax: 4,
    },
    fall: {
      imageSrc: "./img/kenji/fall.png",
      framesMax: 2,
    },
    takeHit: {
      imageSrc: "./img/kenji/TakeHit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/death.png",
      framesMax: 7,
    },
  },
});

animate();
window.addEventListener("keydown", (e) => {
  console.log(e.key);
  if (!player.dead) {
    switch (e.key) {
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "w":
        player.velocity.y = -20;
        break;
      case "s":
        keys.s.pressed = true;
        break;
      case " ":
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    switch (e.key) {
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowUp":
        enemy.velocity.y = -20;
        break;
      case "ArrowDown":
        keys.ArrowDown.pressed = true;
        break;
      case "Shift":
        enemy.attack();
        break;
    }
  }
});
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
    case "ArrowDown":
      keys.ArrowDown.pressed = false;
      break;
  }
});

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  background.update();
  shop.update();
  c.fillStyle = "rgba(255, 255, 255, 0.15)";
  c.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  player.update();
  enemy.update();
  player.velocity.x = 0;
  enemy.velocity.x = 0;
  //Player Movement

  if (keys.a.pressed && player.lastKey === "a") {
    player.switchSprite("run");
    player.velocity.x = -3;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.switchSprite("run");
    player.velocity.x = 3;
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //Enemy Movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.switchSprite("run");
    enemy.velocity.x = -3;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.switchSprite("run");
    enemy.velocity.x = 3;
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //Player Attack
  if (
    attackBoxCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    gsap.to("#enemyHealth", {
      duration: 0.5,
      width: `${enemy.health}%`,
    });

    console.log("hit");
  }

  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }
  if (
    attackBoxCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    gsap.to("#playerHealth", {
      duration: 0.5,
      width: `${player.health}%`,
    });
    console.log("enemy attacking");
  }

  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}
