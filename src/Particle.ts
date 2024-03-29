import P5 from "p5";

export interface IThing {}
export interface Color {
  string: string;
  index: number;
}

const RED: Color = {
  string: "red",
  index: 0,
};

const BLUE: Color = {
  string: "blue",
  index: 1,
};

const YELLOW: Color = {
  string: "yellow",
  index: 2,
};

const GREEN: Color = {
  string: "green",
  index: 3,
};

const COLORS = [RED, BLUE, YELLOW, GREEN];

type BorderBehavior = "wrap" | "reflect";
const drawEye = false;
const borderBehavior: BorderBehavior = "reflect";

// apparently we need this so that there doesn't get to be too much energy in the system
const dampeningFactor = 0.99;

export class Particle implements IThing {
  public position: P5.Vector;
  public color: Color;

  private velocity: P5.Vector;
  private acceleration: P5.Vector;

  private diameter: number;

  private p5: P5;

  constructor(p5: P5, diameter: number) {
    const x = p5.random(p5.width);
    const y = p5.random(p5.height);
    this.position = new P5.Vector().set(x, y);
    this.velocity = new P5.Vector().set(0, 0);
    this.acceleration = new P5.Vector().set(0, 0);
    this.color = COLORS[p5.random([0, 1, 2, 3])];
    this.diameter = diameter;
    this.p5 = p5;
  }

  public tick() {
    this.velocity.add(this.acceleration).mult(dampeningFactor);
    this.position.add(this.velocity);
    this.acceleration.set(0, 0);
    borderBehavior === "wrap" ? this.wrap() : this.reflect();
  }

  public draw() {
    // body
    this.p5.noStroke();
    this.p5.fill(this.color.string);
    this.p5.circle(this.position.x, this.position.y, this.diameter);

    // eye
    if (drawEye) {
      this.p5.stroke(255);
      const longVel = P5.Vector.mult(
        this.velocity.copy().normalize(),
        this.diameter / 2
      );
      const eye = P5.Vector.add(longVel, this.position);
      this.p5.line(this.position.x, this.position.y, eye.x, eye.y);
    }
  }

  public applyForce(acc: P5.Vector) {
    this.acceleration.add(acc);
  }

  private reflect() {
    if (this.position.x >= this.p5.width || this.position.x <= 0) {
      this.velocity.set(this.velocity.x * -1, this.velocity.y);
    }

    if (this.position.y >= this.p5.height || this.position.y <= 0) {
      this.velocity.set(this.velocity.x, this.velocity.y * -1);
    }
  }

  private wrap() {
    if (this.position.x < 0) {
      this.position.set(this.p5.width, this.position.y);
    }

    if (this.position.x > this.p5.width) {
      this.position.set(0, this.position.y);
    }

    if (this.position.y > this.p5.height) {
      this.position.set(this.position.x, 0);
    }

    if (this.position.y < 0) {
      this.position.set(this.position.x, this.p5.height);
    }
  }
}

export const createRandomParticles = (p5: P5, count: number) => {
  let particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(p5, 10));
  }
  return particles;
};
