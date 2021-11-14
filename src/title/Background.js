import Sketch from "react-p5";
import Victor from 'victor';

const MAX_BALLS = 20;
const MAX_LINE_POS = 50;

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min));
}

class Ball {
    constructor(x, y, w, g) {
        this.position = new Victor(x, y);
        this.w = w;
        this.gravity = g;
        this.velocity = new Victor(0, 0);
        this.acceration = new Victor(0, 0);
        this.cooldown = 0; // in terms of frames
    }

    onLine(x1, y1, x2, y2, x, y) {
        return (x - x1) * (x - x2) + (y - y1) * (y - y2) <= 0;
    }

    outOfBounds(p5) {
        return this.position.y > p5.height || this.position.y < 0 || this.position.x > p5.width || this.position.x < 0;  
    }

    update(line_pos) {
        // check for collisions 

        if (this.cooldown <= 0) {
            for (let i = 0; i < line_pos.length; i++) {
                // find dist between x1 y1 and x2 y2
                let dist = Math.sqrt(Math.pow(line_pos[i].x1 - line_pos[i].x2, 2) + Math.pow(line_pos[i].y1 - line_pos[i].y2, 2));
                let dot = (((this.position.x - line_pos[i].x1) * (line_pos[i].x2 + line_pos[i].x1)) + ((this.position.y - line_pos[i].y1) * this.position.y - line_pos[i].y1)) / Math.pow(dist, 2);
                
                let closest_x = line_pos[i].x1 + (dot * (line_pos[i].x2 - line_pos[i].x1));
                let closest_y = line_pos[i].y1 + (dot * (line_pos[i].y2 - line_pos[i].y1));

                if (this.onLine(line_pos[i].x1, line_pos[i].y1, line_pos[i].x2, line_pos[i].y2, this.position.x, this.position.y)) {
                    console.log("Bounce");

                    this.cooldown = 15;

                    // using closest point to line segment, find angle in degrees
                    let angle = Math.atan2(closest_y - this.position.y, closest_x - this.position.x);
                    angle = angle * 180 / Math.PI;
                    this.velocity.rotateDeg(angle + 180).multiplyScalar(0.90);
                    console.log(angle);
                }
            }
        }
        else {
            this.cooldown -= 1;
        }

        this.velocity.add(this.acceration.multiplyScalar(0.05));
        this.position.add(this.velocity);
        this.acceration.multiplyScalar(0);
        this.acceration.add(new Victor(0, this.gravity));
    }

    draw(p5) {
        p5.ellipse(this.position.x, this.position.y, this.w);
    }
}

function Background(props) {
    let balls = [];
    let line_pos = [];

    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(p5.windowWidth - 17, p5.windowHeight - 17).parent(canvasParentRef);
        p5.fill(p5.color('#3d405b'));
    }

    const draw = (p5) => {
        p5.clear();

        if (p5.pmouseX > 0 && p5.pmouseY > 0) {
            p5.stroke(0);

            if (line_pos.length > MAX_LINE_POS) {
                line_pos.shift();
            }
            
            line_pos.push({x1: p5.mouseX, y1: p5.mouseY, x2: p5.pmouseX, y2: p5.pmouseY});

            for (let i = 0; i < line_pos.length; i++) {
                p5.line(line_pos[i].x1, line_pos[i].y1, line_pos[i].x2, line_pos[i].y2);
            }
        }   

        p5.noStroke();

        let to_delete = [];

        balls.forEach(ball => {
            ball.update(line_pos);
            ball.draw(p5);
            if (ball.outOfBounds(p5)) {
                to_delete.push(ball);
            }
        });

        to_delete.forEach(ball => {
            balls.splice(balls.indexOf(ball), 1);
        });

        if (balls.length < MAX_BALLS) {
            balls.push(new Ball(getRandomIntInclusive(0, p5.windowWidth), 0, getRandomIntInclusive(20, 50), getRandomIntInclusive(1, 5)));
        }

    }

    const windowResized = (p5) => {
        p5.resizeCanvas(p5.windowWidth - 17, p5.windowHeight - 17);
    }

    return (
        <Sketch setup={setup} draw={draw} windowResized={windowResized} />
    );
}

export default Background;