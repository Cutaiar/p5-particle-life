import P5 from "p5";
import "p5/lib/addons/p5.dom";

import { Particle, createRandomParticles } from "./Particle";

var sketch = (p: P5) => {
  let particles: Particle[];

  p.setup = () => {
    console.log("🚀 - Setup initialized - P5 is running");

    p.createCanvas(p.windowWidth, p.windowHeight);

    particles = createRandomParticles(p, 10);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    p.background(0);

    // Apply forces (very naive approach)
    // TODO: use  Barnes-Hut or something similar
    for (const p of particles) {
      for (const ip of particles) {
        // skip self
        if (p !== ip) {
          force(p, ip);
          force(ip, p);
          p.tick();
          ip.tick();
        }
        p.draw();
      }
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

//      | red | blue
// -----------------
// red  |  .    .
// blue |  .    .
//
// negative is attract, positive is repulse
// Convention: "rows force on col"
const attMatrix = [
  [0.0, -0.001],
  [0.001, 0.0],
];

const falloff = 50;

// applies force of p1 on p2 (not p2 to p1)
// TODO: universal repulsion
const force = (p1: Particle, p2: Particle) => {
  const forceValue = attMatrix[p1.color.index][p2.color.index]; // p1s force on p2

  const delta = P5.Vector.sub(p2.position, p1.position);
  const dir = delta.normalize();
  const distance = delta.mag();

  // apply force if particles are close enough
  if (distance < falloff) {
    p2.applyForce(dir.mult(forceValue));
  }
};

new P5(sketch);
