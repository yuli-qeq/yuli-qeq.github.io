let main = document.getElementById("svg_main");
let score = document.getElementById("score");
let birds = document.getElementsByClassName("bird")
let tubes = document.getElementsByClassName("tube")
let oldtime, newtime, deltatime;
let pause = false;
let game_over = false;
let del_tubes_count = 0;
let tube_width = 100;
let tube_horizontal_space = 300;
let tube_vertical_space = 250;
let tubes_speed = 2;

let g = 9.8;
let meter = 70;
let bird_v0 = [0, 0];
let bird_jump_power = 6;

let birds_v = [];

function clear_field(){
    // main.innerHTML = '<circle class="bird" cx="100" cy="100" r="25"></circle>';
    main.innerHTML = '<image class="bird" r="25" xlink:href="img/bird.svg" transform="rotate(0) translate(50,300)" style="transform-origin: 325px 325px;" width="50" height="50"/>'; 
}

function getRotate(index){
    let transform = birds[index].getAttribute("transform");
    let rotate = transform.slice(transform.indexOf("rotate")).split(")")[0].split("(")[1];
    return parseFloat(rotate);
}

function setRotate(index, value){
    let transform = birds[index].getAttribute("transform");
    let begin = transform.indexOf("rotate");
    let end = transform.slice(begin).indexOf(")") + 1 + begin;
    let new_transform = transform.slice(0, begin) + "rotate(" + value + ")" + transform.slice(end);
    birds[index].setAttribute("transform", new_transform);
}

function getTranslate(index){
    let r = parseFloat(birds[index].getAttribute("r"));
    let transform = birds[index].getAttribute("transform");
    let translate = transform.slice(transform.indexOf("translate")).split(")")[0].split("(")[1].split(",");
    return [parseFloat(translate[0]) + r, parseFloat(translate[1]) + r];
}

function setTranslate(index, value){
    let r = parseFloat(birds[index].getAttribute("r"));
    let transform = birds[index].getAttribute("transform");
    let x = value[0], y = value[1];
    let begin = transform.indexOf("translate");
    let end = transform.slice(begin).indexOf(")") + 1 + begin;
    let new_transform = transform.slice(0, begin) + "translate(" + (x - r) + "," + (y - r) + ")" + transform.slice(end);
    birds[index].setAttribute("transform", new_transform);
    let style = birds[index].getAttribute("style");
    begin = style.indexOf("transform-origin:");
    end = style.slice(begin).indexOf(";") + 1 + begin;
    let new_style = style.slice(0, begin) + "transform-origin: " + (x) + "px " + (y) + "px;" + style.slice(end);
    birds[index].setAttribute("style", new_style);
}

function kill_bird(index){
    birds[index].setAttribute("class", "bird_death");
    birds_v = birds_v.slice(0, index).concat(birds_v.slice(index + 1));
    if (birds.length == 0) game_over = true;
}

function start(){
    del_tubes_count = 0;
    game_over = false;
    pause = true;
    birds_v = [];
    clear_field();
    for (let i=0; i<birds.length; i++){
        birds_v.push([bird_v0[0], bird_v0[1]]);
    }
    show_score();
    oldtime = Date.now();
    rAF = requestAnimationFrame(loop);
}

function create_tube(){
    let h = Math.round(Math.random() * (main.clientHeight - tube_vertical_space));
    let tube;
    tube = document.createElement("rect");
    tube.setAttribute("x", main.clientWidth);
    tube.setAttribute("y", 0);
    tube.setAttribute("width", tube_width);
    tube.setAttribute("height", h);
    tube.setAttribute("class", "tube");
    main.append(tube);
    tube = document.createElement("rect");
    tube.setAttribute("x", main.clientWidth);
    tube.setAttribute("y", h + tube_vertical_space);
    tube.setAttribute("width", tube_width);
    tube.setAttribute("height", main.clientHeight - h - tube_vertical_space);
    tube.setAttribute("class", "tube");
    main.append(tube);
    main.innerHTML += "";
}

function check_collision(bird_index, tube_index){
    let r = parseFloat(birds[bird_index].getAttribute("r"));
    let tr = getTranslate(bird_index);
    let cx = tr[0];
    let cy = tr[1];
    let x0 = parseFloat(tubes[tube_index].getAttribute("x"));
    let y0 = parseFloat(tubes[tube_index].getAttribute("y"));
    let x1 = parseFloat(tubes[tube_index].getAttribute("width")) + x0;
    let y1 = parseFloat(tubes[tube_index].getAttribute("height")) + y0;
    if (x0 <= cx && cx <= x1){
        if (y0 <= cy + r && cy - r <= y1){
            return true;
        }
    }
    if (y0 <= cy && cy <= y1){
        if (x0 <= cx + r && cx - r <= x1){
            return true;
        }
    }
    let points = [[x0, y0], [x0, y1], [x1, y0], [x1, y1]];
    let r2 = r * r;
    for (let i=0; i<points.length; i++){
        if (Math.pow(points[i][0]-cx, 2) + Math.pow(points[i][1]-cy, 2) < r2){
            return true;
        }
    }
    return false;
}

function show_score(){
    score.innerText = "score: " + Math.ceil(del_tubes_count / 2);
}

function loop(){
    newtime = Date.now();
    deltatime = newtime - oldtime;
    deltatime /= 1000;

    if (!pause && !game_over){
        for (let i=0; i<birds.length; i++){
            let r = parseFloat(birds[i].getAttribute("r"));
            let tr = getTranslate(i);
            let cx = tr[0];
            let cy = tr[1];
            let old_v = birds_v[i][1];
            birds_v[i][1] += g * deltatime;
            let ncy = cy + birds_v[i][1] * deltatime * meter;
            if (ncy - r < 0) {
                ncy = r;
                birds_v[i][1] = 0;
            }
            if (ncy + r > main.clientHeight){
                ncy = main.clientHeight - r;
                birds_v[i][1] = 0;
                setTranslate(i, [cx, ncy]);
                kill_bird(i);
                i--;
                continue;
            }
            let new_v = birds_v[i][1];
            if (new_v > 0){
                setRotate(i, 30);
            }
            else{
                setRotate(i, -30);
            }
            setTranslate(i, [cx, ncy]);
        }
        for (let i=0; i<tubes.length; i++){
            let x = parseFloat(tubes[i].getAttribute("x"));
            let nx = x - tubes_speed * deltatime * meter;
            tubes[i].setAttribute("x", nx);
            if (nx + tube_width < 0) { 
                main.removeChild(tubes[i]);
                i--;
                del_tubes_count++;
                show_score();
            }
        }
        if (tubes.length == 0 || main.clientWidth - parseInt(tubes[tubes.length - 1].getAttribute("x")) > tube_horizontal_space + tube_width){
            create_tube();
        }
        for (let i=0; i<birds.length; i++){
            let e = false;
            for (let j=0; j<tubes.length && !e; j++){
                if (check_collision(i, j)){
                    kill_bird(i);
                    i--;
                    e = true;
                    continue;
                }
            }
        }
    }
    oldtime = newtime;
    rAF = requestAnimationFrame(loop)
}

function jump(){
    for (let i=0; i<birds.length; i++){
        birds_v[i][1] = -bird_jump_power;
    }
}

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 32) {
        event.preventDefault();
    }    
    if (event.key == "r") {
        start();
        return;
    }
    if (event.key == "t") pause = !pause;
    if (pause) return; 
    switch (event.key) {
        case " ":
            jump();
            break;
        default:
            break;
    }
});

main.addEventListener('pointerdown', function(event) {
    if(game_over)start();
    else if(pause)pause = false;
    jump();
});

start();



/*

V = v0 + g * dt

(0, 10)--(5, 10)
|              |
|              |
|              |
(0, 0)----(5, 0)



*/