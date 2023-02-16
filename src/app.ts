import P5 from "p5";
import "p5/lib/addons/p5.dom";

import { Particle, createRandomParticles } from "./Particle";

var sketch = (p: P5) => {
  let particles: Particle[];

  p.setup = () => {
    console.log("🚀 - Setup initialized - P5 is running");

    p.createCanvas(p.windowWidth, p.windowHeight);

    particles = createRandomParticles(p, 500);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    p.background(0);

    // Apply forces (very naive approach)
    // TODO: use  Barnes-Hut or something similar
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];

        if (a !== b) {
          force(a, b);
          force(b, a);
        }
      }
      a.tick();
      a.draw();
    }

    // updateArrays([particles], "tick");
    // updateArrays([particles], "draw");
  };
};

const updateArrays = (array: any[][], func: string) => {
  array.forEach((a) => {
    a.forEach((sa) => {
      sa[func]();
    });
  });
};

//        | red | blue | yellow | green
// ------------------------------------
// red    |  .      .      .        .
// blue   |  .      .      .        .
// yellow |  .      .      .        .
// green  |  .      .      .        .
//
// positive is attract, negative is repulse
// Convention: "rows force on col"
const attMatrix = [
  [-0.1, -0.1, 0.3, -0.34],
  [-0.1, 0.2, 0, 0],
  [-0.1, 0.2, 0.15, -0.2],
  [-0.17, 0.2, 0.34, -0.32],
];

// applies force of p1 on p2 (not p2 to p1)
const force = (p1: Particle, p2: Particle) => {
  const factor = attMatrix[p1.color.index][p2.color.index]; // p1s force on p2

  // Use this to adjust the total amount of energy in the system
  const energy = 1;

  const delta = P5.Vector.sub(p1.position, p2.position);
  const f = getForce(factor, delta);
  p2.applyForce(f.mult(energy));
};

// Based on https://www.brainxyz.com/machine-learning/artificial-life/
// TODO: Implement more sophisticated force fn like https://particle-life.com/framework#matrix
// TODO: Soften to avoid approaching infinite forces when particles have zero distance
const getForce = (factor: number, delta: P5.Vector) => {
  const dist = delta.mag();
  let force = 0;
  if (dist > 0 && dist < 80) {
    force = (factor * 1) / dist;
  }
  return delta.mult(force / dist);
};

new P5(sketch);
