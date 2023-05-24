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
    x: 0,
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
      frames: 8
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      frames: 8
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
    x: -50,
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
      frames: 8
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      frames: 8
    },
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
  player.image = player.sprites.idle.image;
  if (keys.a.pressed && player.lastKey === "a" && player.position.x - 5 >= 0) {
    player.velocity.x = -5;
    player.image = player.sprites.run.image;
  } else if (
    keys.d.pressed &&
    player.lastKey === "d" &&
    player.position.x + player.width + 5 <= canvas.width + 1
  ) {
    player.velocity.x = 5;
    console.log('%cMyProject%cline:130%cplayer.sprites.run', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(118, 77, 57);padding:3px;border-radius:2px', player.sprites.run)
    player.image = player.sprites.run.image;
  }

  // enemy movement
  if (
    keys.ArrowLeft.pressed &&
    enemy.lastKey === "ArrowLeft" &&
    enemy.position.x - 5 >= 0
  ) {
    enemy.velocity.x = -5;
  } else if (
    keys.ArrowRight.pressed &&
    enemy.lastKey === "ArrowRight" &&
    enemy.position.x + enemy.width + 5 <= canvas.width + 1
  ) {
    enemy.velocity.x = 5;
  }

  // detect for collision
  if (
    rectangleCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false; // hit only once
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }
  if (
    rectangleCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false; // hit only once
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
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
