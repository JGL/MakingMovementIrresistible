// Initial code duplicated from:
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com
// Flock object
// Does very little, simply manages the array of all the boids
// https://github.com/nature-of-code/noc-examples-p5.js/tree/master/chp06_agents/NOC_6_09_Flocking

class Flock {
  constructor() {
    // An array for all the boids
    this.boids = []; // Initialize the array
  }

  run() {
    for (let boid of this.boids) {
      boid.run(this.boids); // Passing the entire list of boids to each boid individually
    }
  }

  addBoid(b) {
    this.boids.push(b);
  }
}
