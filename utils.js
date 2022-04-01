const getRandomNumberBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const pickFrom = (array) => {
  return array[getRandomNumberBetween(0, array.length - 1)];
}

const addImageProcess =(src)=>{
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//https://stackoverflow.com/questions/18229022/how-to-show-current-time-in-javascript-in-the-format-hhmmss
function checkTime(i) {
  if (i < 10) {
      i = "0" + i;
  }
  return i;
}

function getTimeString(date) {
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  // add a zero in front of numbers<10
  m = checkTime(m);
  s = checkTime(s);
  return h + ":" + m + ":" + s;
}

function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}