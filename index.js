const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
const backgroundColor = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});
const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  frames: 6,
});

const player = new Fighter({
  position: {
    x: 150,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  scale: 2.5,
  frames: 8,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      frames: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      frames: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      frames: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      frames: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      frames: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/TakeHit.png",
      frames: 4,
    },
  },
  attackBox: {
    offset: { x: 100, y: 50 },
    width: 160,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 824,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./img/kenji/Idle.png",
  scale: 2.5,
  frames: 4,
  offset: {
    x: 215,
    y: 170,
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      frames: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      frames: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      frames: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      frames: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      frames: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/TakeHit.png",
      frames: 3,
    },
  },
  attackBox: {
    offset: { x: -170, y: 50 },
    width: 170,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  backgroundColor.update();
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement

  if (keys.a.pressed && player.lastKey === "a" && player.position.x - 5 >= 0) {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (
    keys.d.pressed &&
    player.lastKey === "d" &&
    player.position.x + player.width + 5 <= canvas.width + 1
  ) {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // enemy movement
  if (
    keys.ArrowLeft.pressed &&
    enemy.lastKey === "ArrowLeft" &&
    enemy.position.x - 5 >= 0
  ) {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (
    keys.ArrowRight.pressed &&
    enemy.lastKey === "ArrowRight" &&
    enemy.position.x + enemy.width + 5 <= canvas.width + 1
  ) {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // detect for collision
  if (
    rectangleCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.currentFrame === 4
  ) {
    enemy.takeHit()
    player.isAttacking = false; // hit only once
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }
  if (player.isAttacking && player.currentFrame === 4) {
    player.isAttacking = false;
  }

  if (
    rectangleCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking &&
    enemy.currentFrame === 2
  ) {
    player.takeHit()
    enemy.isAttacking = false; // hit only once
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }
  if (enemy.isAttacking && enemy.currentFrame === 2) {
    enemy.isAttacking = false;
  }

  // End game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      if (player.position.y + player.height >= canvas.height - 96) {
        player.velocity.y = -20;
      }
      break;
    case "s":
      player.attack();
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      if (enemy.position.y + enemy.height >= canvas.height - 96) {
        enemy.velocity.y = -20;
      }
      break;
    case "ArrowDown":
      enemy.attack();
      break;
    default:
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    default:
      break;
  }
});
