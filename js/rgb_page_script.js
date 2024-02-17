let inputHEXregex = /^#[0-f][0-f][0-f]$|^#[0-f][0-f][0-f][0-f]$|^#[0-f][0-f][0-f][0-f][0-f][0-f]$|^#[0-f][0-f][0-f][0-f][0-f][0-f][0-f][0-f]$/;
let inputHSVregex = /^([0-9]|[1-9][0-9]|[1-2][0-9][0-9]|3[0-5][0-9]|360)[ ]*,[ ]*([0-9]|[1-9][0-9]|100)[ ]*,[ ]*([0-9]|[1-9][0-9]|100)$|^([0-9]|[1-9][0-9]|[1-2][0-9][0-9]|3[0-5][0-9]|360)[ ]*,[ ]*([0-9]|[1-9][0-9]|100)[ ]*,[ ]*([0-9]|[1-9][0-9]|100)[ ]*,[ ]*([0-9]|[1-9][0-9]|100)$/;
let inputText1 = document.getElementById("input_text1");
let inputText2 = document.getElementById("input_text2");
let colorBtn = document.getElementById("button1");

let colorHEX = inputText1.value;
let colorHSV = inputText2.value;

colorBtn.addEventListener("click", function(event){
    navigator.clipboard.writeText(colorHEX);
});

inputText1.addEventListener('input', function(e){
    let isTrue = inputHEXregex.test(this.value);
    if (isTrue){
        this.className="input_text_true";
        colorHEX = this.value;
        let arrayRGBA = HEXtoArrayRGBA(colorHEX);
        colorHSV = ArrayRGBAtoArrayHSV(arrayRGBA);
        if (colorHSV[3]==100) inputText2.value =  `${colorHSV[0]}, ${colorHSV[1]}, ${colorHSV[2]}`;
        else inputText2.value =  `${colorHSV[0]}, ${colorHSV[1]}, ${colorHSV[2]}, ${colorHSV[3]}`;
        drawColor();
    }
    else{
        this.className="input_text_false";
    }
});

inputText2.addEventListener('input', function(e){
    let isTrue = inputHSVregex.test(this.value);
    if (isTrue){
        this.className="input_text_true";
        colorHSV = this.value;
        let arrayHSV = HSVtoArrayHSV(colorHSV);
        let arrayRGBA = ArrayHSVtoArrayRGBA(arrayHSV);
        colorHEX = HEXfromArrayRGBA(arrayRGBA);
        inputText1.value = colorHEX;
        drawColor();
    }
    else{
        this.className="input_text_false";
    }
});

function drawColor(){
    colorBtn.setAttribute("style", `background-color: ${colorHEX};`)
}

function HEXtoArrayRGBA(color){
    // color = "#f03456";
    let r, g, b, a = 255;
    if (color.length - 1 >= 6){
        r = parseInt(color.substr(1, 2), 16);
        g = parseInt(color.substr(3, 2), 16);
        b = parseInt(color.substr(5, 2), 16);
        if (color.length - 1 == 8) a = parseInt(color.substr(7, 2), 16);
    }
    else {
        r = parseInt(color.substr(1, 1), 16)*16;
        g = parseInt(color.substr(2, 1), 16)*16;
        b = parseInt(color.substr(3, 1), 16)*16;
        if (color.length - 1 == 4) a = parseInt(color.substr(4, 1), 16)*16;
    }
    return [r,g,b,a];
}
function HEXfromArrayRGBA(color){
    // color = [255, 128, 128, 255];
    if (color[3]!=undefined) return "#" + color[0].toString(16).padStart(2, '0') + color[1].toString(16).padStart(2, '0') + color[2].toString(16).padStart(2, '0') + color[3].toString(16).padStart(2, '0');
    return "#" + color[0].toString(16).padStart(2, '0') + color[1].toString(16).padStart(2, '0') + color[2].toString(16).padStart(2, '0');
}
function ArrayRGBAtoArrayHSV(color){
    // color = [255, 128, 128, 4];
    let A = color[3];
    color = color.splice(0,3);
    let cMax = Math.max(...color);
    let cMin = Math.min(...color);
    if(A!=undefined)color.push(A);
    let d = cMax - cMin;
    let result = [0, 0, 0, 100]
    if (d!=0){
        if (cMax === color[0]){
            result[0] = 60 * (color[1] - color[2])/d
            if (color[1] < color[2]){
                result[0] += 360;
            }
        }
        else if (cMax === color[1]){
            result[0] = 60 * (color[2] - color[0])/d + 120
        }
        else if (cMax === color[2]){
            result[0] = 60 * (color[0] - color[1])/d + 240
        }
    }
    else{
        result[0] = 0;
    }
    result[0] = Math.round(result[0])
    result[1] = Math.round(cMax==0?0:(1-cMin/cMax)*100);
    result[2] = Math.round(cMax/255*100);
    if (color[3]!=undefined) result[3] = Math.round(color[3]/255*100);
    return result;
}

function HSVtoArrayHSV(color){
    // color = "255, 6, 0";
    let result = color.match(/[0-9]+/g);
    if (result.length===3)result.push(100);
    return result;
}

function ArrayHSVtoArrayRGBA(color){
    // color = [241, 45, 73, 55];
    color = [color[0], color[1]/100, color[2]/100, color[3]/100];
    let c = color[1] * color[2];
    let x = c * (1 - Math.abs(color[0]/60%2-1));
    let m = color[2] - c;
    let result = [0, 0, 0, 255];
    if (0 <= color[0] && color[0] < 60) result=[c,x,0];
    else if (60 <= color[0] && color[0] < 120) result=[x,c,0];
    else if (120 <= color[0] && color[0] < 180) result=[0,c,x];
    else if (180 <= color[0] && color[0] < 240) result=[0,x,c];
    else if (240 <= color[0] && color[0] < 300) result=[x,0,c];
    else result=[c,0,x];
    result[0] = Math.round((result[0]+m)*255)
    result[1] = Math.round((result[1]+m)*255)
    result[2] = Math.round((result[2]+m)*255)
    if (color[3]!=undefined) result[3] = Math.round(color[3]*255);
    console,console.log(color, result);
    return result;
}


