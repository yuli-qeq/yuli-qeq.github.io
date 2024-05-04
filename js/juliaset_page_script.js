const canvas = document.getElementById('set');
const context = canvas.getContext('2d');
canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;
let scale = 1.2;
let sx = canvas.width/2;
let sy = canvas.height/2;
let smin = Math.min(sx, sy);

let oldTime = null;
let newTime = null;
let rAF = null;
let update_bool = false;
canvas.onclick = function(){update_bool=!update_bool; }
let real = "real";
let imag = "imag";
//−0.8 + 0.156i
let c = {
    real: -0.8,
    imag: 0.156
};
let input_iter = document.getElementById("input_iter");
let curr_iter = 0;
let set_array = null;
let set_iter_array = null;

function canvas_pix_get_xy(pix_x, pix_y){
    let x = (pix_x - sx)/smin * scale;
    let y = (pix_y - sy)/smin * -scale;
    return [x, y];
}

function complex_sub(a, b){
    return {
        real: a[real] - b[real], 
        imag: a[imag] - b[imag]
    };
}

function complex_add(a, b){
    return {
        real: a[real] + b[real], 
        imag: a[imag] + b[imag]
    };
}

function complex_mult(a, b){
    return {
        real: a[real]*b[real] - a[imag]*b[imag], 
        imag: a[real]*b[imag] + a[imag]*b[real]
    };
}

function complex_abs(a){
    return Math.sqrt(Math.pow(a[real], 2) + Math.pow(a[imag], 2));
}

document.getElementById('form1').addEventListener('submit', function(event) {
    event.preventDefault();
    curr_iter = 0;
    set_array = [];
    set_iter_array = [];
    for (let i=0; i<canvas.width; i++){
        set_array[i] = [];
        set_iter_array[i] = [];
        for (let j=0; j<canvas.height; j++){
            let v = canvas_pix_get_xy(i, j);
            set_array[i][j] = {
                real: v[0],
                imag: v[1]
            };
            set_iter_array[i][j] = 0;
        }
    }
});

function draw_pix(x, y, color){
    context.fillStyle = "red";
    try {
        context.fillStyle = color;
    }
    catch (e) {
        console.log(e);
    }
    context.fillRect(x, y, 1, 1);
    
}

function update() {
    if (curr_iter < input_iter.value){
        curr_iter++;
        console.log(curr_iter);
        for (let i=0; i<set_array.length; i++){
            for (let j=0; j<set_array[i].length; j++){
                //let abs_old_bool = complex_abs(set_array[i][j]) < 2;
                let v_old = parseInt(set_iter_array[i][j]/(curr_iter-1)*255);
                set_array[i][j] = complex_add(complex_mult(set_array[i][j], set_array[i][j]), c);
                if (complex_abs(set_array[i][j]) <= 2) set_iter_array[i][j] = curr_iter;
                let v = parseInt(set_iter_array[i][j]/curr_iter*255);
                if (v_old != v) draw_pix(i, j, HEXfromArrayRGBA([v, v, v, 255]));
                // if (abs_new_bool && !abs_old_bool) draw_pix(i, j, "white");
                // else if (abs_old_bool && !abs_new_bool) draw_pix(i, j, "black");
            }
        }
    }
}

function loop() {
    newTime = Date.now();
    if (newTime - oldTime > 10 && update_bool) {
        update();
        oldTime = newTime;
    }
    rAF = requestAnimationFrame(loop);
}

function clear(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
}

clear();
rAF = requestAnimationFrame(loop);

function HEXfromArrayRGBA(color){
    // color = [255, 128, 128, 255];
    if (color[3]!=undefined) return "#" + color[0].toString(16).padStart(2, '0') + color[1].toString(16).padStart(2, '0') + color[2].toString(16).padStart(2, '0') + color[3].toString(16).padStart(2, '0');
    return "#" + color[0].toString(16).padStart(2, '0') + color[1].toString(16).padStart(2, '0') + color[2].toString(16).padStart(2, '0');
}