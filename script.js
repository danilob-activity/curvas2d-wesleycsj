var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var textarea = document.getElementById("code");
var reset = document.getElementById("reset");
var edit = document.getElementById("edit");
var code = textarea.value;

var scale = 1;

var points_curveH = [] //armazena os pontos da curva de hermite
var np = 100;
var fps = 60;
var frame_current = 0;
var total_time = 3;

window.h0 = [-250,-100];
window.h1 = [250,140];
window.h3 = [Math.cos(0 * Math.PI / 180) * 500,Math.sin(0 * Math.PI / 180) * 500];
window.h2 = [Math.cos(0 * Math.PI / 180) * 500,Math.sin(0 * Math.PI / 180) * 500];
// window.h2 = [-1200,+150];
// window.h3 = [300,-525];


window.p0 = [300,0];
window.p1 = [200,150];
window.p2 = [200,-150];
window.p3 = [-200,-225];
function drawCanvas() {
   let that = this
    setTimeout(function() {
        requestAnimationFrame(drawCanvas)
        frame_current += 1;
        frame_current = frame_current % (total_time * fps);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        //eval(code)

        setHermite(window.h0,window.h1,window.h2,window.h3);

        setBezier(p0,p1,p2,p3);

        if ((frame_current >= ((total_time * fps) / 3)) && (frame_current <= (((total_time * fps) * 2) / 3))) {
          frame_current = frame_current + 1
        }
        // call the draw function again!
        //requestAnimationFrame(draw);


    }, 1000 / fps);
}

function drawCircle(M, canv, color) { //desenha um círculo
    canv.beginPath();
    canv.strokeStyle = '#000000';
    c = multVec(M, [0, 0, 1]);
    canv.arc(c[0], c[1], 5, 0, 2 * Math.PI, false);
    canv.lineWidth = 2;
    canv.fillStyle = color;
    canv.fill();
    canv.setLineDash([]);
    canv.strokeStyle = color;
    canv.stroke();
    canv.fillStyle = '#000000';
}

function drawCircleVec(c, canv, color) { //desenha um círculo
    canv.beginPath();
    canv.strokeStyle = '#000000';
    //c = multVec(M, [0, 0, 1]);
    canv.arc(c[0], c[1], 5, 0, 2 * Math.PI, false);
    canv.lineWidth = 2;
    canv.fillStyle = color;
    canv.fill();
    canv.setLineDash([]);
    canv.strokeStyle = color;
    canv.stroke();
    canv.fillStyle = '#000000';
}

function drawArrow(context, fromx, fromy, tox, toy) {
    var headlen = 8; // length of head in pixels
    var angle = Math.atan2(toy - fromy, tox - fromx);
    context.lineWidth = 2;
    //context.setLineDash([1, 2]);
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    context.stroke();
    //context.setLineDash([]);
}

function setSizePoints(v) {
    np = v;
}

function showPoints() {
    M = transformCanvas(canvas.width, canvas.height);
    ctx.beginPath();
    for (var i = 1; i < points_curveH.length - 1; i++) {
        pa = multVec(mult(M, translate(points_curveH[i][0][0], points_curveH[i][0][1])), [0, 0, 1]);
        drawCircleVec(pa, ctx, "#6a0000");
    }
}
var p_current;

function setHermite(p0, p1, p0l, p1l) {
    points_curveH = []
    ctx.beginPath();
    M = transformCanvas(canvas.width, canvas.height);
    ctx.font = "14px Arial";
    pos0 = multVec(mult(M, translate(p0[0], p0[1])), [0, 0, 1]);
    pos1 = multVec(mult(M, translate(p1[0], p1[1])), [0, 0, 1]);
    pos0l = multVec(mult(M, translate(p0[0] + p0l[0] / 10., p0[1] + p0l[1] / 10.)), [0, 0, 1]);
    pos1l = multVec(mult(M, translate(p1[0] + p1l[0] / 10., p1[1] + p1l[1] / 10.)), [0, 0, 1]);
    calculatePointsCurveHermite(p0, p1, p0l, p1l);
    ctx.lineWidth = 1.5;
    drawCurveHermite();
    ctx.fillStyle = "#ff8364";
    ctx.strokeStyle = "#ff8364";
    drawArrow(ctx, pos0[0], pos0[1], pos0l[0], pos0l[1]);
    drawArrow(ctx, pos1[0], pos1[1], pos1l[0], pos1l[1]);
    ctx.fillStyle = "#494949";
    ctx.fillText("p0", pos0[0] + 7, pos0[1] - 7);
    ctx.fillText("p1", pos1[0] + 7, pos1[1] - 7);
    drawCircle(mult(M, translate(p0[0], p0[1])), ctx, "#8b104e");
    drawCircle(mult(M, translate(p1[0], p1[1])), ctx, "#8b104e");

    p_current = calculatePointCurveHermite(p0, p1, p0l, p1l, frame_current / (total_time * fps));
    drawCircle(mult(M, translate(p_current[0][0], p_current[0][1])), ctx, "#52437b");


}

function setBezier(p0,p1,p2,p3) {
    points_curveB = []
    ctx.beginPath();
    M = transformCanvas(canvas.width, canvas.height);
    ctx.font = "14px Arial";
    pos0 = multVec(mult(M, translate(p0[0], p0[1])), [0, 0, 1]);
    pos1 = multVec(mult(M, translate(p1[0], p1[1])), [0, 0, 1]);
    pos2 = multVec(mult(M, translate(p2[0], p2[1])), [0, 0, 1]);
    pos3 = multVec(mult(M, translate(p3[0], p3[1])), [0, 0, 1]);
    calculatePointsCurveBezier(p0, p1, p2, p3);
    ctx.lineWidth = 1.5;
    drawCurveBezier();
    ctx.fillStyle = "#ff8364";
    ctx.strokeStyle = "#ff8364";
    ctx.fillStyle = "#494949";
    ctx.fillText("p0", pos0[0] + 7, pos0[1] - 7);
    ctx.fillText("p1", pos1[0] + 7, pos1[1] - 7);
    ctx.fillText("p2", pos2[0] + 7, pos2[1] - 7);
    ctx.fillText("p3", pos3[0] + 7, pos3[1] - 7);
    drawCircle(mult(M, translate(p0[0], p0[1])), ctx, "#8b104e");
    drawCircle(mult(M, translate(p1[0], p1[1])), ctx, "#8b104e");
    drawCircle(mult(M, translate(p2[0], p2[1])), ctx, "#8b104e");
    drawCircle(mult(M, translate(p3[0], p3[1])), ctx, "#8b104e");

    var arc = createArc(p0, p1, p2, p3);
    var total_length = arc[0].length;
    var length_current = total_length * (frame_current / (total_time * fps));
    p_current = arc[0].getVec4S(arc[1], length_current)

    // p_current = calculatePointCurveBezier(p0, p1, p2, p3, frame_current / (total_time * fps));
    drawCircle(mult(M, translate(p_current.x, p_current.y)), ctx, "#52437b");

}

function drawCurveHermite() {
    ctx.fillStyle = "#6bd5e1";
    ctx.strokeStyle = "#6bd5e1";

    for (var i = 0; i < points_curveH.length - 1; i++) {
        ctx.beginPath();
        pa = multVec(mult(M, translate(points_curveH[i][0][0], points_curveH[i][0][1])), [0, 0, 1]);
        pb = multVec(mult(M, translate(points_curveH[i + 1][0][0], points_curveH[i + 1][0][1])), [0, 0, 1]);
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.stroke();
    }
}

function drawCurveBezier() {
    ctx.fillStyle = "#6bd5e1";
    ctx.strokeStyle = "#6bd5e1";

    for (var i = 0; i < points_curveB.length - 1; i++) {
        ctx.beginPath();
        pa = multVec(mult(M, translate(points_curveB[i][0][0], points_curveB[i][0][1])), [0, 0, 1]);
        pb = multVec(mult(M, translate(points_curveB[i + 1][0][0], points_curveB[i + 1][0][1])), [0, 0, 1]);
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.stroke();
    }
}

function calculatePointsCurveHermite(p0, p1, p0l, p1l) {
    q = [
        [p0[0], p0[1]],
        [p1[0], p1[1]],
        [p0l[0], p0l[1]],
        [p1l[0], p1l[1]]
    ];
    for (var i = 0; i <= np; i++) {
        var u = (1. * (i)) / np;
        var p = mult(getMatrixBuhermite(u), q);
        points_curveH.push([p[0], p[1]]);
    }
}

function calculatePointCurveHermite(p0, p1, p0l, p1l, t) {
    q = [
        [p0[0], p0[1]],
        [p1[0], p1[1]],
        [p0l[0], p0l[1]],
        [p1l[0], p1l[1]]
    ];
    return mult(getMatrixBuhermite(t), q);

}

function calculatePointsCurveBezier(p0, p1, p2, p3) {
    q = [
        [p0[0], p0[1]],
        [p1[0], p1[1]],
        [p2[0], p2[1]],
        [p3[0], p3[1]]
    ];
    for (var i = 0; i <= np; i++) {
        var u = (1. * (i)) / np;
        var p = mult(getMatrixBuBezier(u), q);
        points_curveB.push([p[0], p[1]]);
    }
}

function calculatePointCurveBezier(p0, p1, p2, p3, t) {
    q = [
        [p0[0], p0[1]],
        [p1[0], p1[1]],
        [p2[0], p2[1]],
        [p3[0], p3[1]]
    ];

    return mult(getMatrixBuBezier(t), q);

}

function getMatrixBuhermite(u) {
    return [
        [2 * u * u * u - 3 * u * u + 1, -2 * u * u * u + 3 * u * u, u * u * u - 2 * u * u + u, u * u * u - u * u]
    ];
}

function getMatrixBuBezier(u) {
    return [
        [1 - 3 * u + 3 * u * u - u * u * u, 3 * u - 6 * u * u + 3 * u * u * u, 3 * u * u - 3 * u * u * u, u * u * u]
    ];
}

save.addEventListener("click", function() {
    var fullQuality = canvas.toDataURL('image/png', 1.0);
    window.location.href = fullQuality;
});



textarea.addEventListener("input", drawCanvas);
window.addEventListener("load", drawCanvas);

function CheckCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return (x1 < x2 + w2) && (x2 < x1 + w1) && (y1 < y2 + h2) && (y2 < y1 + h1)
}

let selected = -1;
canvas.addEventListener('dblclick', function(e){
  let M = transformCanvas(-canvas.width, canvas.height);
  let N = transformCanvas(canvas.width, canvas.height);
  let mouseTranslated = multVec(M, [e.offsetX, e.offsetY, 1]);
  let posh0 = multVec(mult(N, translate(window.h0[0],window.h0[1])), [0, 0, 1]);
  if(CheckCollision(window.h0[0] - 5,window.h0[1] - 5,10,10, mouseTranslated[0], mouseTranslated[1], 1, 1)){
    selected = 0
  } else if(CheckCollision(window.h1[0] - 5,window.h1[1] - 5,10,10, mouseTranslated[0], mouseTranslated[1], 1, 1)){
    selected = 1
  } else if(CheckCollision(window.h2[0] - 5,window.h2[1] - 5,10,10, mouseTranslated[0], mouseTranslated[1], 1, 1)){
    selected = 2
  } else if(CheckCollision(window.h3[0] - 5,window.h3[1] - 5,10,10, mouseTranslated[0], mouseTranslated[1], 1, 1)){
    selected = 3
  } else if(CheckCollision(window.p0[0] - 5,window.p0[1] - 5,10,10, mouseTranslated[0], mouseTranslated[1], 1, 1)){
    selected = 4
  } else if(CheckCollision(window.p1[0] - 5,window.p1[1] - 5,10,10, mouseTranslated[0], mouseTranslated[1], 1, 1)){
    selected = 5
  } else if(CheckCollision(window.p2[0] - 5,window.p2[1] - 5,10,10, mouseTranslated[0], mouseTranslated[1], 1, 1)){
    selected = 6
  } else if(CheckCollision(window.p3[0] - 5,window.p3[1] - 5,10,10, mouseTranslated[0], mouseTranslated[1], 1, 1)){
    selected = 7
  }
})

canvas.addEventListener('mousemove', function(e){
  let M = transformCanvas(-canvas.width, canvas.height);
  let mouseTranslated = multVec(M, [e.offsetX, e.offsetY, 1]);
  if(selected === 0){
    h0[0] = mouseTranslated[0];
    h0[1] = mouseTranslated[1];
  } else if(selected === 1){
    h1[0] = mouseTranslated[0];
    h1[1] = mouseTranslated[1];
  } else if(selected === 2){
    h2[0] = mouseTranslated[0];
    h2[1] = mouseTranslated[1];
  } else if(selected === 3){
    h3[0] = mouseTranslated[0];
    h3[1] = mouseTranslated[1];
  } else if(selected === 4){
    p0[0] = mouseTranslated[0];
    p0[1] = mouseTranslated[1];
  } else if(selected === 5){
    p1[0] = mouseTranslated[0];
    p1[1] = mouseTranslated[1];
  } else if(selected === 6){
    p2[0] = mouseTranslated[0];
    p2[1] = mouseTranslated[1];
  } else if(selected === 7){
    p3[0] = mouseTranslated[0];
    p3[1] = mouseTranslated[1];
  }
  console.log(selected)
})

canvas.addEventListener('click', function(e){
  if(selected > -1){
    selected = -1
    console.log('left')
  }
})
let angle0 = 0
let angle1 = 0
canvas.onwheel = function(e) {
  e.preventDefault()
    var dir = Math.sign(e.deltaY);
    if(selected === 0){
      window.h2[0] = Math.cos(angle0 * Math.PI / 180) * 500
      window.h2[1] = Math.sin(angle0 * Math.PI / 180) * 500
      angle0 = angle0 + e.deltaY

    } else if(selected === 1){
      window.h3[0] = Math.cos(angle1 * Math.PI / 180) * 500
      window.h3[1] = Math.sin(angle1 * Math.PI / 180) * 500
      angle1 = angle1 + e.deltaY
    }
}
