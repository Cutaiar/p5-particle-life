import P5 from "p5";

export interface IThing {}
export class Cell implements IThing {
  private position: P5.Vector;
  private velocity: P5.Vector;
  private diameter: number;
  private visionDiameter: number;
  private velocityScale = 0.1;
  private p5: P5;

  private mind: IThing[];

  constructor(p5: P5, diameter: number) {
    const x = p5.random(p5.width);
    const y = p5.random(p5.height);
    this.position = new P5.Vector().set(x, y);
    this.velocity = P5.Vector.random2D().mult(this.velocityScale);
    this.diameter = diameter;
    this.visionDiameter = diameter + 20;
    this.p5 = p5;
  }

  public tick() {
    this.position.add(this.velocity);
    this.reflectOnBorders();
  }

  public draw() {
    // body
    this.p5.stroke(255);
    this.p5.noFill();
    this.p5.circle(this.position.x, this.position.y, this.diameter);

    // eye
    const longVel = P5.Vector.mult(
      this.velocity.copy().normalize(),
      this.diameter / 2
    );
    const eye = P5.Vector.add(longVel, this.position);
    this.p5.line(this.position.x, this.position.y, eye.x, eye.y);

    //vision
    this.p5.stroke("#338BA8");
    this.p5.fill(173, 216, 230, 70);
    this.p5.circle(this.position.x, this.position.y, this.visionDiameter);
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

export const createRandomCells = (p5: P5, count: number) => {
  let cells: Cell[] = [];
  for (let i = 0; i < count; i++) {
    cells.push(new Cell(p5, 20));
  }
  return cells;
};
