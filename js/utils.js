function rectangleCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#displayText").style.display = "flex";
  if (player.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 1 Wins";
  } else if (enemy.health > player.health) {
    document.querySelector("#displayText").innerHTML = "Player 2 Wins";
  } else {
    document.querySelector("#displayText").innerHTML = "Tie";
  }
}

let timer = 5;
let timerId;
function decreaseTimer() {
  document.querySelector("#timer").innerHTML = timer;
  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  } else {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
  }
}
