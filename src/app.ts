import P5 from "p5";
import "p5/lib/addons/p5.dom";

import { Particle, createRandomParticles } from "./Particle";

var sketch = (p: P5) => {
  let cells: Particle[];

  p.setup = () => {
    console.log("🚀 - Setup initialized - P5 is running");

    p.createCanvas(p.windowWidth, p.windowHeight);

    cells = createRandomParticles(p, 100);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    p.background(0);

    updateArrays([cells], "tick");
    updateArrays([cells], "draw");
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
