
 function justDrawTruth(type){
    
  const flipFuncs = [flipBoth, flipHorizontal, flipVertical];
  const frames = [];
  const flipFunc = flipFuncs[type];
  console.log("JR NOTE: type is",type)

      const canvas = document.createElement("canvas");
      const buffer = document.createElement("canvas");

      canvas.width = 600;
      canvas.height = 600;
      buffer.width = canvas.width;
      buffer.height = canvas.height;
      const size = 14;
      let ratio = 1.0;
      const outer_r = Math.min(canvas.height, canvas.width) / 2.1;
      const radius = outer_r;
      frames.push(canvas);
      for (let i = 0; i < 11; i++) {
          drawCircleOfRects(buffer, radius * ratio, size * ratio, i, flipFunc);
          rotateRingTwelveDegrees(canvas, i);
          canvas.getContext("2d").drawImage(buffer, 0, 0);
          canvas.getContext("2d").restore();
          ratio = ratio * 0.8;
      }
      //canvas.getContext("2d").imageSmoothingEnabled = false
      const tinyBoi = document.createElement("canvas");
      tinyBoi.width = 300;
      tinyBoi.height = 300;
      tinyBoi.getContext("2d").drawImage(canvas,0,0,300,300);

      blur(canvas);
      return tinyBoi;

}


function x_y_to_indice(x, y, width) {
  return y * width + x;
}


function rotateRingTwelveDegrees(canvas, ringNum) {
  const context = canvas.getContext("2d");
  context.save();
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate(toRadians(45 * ringNum));
  context.translate(-canvas.width / 2, -canvas.height / 2);
}


function flipHorizontal(canvas) {
  const context = canvas.getContext("2d");
  context.save();
  context.translate(canvas.width, 0);
  context.scale(-1, 1);
}

function flipVertical(canvas) {
  const context = canvas.getContext("2d");
  context.save();
  context.translate(0, canvas.height);
  context.scale(1, -1);

}

function flipBoth(canvas) {
  const context = canvas.getContext("2d");
  context.save();
  context.translate(canvas.width, canvas.height);
  context.scale(-1, -1);
}

function drawCircleOfRects(canvas, radius, size, ring_num, flipFunc) {
  const context = canvas.getContext("2d");
  const origin_x = canvas.width / 2;
  const origin_y = canvas.height / 2;
  context.fillRect(origin_x, origin_y, 30, 30);

  const num_rects = 90;
  //each circle should be upside down compared to the other to make it swirl
  if (ring_num % 2 === 0) {
      flipFunc(canvas);
  }
  for (let i = 0; i < num_rects; i++) {
      const ret = addNewSquare(origin_x, origin_y, context, radius, size, i + 1, num_rects, canvas.width);
  }
  if (ring_num % 2 === 0) {
      context.restore();
  }
}

function addNewSquare(origin_x, origin_y, context, radius, size, num, num_rects, whole_width) {
  var coords = pos_func(origin_x, origin_y, radius, num, num_rects);
  const x = coords[0];
  const y = coords[1];
  var color = "#000000";
  square(x, y, color, context, size, num, num_rects, whole_width, radius);
  return coords;
}

function pos_func(origin_x, origin_y, radius, num, num_rects) {
  return circle(origin_x, origin_y, radius, num, num_rects);
}

const threshold = function (canvas) {
  var ctx = canvas.getContext('2d');
  if (!ctx) {
      return;
  }
  var output = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var d = output.data;
  for (var i = 0; i < d.length; i += 4) {
      var r = d[i];
      var g = d[i + 1];
      var b = d[i + 2];
      var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= 100) ? 255 : 0;
      d[i] = d[i + 1] = d[i + 2] = v
  }
  ctx.putImageData(output, 0, 0);
};

const grayscale = function (canvas) {
  var ctx = canvas.getContext('2d');
  if (!ctx) {
      return;
  }
  var output = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var d = output.data;
  for (var i = 0; i < d.length; i += 4) {
      var r = d[i];
      var g = d[i + 1];
      var b = d[i + 2];
      // CIE luminance for the RGB
      // The human eye is bad at seeing red and blue, so we de-emphasize them.
      var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      d[i] = d[i + 1] = d[i + 2] = v
  }
  ctx.putImageData(output, 0, 0);
};

const invert = function (canvas) {
  var ctx = canvas.getContext('2d');
  if (!ctx) {
      return;
  }
  var output = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var d = output.data;
  for (var i = 0; i < d.length; i += 4) {
      d[i] = 255 - d[i];
      d[i + 1] = 255 - d[i + 1];
      d[i + 2] = 255 - d[i + 2];
  }
  ctx.putImageData(output, 0, 0);
};

const blur = function (canvas) {
  kernel(canvas, [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9]);
}

const edge_detection = function (canvas) {
  kernel(canvas, [-1, -1, -1, -1, 9, -1, -1, -1, -1]);
}

const kernel = function (canvas, weights) {
  var ctx = canvas.getContext('2d');
  if (!ctx) {
      return;
  }
  var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var side = Math.round(Math.sqrt(weights.length));
  var halfSide = Math.floor(side / 2);
  var src = pixels.data;
  var sw = pixels.width;
  var sh = pixels.height;
  // pad output by the convolution matrix
  var w = sw;
  var h = sh;
  var output = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var dst = output.data;
  // go through the destination image pixels
  for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
          var sy = y;
          var sx = x;
          var dstOff = (y * w + x) * 4;
          // calculate the weighed sum of the source image pixels that
          // fall under the convolution matrix
          var r = 0, g = 0, b = 0, a = 0;
          for (var cy = 0; cy < side; cy++) {
              for (var cx = 0; cx < side; cx++) {
                  var scy = sy + cy - halfSide;
                  var scx = sx + cx - halfSide;
                  if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                      var srcOff = (scy * sw + scx) * 4;
                      var wt = weights[cy * side + cx];
                      r += src[srcOff] * wt;
                      g += src[srcOff + 1] * wt;
                      b += src[srcOff + 2] * wt;
                      a += src[srcOff + 3] * wt;
                  }
              }
          }
          dst[dstOff] = r;
          dst[dstOff + 1] = g;
          dst[dstOff + 2] = b;
          dst[dstOff + 3] = a;
      }
  }
  ctx.putImageData(output, 0, 0);
}

function square(x, y, color, context, size, num, num_rects, whole_width, radius) {
  context.fillStyle = color;
  context.save();
  context.translate(x, y);

  //don't question it, its dumb. just played with numbers till it worked
  const theta = 2 * Math.PI * (num) / (num_rects);
  context.rotate(theta);
  const rect_ratio = 1.3;
  //context.fillRect(0,0,size,size*rect_ratio);
  // Create gradient
  //TODO shift gradient center based on whatever
  const choices = x > whole_width ? [size, size / 2, 0] : [0, size / 2, size];
  var grd = context.createRadialGradient(choices[(num) % 3], size, size / 4, 0, size, size * 2);
  if ((num) % 6 < 3) {
      grd.addColorStop(0, "black");
      grd.addColorStop(0.3, "grey");
      grd.addColorStop(1.0, "white");

  } else {
      grd.addColorStop(0, "white");
      grd.addColorStop(0.3, "grey");
      grd.addColorStop(1.0, "black");
  }

  // Fill with gradient
  context.fillStyle = grd;
  context.fillRect(0, 0, size, size * rect_ratio);
  context.restore();
}

//position function for drawing distinct objects in a circle
function circle(origin_x, origin_y, radius, num, num_rects) {
  //TODO rip out num rings entirely.
  const angle = 2 * Math.PI * (num) / (num_rects);
  var x = radius * Math.cos((angle)) + origin_x; //0,0 is not center
  var y = radius * Math.sin((angle)) + origin_y;
  return [x, y, angle];
}

function distance(x, x1, y, y1) {
  return Math.sqrt(Math.pow((x - x1), 2) + Math.pow((y - y1), 2));
}

function toRadians(angle) {
  return angle * (Math.PI / 180);
}
