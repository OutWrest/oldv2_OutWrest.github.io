let initial_size = 15;
let speed = 0.1;
let split = 0.023;

let initial_nodes = 5;

let colors = [
  [255, 95, 77],
  [18, 53, 86]
];

let paths = [];
let veo = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);
  
  for(var i = 0; i < initial_nodes; i++) {
    paths.push( new node(
      initial_size,
      random((width/4),(width)*(3/4)),
      random((height/4),(height)*(3/4)),
      colors[Math.floor(Math.random()*colors.length)]
    ));
  }
  
}

function draw() {
  paths.forEach(el => el.update());
  paths.forEach(el => el.draw());
  
  strokeWeight(10);
  stroke(220);
  textSize(100);
  textAlign(CENTER);
  textStyle(BOLD);
  fill(colors[1]);
  text('Beyond The Five', width/2, height/2);
  fill(colors[0]);
  text('Anniversary', (width/2), height*(2/3));
}

function mousePressed() {
  paths.push( new node(
    initial_size,
    mouseX,
    mouseY,
    colors[Math.floor(Math.random()*colors.length)]
  ));
}
