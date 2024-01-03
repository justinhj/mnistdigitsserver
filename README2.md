# Client notes
## Canvas drawing
The canvas is scaled up in multiples of 28. 28x28 is the target for the inputs to the server.

they should be floating point numbers from 0 to 1. 

scale should be a parameter

when user draws it should do some kind of free hand drawing on the 28x28 grid including anti aliasing

```
// get the canvas element and its context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// get the image data of the canvas
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
  const normalized = gray / 255;

  // push the normalized value to the gray scale array
  grayScale.push(normalized);
}

// convert the gray scale array to a JSON string
const json = JSON.stringify(grayScale);

// log the JSON string to the console
console.log(json);
```

