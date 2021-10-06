import P5 from "p5";
import "p5/lib/addons/p5.dom";

import { Cell, createRandomCells } from "./Cell";
import { Food, createRandomFood } from "./Food";

var sketch = (p: P5) => {
  let cells: Cell[];
  let food: Food[];

  p.setup = () => {
    console.log("🚀 - Setup initialized - P5 is running");

    p.createCanvas(p.windowWidth, p.windowHeight);

    cells = createRandomCells(p, 100);
    food = createRandomFood(p, 1000);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    p.background(0);

    updateArrays([cells, food], "tick");
    updateArrays([cells, food], "draw");
  };
};

const updateArrays = (array: any[][], func: string) => {
  array.forEach((a) => {
    a.forEach((sa) => {
      sa[func]();
    });
  });
};

new P5(sketch);
