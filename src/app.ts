import P5 from "p5";
import "p5/lib/addons/p5.dom";

import { Particle, createRandomParticles } from "./Particle";

var sketch = (p: P5) => {
  let particles: Particle[];

  p.setup = () => {
    console.log("🚀 - Setup initialized - P5 is running");

    p.createCanvas(p.windowWidth, p.windowHeight);

    particles = createRandomParticles(p, 300);
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
          a.tick();
          b.tick();
        }
      }
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
  [0.2, -0.1, 0.3, -0.4],
  [-0.1, 0.2, 0, 0],
  [-0.1, 0.2, 0.6, 0],
  [-0.1, 0.2, 0, -0.7],
];

// applies force of p1 on p2 (not p2 to p1)
const force = (p1: Particle, p2: Particle) => {
  const factor = attMatrix[p1.color.index][p2.color.index]; // p1s force on p2

  const energy = 0.0001;

  const delta = P5.Vector.sub(p1.position, p2.position);

  const f = getForce(factor, delta);
  p2.applyForce(f.mult(energy));
};

// based off of https://particle-life.com/framework#matrix
// Does not produce expected results. particles to not cluster
const getForce = (factor: number, delta: P5.Vector) => {
  const dist = delta.mag();
  const rmin = 20;
  const z = 1000; // compensate for my coordinates not being -1 to 1

  const force =
    dist < rmin
      ? (dist / rmin - 1) * z
      : factor * (1 - Math.abs(z + rmin - 2 * dist) / (z - rmin));

  return delta.mult(force / dist);
};

new P5(sketch);
