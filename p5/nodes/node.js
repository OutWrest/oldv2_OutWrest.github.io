class node {
  constructor(diameter, x, y, col) {
    this.diameter = diameter;
    this.loc = [x, y];
    this.col = col;
    this.veo = [0, 0];
  }
  
  update() {
    if (this.diameter>1.5) {
      this.draw();
      
      this.loc = this.loc.map((l, i) => l + this.veo[i]);

      this.veo = this.veo.map((v, i) => v + [random(-speed, speed), random(-speed, speed)][i]);
      
      let sum = this.veo.reduce(function(a, b){
        return a + b;
      }, 0);
      
      for (var i; i < this.veo.length; i++) {
        this.veo[i] = sq((this.veo[i]/sum));
      }  
      
      if (random(0, 1) < split) {
        let dia = sqrt(PI*sq(this.diameter/2)/size_after_split/PI)*2;
        
        let new_node = new node(
          dia,
          this.loc[0],
          this.loc[1],
          this.col
        );
        
        new_node.veo = this.veo;
        
        paths.push(new_node);
        
        this.diameter = dia;
      }
    }
    else {
      paths.splice(paths.indexOf(this), 1);
    }
  }
  
  draw() {
    if (this.diameter>2) {
      noStroke();
      smooth();
      fill(this.col);
      circle(this.loc[0], this.loc[1], this.diameter);
    }
  }
}
