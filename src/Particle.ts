import P5 from "p5";

export interface IThing {}
export type Color = "red" | "blue";
export class Particle implements IThing {
  private position: P5.Vector;
  private velocity: P5.Vector;
  private color: Color;

  private diameter: number;

  private p5: P5;

  constructor(p5: P5, diameter: number) {
    const x = p5.random(p5.width);
    const y = p5.random(p5.height);
    this.position = new P5.Vector().set(x, y);
    this.velocity = new P5.Vector().set(0, 0);
    this.color = p5.random([0, 1]) === 0 ? "red" : "blue";
    this.diameter = diameter;
    this.p5 = p5;
  }

  public tick() {
    // this.velocity.add(acceleration); // TODO
    this.position.add(this.velocity);
    this.reflectOnBorders();
    // TODO: wrap too
  }

  public draw() {
    // body
    this.p5.noStroke();
    this.p5.fill(this.color);
    this.p5.circle(this.position.x, this.position.y, this.diameter);

    // eye
    const longVel = P5.Vector.mult(
      this.velocity.copy().normalize(),
      this.diameter / 2
    );
    const eye = P5.Vector.add(longVel, this.position);
    this.p5.line(this.position.x, this.position.y, eye.x, eye.y);
  }

  private reflectOnBorders() {
    if (this.position.x >= this.p5.width || this.position.x <= 0) {
      this.velocity.set(this.velocity.x * -1, this.velocity.y);
    }

    if (this.position.y >= this.p5.height || this.position.y <= 0) {
      this.velocity.set(this.velocity.x, this.velocity.y * -1);
    }
  }
}

export const createRandomParticles = (p5: P5, count: number) => {
  let particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(p5, 20));
  }
  return particles;
};
