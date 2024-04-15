const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 5;
const rows = Number(canvas.offsetHeight/grid);
const cols = Number(canvas.offsetWidth/grid);
const offset = 0;
canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;

// следим за кадрами анимации, чтобы если что — остановить игру
let rAF = null;
let gameOver = false;
let count = 0;

//поле для игры
var playfield = [];
var buffer = [];

const colors = {
  0: 'black',
  1: 'white'
};

function clearField() {
  for (let row = 0; row < rows; row++) {
    playfield[row] = [];
    for (let col = 0; col < cols; col++) {
      playfield[row][col] = 0;
    }
  }
  for (let row = 0; row < rows; row++) {
    buffer[row] = [];
    for (let col = 0; col < cols; col++) {
      buffer[row][col] = 0;
    }
  }
}

function randField(ver) {
  clearField();
  for (let row = 1; row < rows - 1; row++) {
    for (let col = 1; col < cols - 1; col++) {
      let r = Math.random();
      if (r < ver) r = 1;
      else r = 0;
      playfield[row][col] = r;
    }
  }
}

function createconf1() {
  clearField();
  for (let row = 1; row < rows - 1; row++) {
    for (let col = 1; col < cols - 1; col++) {
      if (row % 3 != 0 && col % 3 != 0) {
        playfield[row][col] = 1;
      }
    }
  }
  playfield[rows / 2 - rows / 2 % 3][cols / 2 - cols / 2 % 3 + 1] = 1;
}

function createconf2() {
  clearField();
  let offset = 1;
  for (let col = offset; col < cols - offset; col++) {
    playfield[Math.floor(rows / 2)][col] = 1;
  }
}

function restartGame() {
  gameOver = false;
  count = 0;
  randField(0.1);
  //createconf2();
  //clearField();
  rAF = requestAnimationFrame(loop);
}

function drawField() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      context.fillStyle = colors[playfield[row][col]];
      context.fillRect(col * grid, row * grid, grid - offset, grid - offset);
    }
  }
}

function Life3b23s() {
  let cnt;
  for (let row = 1; row < rows - 1; row++) {
    for (let col = 1; col < cols - 1; col++) {
      cnt = 0;
      for (let i = row - 1; i < row + 2; i++) {
        for (let j = col - 1; j < col + 2; j++) {
          if (i != row || j != col) {
            if (playfield[i][j] == 1) cnt++;
          }
        }
      }
      buffer[row][col] = playfield[row][col];
      if (playfield[row][col] == 0 && cnt == 3) {
        buffer[row][col] = 1;
      }
      else if (playfield[row][col] === 1 && (cnt != 3 && cnt != 2)) {
        buffer[row][col] = 0;
      }
    }
  }
}

function rule90(conf = false) { //нужно высчитывать только одну строку!!! буфер вообще не нужен
  if (conf) {
    playfield[0][cols / 2] = 1;
  }
  for (let col = 1; col < cols - 1; col++) {
    buffer[0][col] = playfield[0][col];
  }
  for (let row = 1; row < rows - 1; row++) {
    for (let col = 1; col < cols - 1; col++) {
      buffer[row][col] = (playfield[row - 1][col - 1] + playfield[row - 1][col + 1]) % 2;
    }
  }
}

function update() {
  Life3b23s();
  //rule90(true);
  tmp = playfield;
  playfield = buffer;
  buffer = tmp;
}

function loop() {
  rAF = requestAnimationFrame(loop);
  drawField();
  if (count > 0) {
    update();
    count = 0;
  }
  count++;
}

restartGame();