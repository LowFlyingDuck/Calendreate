const canvases = [];

// let padding = 0.9;
// let imageMargin = 50;
// let boxHeight = 150;
// let boxPadding = 40;
// let monthBoxExtent = 60;
// let colour = '#091F0C';

let leapYear = false;

let updateCanvases = [];

const months = [
  ['Januar', 31],
  ['Februar', leapYear ? 29 : 28],
  ['März', 31],
  ['April', 30],
  ['Mai', 31],
  ['Juni', 30],
  ['Juli', 31],
  ['August', 31],
  ['September', 30],
  ['Oktober', 31],
  ['November', 30],
  ['Dezember', 31]
]

const weekDays = [
  'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'
]
let wI = 0;

function update() {
  let numbers = [...document.querySelectorAll('form#numbers > input')].forEach(e => {
    window[e.id] = parseFloat(e.value);
  });
  window.colour = document.querySelector('#colour').value;
  window.numbers = numbers;
  updateCanvases.forEach(e => e.redraw());
}
update();
window.setInterval(update, 1000);

function convert( buffer ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}

function handler(c,i) {

let img;
let s;

c.preload = async () => {
  var buffer = await document.querySelector('input#files').files[i].arrayBuffer();
  var ba = convert(buffer);
  img = c.loadImage('data:'+document.querySelector('input#files').files[i].type+';base64,'+ba);
  window.setTimeout(s.redraw, 1000);
}

c.setup = () => {
  c.createCanvas(c.windowWidth, (c.windowWidth/4200)*2970);
  s = c.createGraphics(4200, 2970);
  canvases.push(s);
  c.frameRate(1);
  updateCanvases.push(c);
}

c.draw = () => {
  s.noSmooth();
  s.background(colour);
  let w = padding*s.width;
  let h = img.height*w/img.width;
  let oL = (s.width/2)-w/2;
  s.textSize(70);
  let oT = (s.height/2)-h/2-boxHeight/2;

  // place image
  s.textAlign(s.LEFT, s.TOP);
  s.image(img, oL, oT, w, h);

  oT += h+imageMargin;

  // create monthname box
  let monthBoxWidth = s.textWidth(months[i][0])+2*boxPadding+monthBoxExtent;
  s.noFill();
  s.strokeWeight(6);
  s.stroke(255);
  s.rect(oL+3, oT, monthBoxWidth, boxHeight);

  oL += boxPadding;
  toT = oT + boxHeight/2;

  s.textAlign(s.LEFT, s.CENTER);
  s.noStroke();
  s.fill(255);
  s.textFont('Avenir');
  s.textStyle(s.BOLD);
  s.text(months[i][0], oL, toT+5);

  oL += monthBoxWidth;
  let bW = (w+3 - monthBoxWidth - boxPadding-5)/months[i][1];
  s.noFill();
  s.stroke(255);
  s.rect(oL, oT, bW*months[i][1], boxHeight);
  s.textStyle(s.NORMAL);

  for (let j=0;j<months[i][1];j++) {

    // s.rect(oL, oT, bW, boxHeight);
    s.noFill();
    s.stroke(255);
    s.line(oL+bW, oT+3, oL+bW, oT+boxHeight-3)
    s.noStroke();
    s.fill(255);
    // digit
    s.textSize(60);
    s.textAlign(s.CENTER, s.TOP);
    s.text(j+1, oL+bW/2, toT-5);
    // day
    s.textSize(30);
    s.textAlign(s.LEFT, s.CENTER);
    s.text(weekDays[wI], oL+25, oT+boxPadding);

    wI = (wI+1)%7;
    oL += bW;
  }
  c.noLoop();
  c.image(s, 0, 0, c.width, c.height);
}
 
c.windowResized = () => {
  wI = 0;
  c.resizeCanvas(c.windowWidth, (c.windowWidth/4200)*2970);
};

}

function load() {
  for (let i=0;i<12;i++) {
    new p5((s) => handler(s,i));
  }
}

function ex() {
  let pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: 'a3'
  });
  let width = pdf.internal.pageSize.width;
  let height = pdf.internal.pageSize.height;
  canvases.forEach(e => {
    var imgData = e.canvas.toDataURL("image/jpeg", 1.0);
    pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
    pdf.addPage();
  });
  pdf.save("download.pdf");
}