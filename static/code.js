const IMAGE_WIDTH = 28;
const IMAGE_HEIGHT = 28;
const SCALE = 1;

// get the canvas element and its context
let canvas = document.getElementById("mnist-canvas");
let ctx = canvas.getContext("2d", {willReadFrequently: true});

let drawingChanged = false;

// initialize some variables to store the mouse position and state
let mouseX = 0;
let mouseY = 0;
let mouseDown = false;

// create a function to update the mouse position
function updateMousePosition(e) {
  // get the mouse position relative to the canvas
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
}

// create a function to handle the mouse down event
function handleMouseDown(e) {
  // update the mouse position and state
  updateMousePosition(e);
  mouseDown = true;

  // start a new path and move to the mouse position
  ctx.beginPath();
  ctx.moveTo(mouseX, mouseY);
}

// create a function to handle the mouse move event
function handleMouseMove(e) {
  // update the mouse position
  updateMousePosition(e);

  // if the mouse is down, draw a line to the mouse position
  if (mouseDown) {
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();

    drawingChanged = true;
  }
}

// create a function to handle the mouse up event
function handleMouseUp(_e) {
  // update the mouse state
  mouseDown = false;
}

// add event listeners for the mouse events
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);

// optionally, you can also add event listeners for touch events
// to make the canvas work on mobile devices
canvas.addEventListener("touchstart", (e) => handleMouseDown(e.touches[0]));
canvas.addEventListener("touchmove", (e) => {
  handleMouseMove(e.touches[0]);
  e.preventDefault(); // prevent scrolling
});
canvas.addEventListener("touchend", (e) => handleMouseUp(e.changedTouches[0]));

function init() {
  canvas.width = IMAGE_WIDTH * SCALE;
  canvas.height = IMAGE_HEIGHT * SCALE;
  ctx.lineWidth = SCALE;
  // set the image smoothing quality to high
  ctx.imageSmoothingQuality = "high";

  // Clear the background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Periodically we will predict the digit if the drawing has changed
  setInterval(predict, 1200);
}

// periodic update, does a predict call and shows the pixel data for the interested user
function predict() {
  if(drawingChanged) {
    drawingChanged = false;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // get the pixel data array
    const pixels = imgData.data;

    // create an empty array to store the gray scale values
    const grayScale = [];

    // loop through the pixel data array
    for (let i = 0; i < pixels.length; i += 4) {
      // get the red, green, and blue components of the pixel
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      // calculate the gray scale value using the luminosity formula
      // https://en.wikipedia.org/wiki/Grayscale#Luma_coding_in_video_systems
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;

      // normalize the gray scale value to the range [0, 1]
      // note we also flip the brightness because the mnist data expects ink to be one
      // and paper to be zero...
      const normalized = 1.0 - (gray / 255);

      // push the normalized value to the gray scale array
      grayScale.push(normalized);
    }

    let jsonString = '';
    var row = 0;
    while(row < 28) {
      var col = 0;
      while(col < 28) {
        jsonString += `${grayScale[(28 * row) + col].toFixed (2)} `;
        col ++;
      }
      jsonString += '\n';
      row ++;
    }
    const textarea = document.getElementById("pixel-data");
    textarea.value = jsonString;

    // Get the anchor element by its id
    let anchor = document.getElementById("mnist-predict");

    // Use fetch to send the request
    fetch("http://localhost:3000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: `{"tensor": ${JSON.stringify(grayScale)}}`
    })
      // Convert the response to JSON
      .then((response) => response.json())
      // Copy the output to the anchor element
      .then((data) => {
        let text = '';
        var i = 0;
        while(i < 10) {
          text += `${i}: ${data.prediction[i].toFixed (4)}` + (i < 9 ? '\n' : '');
          i ++;
        }
        anchor.textContent = text;
      })
      // Handle any errors
      .catch((error) => {
        console.error(error);
      });
  }
} 

function clearPanel() {
  // clear the pixel data in the canvas
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawingChanged = true;
  predict();
}


window.addEventListener("load", function () {
  init();
});
