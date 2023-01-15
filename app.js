const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const lineWidth = document.getElementById("line-width");
const color = document.getElementById("color");
const colorOptions = Array.from(
  document.getElementsByClassName("color-option")
);
const modeBtn = document.getElementById("mode-btn");
const destroyBtn = document.getElementById("destroy-btn");
const eraserBtn = document.getElementById("eraser-btn");
const fileInput = document.getElementById("file");
const textInput = document.getElementById("text");
const saveBtn = document.getElementById("save");
const weightSelect = document.getElementById("font-weight");
const sizeInput = document.getElementById("font-size");
const nameSelect = document.getElementById("font-name");
const lineBtn = document.querySelector('label[for="line-width"]');

const font = new FontFace(
  "nanumGothic",
  "url(/fonts/Nanum_Gothic/NanumGothic-Regular.ttf)",
  {
    style: "normal",
    weight: 400,
  }
);
document.fonts.ready.then(() => {
  document.fonts.add(font);
  font.load();
  document.body.style.fontFamily = "nanumGothic, serif";
});

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";
let isPainting = false;
let isFilling = false;
let isDrawing = false;

function onMove(event) {
  if (isPainting & !isDrawing) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  } else if (isPainting & isDrawing) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.fill();
    return;
  }
  ctx.moveTo(event.offsetX, event.offsetY);
}
function startPainting() {
  isPainting = true;
}
function cancelPainting() {
  isPainting = false;
  ctx.beginPath();
}
function onLineClick() {
  if (isDrawing) {
    isDrawing = false;
    lineBtn.innerText = "Line Width";
  } else {
    isDrawing = true;
    lineBtn.innerText = "Shape Width";
  }
}

function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}
function onColorChange(event) {
  ctx.strokeStyle = ctx.fillStyle = event.target.value;
}
function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = ctx.fillStyle = color.value = colorValue;
}

function onModeClick() {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "💧Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "🖌️Draw";
  }
}

let clickCount = 0;
let timeOut;
function onClick() {
  clickCount++;
  switch (clickCount) {
    case 2:
      onDoubleClick();
      break;
    case 1:
      timeOut = setTimeout("onCanvasClick()", 500);
      break;
  }
}
function onCanvasClick() {
  clickCount = 0;
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}
function onDestroyClick() {
  if (window.confirm("정말로 그림판 전체를 삭제하시겠습니까?")) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}
function onEraserClick() {
  ctx.strokeStyle = "white";
  isFilling = false;
  modeBtn.innerText = "Fill";
}

function onFileChange(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null;
  };
}
function onDoubleClick(event) {
  clearTimeout(timeOut);
  clickCount = 0;
  const text = textInput.value;
  const textWeight = weightSelect.value;
  const textSize = sizeInput.value;
  const textFont = nameSelect.value;
  if ((text !== "") & isFilling) {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.font = `${textWeight} ${textSize}px ${textFont}`;
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore();
  } else if ((text !== "") & !isFilling) {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.font = `${textWeight} ${textSize}px ${textFont}`;
    ctx.strokeText(text, event.offsetX, event.offsetY);
    ctx.restore();
  }
}
function onSaveClick() {
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
}
function onNameClick(event) {
  const nameValue = event.target;
  console.log(nameValue);
}

canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onClick);
canvas.addEventListener("dblclick", onDoubleClick);

lineWidth.addEventListener("change", onLineWidthChange);
lineBtn.addEventListener("click", onLineClick);
color.addEventListener("change", onColorChange);
colorOptions.forEach((color) => color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);

fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);
