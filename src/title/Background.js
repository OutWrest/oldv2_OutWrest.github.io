import Sketch from "react-p5";

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min));
}

class Ball {
    constructor(x, y, w) {
        this.x = x;
        this.y = y;
        this.w = w;
    }

    update() {
        this.x += getRandomIntInclusive(-1, 1);
        this.y += getRandomIntInclusive(-1, 1);
    }

    draw(p5) {
        p5.ellipse(this.x, this.y, this.w);
    }
}

function Background(props) {
    let balls = [];

    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(p5.windowWidth - 17, p5.windowHeight - 17).parent(canvasParentRef);
    }

    const draw = (p5) => {
        if (p5.pmouseX > 0 && p5.pmouseY > 0) { // p5 inits pmouseX and pmouseY to 0
            p5.clear();
            p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
        }

        balls.forEach(ball => {
            ball.update();
            ball.draw(p5);
        });

        if (balls.length < 1000) {
            balls.push(new Ball(p5.mouseX, p5.mouseY, getRandomIntInclusive(20, 50)));
        }

        console.log(balls.length);
    }

    const windowResized = (p5) => {
        p5.resizeCanvas(p5.windowWidth - 17, p5.windowHeight - 17);
    }

    return (
        <Sketch setup={setup} draw={draw} windowResized={windowResized} />
    );
}

export default Background;