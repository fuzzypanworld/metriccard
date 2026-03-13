const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const coinsEl = document.getElementById("coins");
const statusEl = document.getElementById("status");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const jumpBtn = document.getElementById("jumpBtn");

const VIEW_WIDTH = 960;
const VIEW_HEIGHT = 540;
const WORLD_WIDTH = 4700;
const WORLD_FLOOR = 470;

const PHYSICS = {
  gravity: 2100,
  moveSpeed: 340,
  groundAccel: 2400,
  airAccel: 1300,
  groundDecel: 2600,
  airDecel: 450,
  jumpVelocity: 760,
  maxFall: 1200,
  coyoteTime: 0.11,
  jumpBuffer: 0.12
};

const input = {
  left: false,
  right: false,
  jumpHeld: false,
  jumpPressed: false
};

const camera = {
  x: 0,
  y: 0
};

let gameState = "playing";
let lastTime = performance.now();

const player = {
  x: 80,
  y: 260,
  w: 34,
  h: 44,
  vx: 0,
  vy: 0,
  onGround: false,
  onPlatform: null,
  coyoteCounter: 0,
  jumpBufferCounter: 0,
  invulnerable: 0,
  spawnX: 80,
  spawnY: 260,
  facing: 1,
  lives: 3,
  coins: 0
};

const level = createLevel();
const totalCoins = level.coins.length;
coinsEl.textContent = `0/${totalCoins}`;

function createLevel() {
  const platforms = [
    rect(0, WORLD_FLOOR + 30, WORLD_WIDTH, 120, "ground"),
    rect(100, 392, 260, 24),
    rect(430, 338, 170, 24),
    rect(660, 294, 130, 20),
    rect(850, 356, 210, 24),
    movingRect(1120, 320, 150, 22, "x", 110, 1.2),
    rect(1370, 270, 170, 22),
    rect(1600, 225, 120, 20),
    movingRect(1770, 280, 150, 22, "y", 70, 1.55),
    rect(2020, 332, 140, 20),
    rect(2220, 286, 150, 20),
    rect(2450, 250, 120, 20),
    rect(2670, 320, 180, 22),
    movingRect(2920, 360, 140, 20, "x", 150, 1.35),
    rect(3210, 308, 160, 20),
    rect(3430, 250, 170, 20),
    movingRect(3680, 206, 140, 20, "y", 78, 1.4),
    rect(3920, 258, 130, 20),
    rect(4120, 210, 160, 20),
    rect(4400, 170, 150, 20)
  ];

  const spikes = [
    rect(520, WORLD_FLOOR + 4, 72, 24),
    rect(970, WORLD_FLOOR + 4, 120, 24),
    rect(1530, WORLD_FLOOR + 4, 94, 24),
    rect(2565, WORLD_FLOOR + 4, 88, 24),
    rect(3360, WORLD_FLOOR + 4, 120, 24),
    rect(4050, WORLD_FLOOR + 4, 100, 24)
  ];

  const coins = [
    coin(485, 292),
    coin(710, 252),
    coin(950, 315),
    coin(1180, 280),
    coin(1460, 232),
    coin(1660, 185),
    coin(1828, 240),
    coin(2060, 294),
    coin(2270, 246),
    coin(2490, 212),
    coin(2725, 280),
    coin(2965, 321),
    coin(3275, 268),
    coin(3482, 210),
    coin(3725, 166),
    coin(3972, 218),
    coin(4195, 170),
    coin(4470, 132)
  ];

  const goal = rect(4535, 102, 22, 68, "goal");

  return {
    platforms,
    spikes,
    coins,
    goal,
    time: 0
  };
}

function rect(x, y, w, h, type = "solid") {
  return { x, y, w, h, type, moving: false, dx: 0, dy: 0 };
}

function movingRect(x, y, w, h, axis, range, speed) {
  return {
    x,
    y,
    w,
    h,
    type: "moving",
    moving: true,
    axis,
    range,
    speed,
    phase: 0,
    baseX: x,
    baseY: y,
    dx: 0,
    dy: 0
  };
}

function coin(x, y) {
  return { x, y, r: 10, collected: false };
}

function resetGame() {
  const next = createLevel();
  level.platforms = next.platforms;
  level.spikes = next.spikes;
  level.coins = next.coins;
  level.goal = next.goal;
  level.time = 0;

  player.x = player.spawnX;
  player.y = player.spawnY;
  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  player.onPlatform = null;
  player.coyoteCounter = 0;
  player.jumpBufferCounter = 0;
  player.invulnerable = 0;
  player.facing = 1;
  player.lives = 3;
  player.coins = 0;

  camera.x = 0;
  camera.y = 0;
  gameState = "playing";
  statusEl.textContent = "Reach the flag. Avoid spikes.";
  coinsEl.textContent = `0/${totalCoins}`;
}

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  canvas.width = Math.floor(displayWidth * dpr);
  canvas.height = Math.floor(displayHeight * dpr);
  ctx.setTransform(
    (displayWidth / VIEW_WIDTH) * dpr,
    0,
    0,
    (displayHeight / VIEW_HEIGHT) * dpr,
    0,
    0
  );
}

function approach(value, target, delta) {
  if (value < target) {
    return Math.min(value + delta, target);
  }
  return Math.max(value - delta, target);
}

function aabbOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function setHorizontalInput(leftActive, rightActive) {
  input.left = leftActive;
  input.right = rightActive;
}

function setJumpInput(isHeld) {
  if (isHeld && !input.jumpHeld) {
    input.jumpPressed = true;
  }
  input.jumpHeld = isHeld;
}

function bindTouchButton(button, handlers) {
  const start = (event) => {
    event.preventDefault();
    handlers.onStart();
  };

  const end = (event) => {
    event.preventDefault();
    handlers.onEnd();
  };

  button.addEventListener("pointerdown", start);
  button.addEventListener("pointerup", end);
  button.addEventListener("pointercancel", end);
  button.addEventListener("pointerleave", end);
}

bindTouchButton(leftBtn, {
  onStart: () => setHorizontalInput(true, input.right),
  onEnd: () => setHorizontalInput(false, input.right)
});

bindTouchButton(rightBtn, {
  onStart: () => setHorizontalInput(input.left, true),
  onEnd: () => setHorizontalInput(input.left, false)
});

bindTouchButton(jumpBtn, {
  onStart: () => setJumpInput(true),
  onEnd: () => setJumpInput(false)
});

window.addEventListener("keydown", (event) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(event.key)) {
    event.preventDefault();
  }

  if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") {
    input.left = true;
  }

  if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") {
    input.right = true;
  }

  if (
    event.key === "w" ||
    event.key === "W" ||
    event.key === "ArrowUp" ||
    event.key === " "
  ) {
    if (!input.jumpHeld) {
      input.jumpPressed = true;
    }
    input.jumpHeld = true;
  }

  if (event.key === "r" || event.key === "R") {
    resetGame();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") {
    input.left = false;
  }

  if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") {
    input.right = false;
  }

  if (
    event.key === "w" ||
    event.key === "W" ||
    event.key === "ArrowUp" ||
    event.key === " "
  ) {
    input.jumpHeld = false;
  }
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function updateMovingPlatforms(dt) {
  for (const platform of level.platforms) {
    platform.dx = 0;
    platform.dy = 0;

    if (!platform.moving) {
      continue;
    }

    const prevX = platform.x;
    const prevY = platform.y;

    platform.phase += dt * platform.speed;
    const offset = Math.sin(platform.phase) * platform.range;

    if (platform.axis === "x") {
      platform.x = platform.baseX + offset;
    } else {
      platform.y = platform.baseY + offset;
    }

    platform.dx = platform.x - prevX;
    platform.dy = platform.y - prevY;
  }
}

function updatePlayer(dt) {
  if (player.onGround) {
    player.coyoteCounter = PHYSICS.coyoteTime;
  } else {
    player.coyoteCounter = Math.max(0, player.coyoteCounter - dt);
  }

  if (input.jumpPressed) {
    player.jumpBufferCounter = PHYSICS.jumpBuffer;
    input.jumpPressed = false;
  } else {
    player.jumpBufferCounter = Math.max(0, player.jumpBufferCounter - dt);
  }

  const direction = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  if (direction !== 0) {
    const accel = player.onGround ? PHYSICS.groundAccel : PHYSICS.airAccel;
    player.vx = approach(player.vx, direction * PHYSICS.moveSpeed, accel * dt);
    player.facing = direction;
  } else {
    const decel = player.onGround ? PHYSICS.groundDecel : PHYSICS.airDecel;
    player.vx = approach(player.vx, 0, decel * dt);
  }

  if (player.jumpBufferCounter > 0 && (player.onGround || player.coyoteCounter > 0)) {
    player.vy = -PHYSICS.jumpVelocity;
    player.onGround = false;
    player.onPlatform = null;
    player.jumpBufferCounter = 0;
    player.coyoteCounter = 0;
  }

  player.vy = Math.min(player.vy + PHYSICS.gravity * dt, PHYSICS.maxFall);

  if (player.onGround && player.onPlatform && player.onPlatform.moving) {
    player.x += player.onPlatform.dx;
    player.y += player.onPlatform.dy;
  }

  player.x += player.vx * dt;
  for (const platform of level.platforms) {
    if (!aabbOverlap(player, platform)) {
      continue;
    }

    if (player.vx > 0) {
      player.x = platform.x - player.w;
      player.vx = 0;
    } else if (player.vx < 0) {
      player.x = platform.x + platform.w;
      player.vx = 0;
    }
  }

  const prevBottom = player.y + player.h;
  player.y += player.vy * dt;
  player.onGround = false;
  player.onPlatform = null;

  for (const platform of level.platforms) {
    if (!aabbOverlap(player, platform)) {
      continue;
    }

    if (player.vy >= 0 && prevBottom <= platform.y + 8) {
      player.y = platform.y - player.h;
      player.vy = 0;
      player.onGround = true;
      player.onPlatform = platform;
      continue;
    }

    if (player.vy < 0) {
      player.y = platform.y + platform.h;
      player.vy = 0;
    }
  }

  if (player.x < 0) {
    player.x = 0;
    player.vx = 0;
  }

  if (player.x + player.w > WORLD_WIDTH) {
    player.x = WORLD_WIDTH - player.w;
    player.vx = 0;
  }

  if (player.y > VIEW_HEIGHT + 220) {
    loseLife("You fell.");
  }

  if (player.invulnerable > 0) {
    player.invulnerable = Math.max(0, player.invulnerable - dt);
  }
}

function loseLife(reason) {
  if (player.invulnerable > 0 || gameState !== "playing") {
    return;
  }

  player.lives -= 1;

  if (player.lives <= 0) {
    gameState = "gameover";
    statusEl.textContent = `${reason} Game over.`;
    return;
  }

  statusEl.textContent = `${reason} Respawned.`;
  player.x = player.spawnX;
  player.y = player.spawnY;
  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  player.onPlatform = null;
  player.invulnerable = 1.1;
}

function updateHazardsAndCollectibles() {
  for (const spike of level.spikes) {
    const hitbox = {
      x: spike.x + 4,
      y: spike.y + 3,
      w: spike.w - 8,
      h: spike.h
    };

    if (aabbOverlap(player, hitbox)) {
      loseLife("You hit spikes.");
      break;
    }
  }

  for (const c of level.coins) {
    if (c.collected) {
      continue;
    }

    const centerX = player.x + player.w * 0.5;
    const centerY = player.y + player.h * 0.5;
    const dx = centerX - c.x;
    const dy = centerY - c.y;
    const radius = c.r + 14;

    if (dx * dx + dy * dy <= radius * radius) {
      c.collected = true;
      player.coins += 1;
      coinsEl.textContent = `${player.coins}/${totalCoins}`;
    }
  }

  if (aabbOverlap(player, level.goal) && gameState === "playing") {
    gameState = "won";
    statusEl.textContent = `Level clear with ${player.coins}/${totalCoins} coins. Press Restart for another run.`;
  }
}

function updateCamera() {
  const targetX = Math.min(
    Math.max(player.x + player.w * 0.5 - VIEW_WIDTH * 0.36, 0),
    WORLD_WIDTH - VIEW_WIDTH
  );
  camera.x += (targetX - camera.x) * 0.12;
}

function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  sky.addColorStop(0, "#67e8f9");
  sky.addColorStop(0.55, "#1d4ed8");
  sky.addColorStop(1, "#0f172a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

  drawHillLayer(150, 88, 0.2, "rgba(16, 185, 129, 0.25)");
  drawHillLayer(190, 92, 0.35, "rgba(20, 184, 166, 0.4)");
  drawHillLayer(248, 115, 0.5, "rgba(15, 118, 110, 0.52)");
}

function drawHillLayer(baseY, amplitude, parallax, color) {
  const shift = camera.x * parallax;
  ctx.beginPath();
  ctx.moveTo(0, VIEW_HEIGHT);

  for (let x = 0; x <= VIEW_WIDTH; x += 10) {
    const worldX = x + shift;
    const y = baseY + Math.sin(worldX * 0.0036) * amplitude + Math.cos(worldX * 0.0019) * amplitude * 0.5;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(VIEW_WIDTH, VIEW_HEIGHT);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawLevel() {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  for (const platform of level.platforms) {
    ctx.fillStyle = platform.moving ? "#34d399" : "#fcd34d";
    ctx.fillRect(platform.x, platform.y, platform.w, platform.h);

    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(platform.x, platform.y + platform.h - 5, platform.w, 5);
  }

  for (const spike of level.spikes) {
    const count = Math.max(2, Math.floor(spike.w / 16));
    const width = spike.w / count;

    for (let i = 0; i < count; i += 1) {
      const sx = spike.x + i * width;
      ctx.beginPath();
      ctx.moveTo(sx, spike.y + spike.h);
      ctx.lineTo(sx + width * 0.5, spike.y);
      ctx.lineTo(sx + width, spike.y + spike.h);
      ctx.closePath();
      ctx.fillStyle = "#ef4444";
      ctx.fill();
    }
  }

  for (const c of level.coins) {
    if (c.collected) {
      continue;
    }

    const pulse = 1 + Math.sin(level.time * 6 + c.x * 0.01) * 0.14;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r * pulse, 0, Math.PI * 2);
    ctx.fillStyle = "#facc15";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r * 0.45 * pulse, 0, Math.PI * 2);
    ctx.fillStyle = "#fde68a";
    ctx.fill();
  }

  const flag = level.goal;
  ctx.fillStyle = "#f1f5f9";
  ctx.fillRect(flag.x + flag.w - 4, flag.y - 56, 4, flag.h + 56);

  ctx.fillStyle = "#fb7185";
  ctx.beginPath();
  ctx.moveTo(flag.x + flag.w, flag.y - 56);
  ctx.lineTo(flag.x + flag.w + 32, flag.y - 46);
  ctx.lineTo(flag.x + flag.w, flag.y - 36);
  ctx.closePath();
  ctx.fill();

  drawPlayer();
  ctx.restore();
}

function drawPlayer() {
  const flashing = player.invulnerable > 0 && Math.floor(player.invulnerable * 15) % 2 === 0;
  if (flashing) {
    return;
  }

  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = "#0f172a";
  const eyeX = player.facing > 0 ? player.x + player.w - 11 : player.x + 7;
  ctx.fillRect(eyeX, player.y + 12, 5, 5);

  ctx.fillStyle = "rgba(15, 23, 42, 0.5)";
  ctx.fillRect(player.x, player.y + player.h - 7, player.w, 7);
}

function drawProgressBar() {
  const progress = Math.min((player.x + player.w) / WORLD_WIDTH, 1);
  const barX = 20;
  const barY = 18;
  const barW = VIEW_WIDTH - 40;
  const barH = 10;

  ctx.fillStyle = "rgba(15, 23, 42, 0.5)";
  ctx.fillRect(barX, barY, barW, barH);

  ctx.fillStyle = "#10b981";
  ctx.fillRect(barX, barY, barW * progress, barH);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.strokeRect(barX, barY, barW, barH);
}

function drawStateOverlay() {
  if (gameState === "playing") {
    return;
  }

  ctx.fillStyle = "rgba(2, 6, 23, 0.5)";
  ctx.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

  ctx.textAlign = "center";
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 48px 'Trebuchet MS', sans-serif";

  if (gameState === "won") {
    ctx.fillText("You Win!", VIEW_WIDTH * 0.5, VIEW_HEIGHT * 0.45);
  } else if (gameState === "gameover") {
    ctx.fillText("Game Over", VIEW_WIDTH * 0.5, VIEW_HEIGHT * 0.45);
  }

  ctx.font = "600 22px 'Trebuchet MS', sans-serif";
  ctx.fillText("Press Restart Run or R", VIEW_WIDTH * 0.5, VIEW_HEIGHT * 0.55);
  ctx.textAlign = "start";
}

function render() {
  drawBackground();
  drawLevel();
  drawProgressBar();
  drawStateOverlay();
}

function tick(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.033);
  lastTime = now;

  level.time += dt;

  if (gameState === "playing") {
    updateMovingPlatforms(dt);
    updatePlayer(dt);
    updateHazardsAndCollectibles();
    updateCamera();
  }

  render();
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
