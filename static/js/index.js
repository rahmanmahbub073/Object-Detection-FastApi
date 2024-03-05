var canvasBuf = document.getElementById("canvasBuf");
var contextBuf = canvasBuf.getContext("2d");

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var video = document.getElementById("video");

let current = 0;
let is_ok = true;
let images;

function visibleVideo() {
    video.style.zIndex = 1;
    video.style.visibility = "visible";
    canvas.style.zIndex = 0;
    canvas.style.visibility = "hidden";
}

function hiddenVideo() {
    canvas.style.zIndex = 1;
    canvas.style.visibility = "visible";
    video.style.zIndex = 0;
    video.style.visibility = "hidden";
}

video.onpause = visibleVideo;

video.onplay = function() {
    if (video.src == "") return;
    let frameHeight;
    let frameWidth;
    let rate;
    if (video.clientHeight/video.videoHeight*video.videoWidth <= video.clientWidth) {
        frameHeight = video.clientHeight;
        frameWidth = video.clientHeight/video.videoHeight*video.videoWidth;
        rate = frameWidth/video.clientWidth*100;
        canvasBuf.style.height = "100%";
        canvasBuf.style.width = `${rate}%`;
        canvas.style.height = "100%";
        canvas.style.width = `${rate}%`;
        canvas.style.left = `${(video.clientWidth - frameWidth)/2}px`;
        canvas.style.top = "0px";
    } else {
        frameWidth = video.clientWidth;
        frameHeight = video.clientWidth/video.videoWidth*video.videoHeight;
        rate = frameHeight/video.clientHeight*100;
        canvasBuf.style.height = `${rate}%`;
        canvasBuf.style.width = "100%";
        canvas.style.height = `${rate}%`;
        canvas.style.width = "100%";
        canvas.style.top = `${(video.clientHeight - frameHeight)/2}px`;
        canvas.style.left = "0px";
    }
    canvasBuf.height = frameHeight;
    canvasBuf.width = frameWidth;
    canvas.height = frameHeight;
    canvas.width = frameWidth;
    hiddenVideo();
    switchToCanvas();
}

canvas.onclick = function() { video.pause(); }

document.getElementById("selectVideo").onchange = function ()
{
    video.pause();
    visibleVideo();
    video.src = URL.createObjectURL(this.files[0]);
    document.getElementById("show").style.background = "#000000";
    video.controls = "controls";
}

document.getElementById("selectVideoButton").onclick = function()
{
    document.getElementById("selectVideo").click();
}

function switchToCanvas() 
{
    if (video.ended) {
        return;
    }
    // 将video上的图片的每一帧以图片的形式绘制的canvas上
    video_time = video.currentTime;
    if(current!=video_time && is_ok) {
        is_ok = false;
        contextBuf.drawImage(video, 0, 0, canvasBuf.width, canvasBuf.height);
        images = contextBuf.getImageData(0, 0, canvasBuf.width, canvasBuf.height);
        current = video_time;
        uploadBase64(canvasBuf.toDataURL("image/jpeg"));
    }
    window.requestAnimationFrame(switchToCanvas);
}

function uploadBase64(image) 
{                                             
    pron = document.getElementById("pron").checked;
    let json = {"image": image, "use": pron};
    let xhr = new XMLHttpRequest();                                             
    xhr.open("POST", "/detected");                                             
    xhr.setRequestHeader("Content-type", "application/json");                                             
    xhr.send(JSON.stringify(json));
    xhr.onreadystatechange = function() {                                             
       if(xhr.readyState==4 && xhr.status==200) {                                             
            let result = JSON.parse(xhr.responseText);
            context.putImageData(images, 0, 0);
            drawModelLabel(context, result.data, 2, '#00ff00', 15, '#000000')
            is_ok=true;
       }                                             
    }                                             
 }                  

 function drawModelLabel(context, data, linewidth, lineColor, fontSize, fontColor) {
    for (let i=0; i<data.length; i++) {
        box = data[i].box;
        confidence = data[i].confidence;
        label = data[i].label;
        drawLabel(context, box[0], box[1], box[2], box[3], linewidth, lineColor, label, confidence, fontSize, fontColor);
    }
 }


 function drawLabel(context, x1, y1, x2, y2, lineWidth, lineColor, text, confidence, fontSize, fontColor) 
 {
    y1 = y1 < fontSize + lineWidth ? fontSize + lineWidth : y1
    let label = text + " " + confidence; 
    const extend = 4 + lineWidth/2;
    context.lineWidth = lineWidth;
    context.strokeStyle = lineColor;
    context.strokeRect(x1, y1, x2 - x1, y2 - y1);

    context.fillStyle =lineColor;
    context.textAlign = "start";
    context.textBaseline = "bottom";

    context.font = `${fontSize}px bold 黑体`;
    let width = context.measureText(label).width;
    context.fillRect(x1 - lineWidth/2, y1 - fontSize - extend,  width + extend, fontSize + extend);

    context.fillStyle = fontColor;
    context.fillText(label, x1, y1 - lineWidth/2);
 }