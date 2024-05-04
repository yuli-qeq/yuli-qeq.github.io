const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 5;
const rows = Number(canvas.offsetHeight/grid);
const cols = Number(canvas.offsetWidth/grid);
const offset = 0;
canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;

let oldTime = null;
let newTime = null;
let rAF = null;
let update_bool = false;
let playfield = [];
let buffer = [];
canvas.onclick = function(){update_bool=!update_bool; }
let bs_input = document.getElementById("bs_input");
let input_perc = document.getElementById("input_perc");
let b_btns = [];
let b_values = [];
let s_btns = [];
let s_values = [];

function bs_input_create(){
    let cnt_n = 8 + 1;
    let s = "";
    let sb = "btn_ruleB";
    let ss = "btn_ruleS";
    s += "B ";
    for (let i=0; i<cnt_n; i++){
        s += '<button type="button" id="'+ sb + i + '">' + i + '</button>';
    }
    s += "<br/>S ";
    for (let i=0; i<cnt_n; i++){
        s += '<button type="button" id="'+ ss + i + '">' + i + '</button>';
    }
    bs_input.innerHTML = s;
    b_btns = [];
    b_values = [];
    s_btns = [];
    s_values = [];
    for (let i=0; i<cnt_n; i++){
        b_btns.push(document.getElementById(sb + i));
        b_btns[i].className = "rule_disable";
        b_values.push(false);
        b_btns[i].addEventListener("click", function(event){
            let index = b_btns.indexOf(this);
            b_values[index] = !b_values[index];
            if (b_values[index]) this.className = "rule_enable";
            else this.className = "rule_disable";
        });
    }
    for (let i=0; i<cnt_n; i++){
        s_btns.push(document.getElementById(ss + i));
        s_btns[i].className = "rule_disable";
        s_values.push(false);
        s_btns[i].addEventListener("click", function(event){
            let index = s_btns.indexOf(this);
            s_values[index] = !s_values[index];
            if (s_values[index]) this.className = "rule_enable";
            else this.className = "rule_disable";
        });
    }
    b_btns[3].click();
    s_btns[2].click();
    s_btns[3].click();
}

const colors = {
    0: 'black',
    1: 'white'
};

document.getElementById('form1').addEventListener('submit', function(event) {
    event.preventDefault();
    restartGame();
});

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
    for (let row = 1; row < rows - 1; row++) {
        for (let col = 1; col < cols - 1; col++) {
        let r = Math.random();
        if (r < ver) r = 1;
        else r = 0;
        playfield[row][col] = r;
        }
    }
}

function restartGame() {
    clearField();
    randField(Number(input_perc.value));
    drawField();
    rAF = requestAnimationFrame(loop);
    update_bool = false;
}

//Очистка поля
function clear(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
}

function drawField() {
    clear();
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
        if (playfield[row][col] == 0 && b_values[cnt]) {
            buffer[row][col] = 1;
        }
        else if (playfield[row][col] === 1 && !s_values[cnt]) {
            buffer[row][col] = 0;
        }
        }
    }
}

function update() {
    Life3b23s();
    let tmp = playfield;
    playfield = buffer;
    buffer = tmp;
    tmp = null;
}

function loop() {
    newTime = Date.now();
    if (newTime - oldTime > 10 && update_bool) {
        update();
        drawField();
        oldTime = newTime;
        console.log("step");
    }
    rAF = requestAnimationFrame(loop);
}

bs_input_create();
