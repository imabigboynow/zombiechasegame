const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.querySelector("progress");

let backgroundSound = new Audio(
  "https://raw.githubusercontent.com/imabigboynow/zombiechasegame/master/Arcade%20Game%20Menu%20Music%20Loop%20Sound%20Effect%20(8-Bit%20Style).mp3"
);

function startGame() {
  if (progressBar.value === 0) {
    progressBar.value = 100;
    Object.assign(player, { x: canvas.width / 2, y: canvas.height / 2 });
    requestAnimationFrame(drawScene);
  }
  backgroundSound.play();
}

function distanceBetween(sprite1, sprite2) {
  return Math.hypot(sprite1.x - sprite2.x, sprite1.y - sprite2.y);
}

function haveCollided(sprite1, sprite2) {
  return distanceBetween(sprite1, sprite2) < sprite1.radius + sprite2.radius;
}

class Sprite {
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

class Player extends Sprite {
  constructor(x, y, radius, color, speed) {
    super();
    this.image = new Image();
    this.image.src =
      "https://vignette.wikia.nocookie.net/callofduty/images/f/f4/Soldier_sprite_DOA_BO.png/revision/latest?cb=20121107192309";
    Object.assign(this, { x, y, radius, color, speed });
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, 50, 50);
  }
}

let player = new Player(250, 150, 10, "black", 0.07);

class Enemy extends Sprite {
  constructor(x, y, radius, color, speed) {
    super();
    Object.assign(this, { x, y, radius, color, speed });
  }
}

let enemies = [
  new Enemy(80, 200, 20, "rgba(128, 128, 128, 1)", 0.07),
  new Enemy(200, 250, 17, "rgba(128, 128, 128, 1)", 0.03),
  new Enemy(150, 180, 22, "rgba(128, 128, 128, 1)", 0.007)
];

let mouse = { x: 0, y: 0 };
document.body.addEventListener("mousemove", updateMouse);
function updateMouse(event) {
  const { left, top } = canvas.getBoundingClientRect();
  mouse.x = event.clientX - left;
  mouse.y = event.clientY - top;
}

function moveToward(leader, follower, speed) {
  follower.x += (leader.x - follower.x) * speed;
  follower.y += (leader.y - follower.y) * speed;
}

function pushOff(c1, c2) {
  let [dx, dy] = [c2.x - c1.x, c2.y - c1.y];
  const L = Math.hypot(dx, dy);
  let distToMove = c1.radius + c2.radius - L;
  if (distToMove > 0) {
    dx /= L;
    dy /= L;
    c1.x -= dx * distToMove / 2;
    c1.y -= dy * distToMove / 2;
    c2.x += dx * distToMove / 2;
    c2.y += dy * distToMove / 2;
  }
}

function updateScene() {
  moveToward(mouse, player, player.speed);
  enemies.forEach(enemy => moveToward(player, enemy, enemy.speed));
  enemies.forEach((enemy, i) =>
                  pushOff(enemy, enemies[(i + 1) % enemies.length])
                 );
  enemies.forEach(enemy => {
    if (haveCollided(enemy, player)) {
      progressBar.value -= 2;
    }
  });
}

function clearBackground() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawScene() {
  clearBackground();
  player.draw();
  enemies.forEach(enemy => enemy.draw());
  updateScene();
  if (progressBar.value <= 0) {
    ctx.font = "25px Comic Sans MS";
    ctx.fillText("Game Over Click to Retry", 250, canvas.height / 2);
  } else {
    requestAnimationFrame(drawScene);
  }
}

canvas.addEventListener("click", startGame);
requestAnimationFrame(drawScene);
