"use strict";
const scoreEl = document.getElementById("score");
const maxScoreEl = document.getElementById("maxScore");
const restartBtn = document.getElementById("restart");
const gameOverEl = document.getElementById("gameOver");
const boardEl = document.getElementById("board");
const canvasEl = document.createElement("canvas");

boardEl.appendChild(canvasEl);
const CTX = canvasEl.getContext("2d");
const wBoard = (canvasEl.width = 400);
const hBoard = (canvasEl.height = 400);
let speed = 150;
let score = 0;
const square = 20;
const squareSize = 20;
const headColor = "#7FFF00";
const bodyColor = "#ff007f";
let food;
let turn = 0;
let snake = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
  { x: 10, y: 13 },
  { x: 10, y: 14 },
];
const directions = {
  up: { name: "up", none: ["up", "down"] },
  down: { name: "down", none: ["down", "up"] },
  left: { name: "left", none: ["left", "right"] },
  right: { name: "right", none: ["right", "left"] },
};
let currentDirection = "up";
/** Function Hit Self */
function hitSelf(params) {
  const snakeBody = [...snake];
  const head = snakeBody.shift();
  return snakeBody.some((tile) => tile.x === head.x && tile.y === head.y);
}
/** Function Eat Food */
function eatFood(params) {
  const head = snake[0];
  if (food.x === head.x && food.y === head.y) {
    return true;
  }
}
/** Function Draw Food */
function drawFood(x, y, color) {
  CTX.fillStyle = color;
  CTX.shadowBlur = 20;
  CTX.shadowColor = color;
  CTX.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
  CTX.shadowBlur = 0;
}
/** Function Create Food */
function createFood(params) {
  food = {
    x: Math.floor(Math.random() * squareSize),
    y: Math.floor(Math.random() * squareSize),
    color: `hsl(${Math.floor(Math.random() * 360)},100%,50%)`,
  };
  // repeat: test if food appears on snake
  while (snake.some((tile) => tile.x === food.x && tile.y === food.y)) {
    food = {
      x: Math.floor(Math.random() * squareSize),
      y: Math.floor(Math.random() * squareSize),
      color: `hsl(${Math.floor(Math.random() * 360)},100%,50%)`,
    };
  }
}
/** Function Set Direction */
function setDirection(e) {
  let key = e.key;
  let newDirection = "";
  switch (key) {
    case "ArrowRight":
      newDirection = "right";
      break;
    case "ArrowLeft":
      newDirection = "left";
      break;
    case "ArrowUp":
      newDirection = "up";
      break;
    case "ArrowDown":
      newDirection = "down";
    default:
      break;
  }
  let direction = directions[newDirection];
  // prevent the opposite direction and the same
  if (direction.none.indexOf(currentDirection) === -1) {
    currentDirection = newDirection;
  }
}
/** Function Draw Square */
function drawSquare(x, y, color) {
  CTX.fillStyle = color;
  CTX.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
}
/** Function Move Snake */
function moveSnake(params) {
  const head = { ...snake[0] };
  switch (currentDirection) {
    case "up":
      head.y -= 1;
      if (head.y < 0) {
        head.y = 19;
      }
      break;
    case "down":
      head.y += 1;
      if (head.y > 19) {
        head.y = 0;
      }
      break;
    case "right":
      head.x += 1;
      if (head.x > 19) {
        head.x = 0;
      }
      break;
    case "left":
      head.x -= 1;
      if (head.x < 0) {
        head.x = 19;
      }
      break;
    default:
      break;
  }

  snake.unshift(head);
  if (hitSelf()) {
    gameOver();
  }
  if (eatFood()) {
    createFood();
    turn = 1;
    score += 1;
    scoreEl.textContent = score;
  } else {
    snake.pop();
  }
}
/** Function Draw Snake */
function drawSnake(params) {
  snake.forEach((tile, i) => {
    let color = i === 0 ? headColor : bodyColor;
    drawSquare(tile.x, tile.y, color);
  });
}
/** Function Draw Board Game */
function drawBoard(params) {
  CTX.fillStyle = "#222738";
  CTX.fillRect(0, 0, wBoard, hBoard);
  CTX.lineWidth = 1.3;
  CTX.strokeStyle = "#232332";
  CTX.shadowBlur = 0;
  for (let i = 0; i <= square; i++) {
    let lineStart = (wBoard / square) * i;
    CTX.beginPath();
    CTX.moveTo(lineStart, 0);
    CTX.lineTo(lineStart, hBoard);
    CTX.stroke();
    CTX.beginPath();
    CTX.moveTo(0, lineStart);
    CTX.lineTo(wBoard, lineStart);
    CTX.stroke();
    CTX.closePath();
  }
}
let game = setInterval(playGame, speed);
/** Function Game Over */
function gameOver(params) {
  clearInterval(game);
  gameOverEl.classList.toggle("hide");
  let maxScore = Number(maxScoreEl.textContent);
  if (score > maxScore) {
    maxScoreEl.textContent = score;
  }
}
/** Function Restart */
function restart(params) {
  score = 0;
  turn = 0;
  scoreEl.textContent = "00";
  gameOverEl.classList.toggle("hide");
  currentDirection = "up";
  snake = [
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
    { x: 10, y: 13 },
    { x: 10, y: 14 },
  ];
  game = setInterval(playGame, speed);
}
/** Function Main */
function playGame(params) {
  drawBoard();
  drawSnake();
  if (turn % 100 == 0) {
    createFood();
  }
  drawFood(food.x, food.y, food.color);
  moveSnake();

  turn += 1;
}

document.addEventListener("keydown", setDirection);
document.addEventListener("click", restart);
