import P5 from "p5";
import { IThing } from "./Cell";

export class Food implements IThing {
  private position: P5.Vector;
  private p5: P5;

  constructor(p5: P5) {
    const x = p5.random(p5.width);
    const y = p5.random(p5.height);
    this.position = new P5.Vector().set(x, y);
    this.p5 = p5;
  }

  public tick() {
    // empty
  }

  public draw() {
    // body
    this.p5.stroke(255);
    this.p5.noFill();
    this.p5.point(this.position.x, this.position.y);
  }
}

export const createRandomFood = (p5: P5, count: number) => {
  let foods: Food[] = [];
  for (let i = 0; i < count; i++) {
    foods.push(new Food(p5));
  }
  return foods;
};
