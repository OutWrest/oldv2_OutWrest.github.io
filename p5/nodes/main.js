let initial_size = 15;
let speed = 0.1;
let split = 0.023;
let size_after_split = 1.75;

let initial_nodes = 35;

let colors = [
  [255, 95, 77],
  [18, 53, 86],
  [250, 208, 38],
  [252, 148, 58],
  [254, 95, 76],
  [18, 53, 86],
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
      width/2,
      height/2,
      colors[Math.floor(Math.random()*colors.length)]
    ));
  }
}

function draw() {
  paths.forEach(el => el.update());
  
  if (random(0, 1) < split*1.75) {
    paths.push( new node(
      initial_size,
      width/2,
      height/2,
      colors[Math.floor(Math.random()*colors.length)]
    ));
  }
  
  // Draws text
  smooth();
  strokeWeight(15);
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
