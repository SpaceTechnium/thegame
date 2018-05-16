// ========================================================
// solarSystem.js
//=========================================================
// Solar system generation constants
const SOLAR_SYSTEM_W 	= 15;
const SOLAR_SYSTEM_H 	= 15;
const SEMI_MAJOR		= 35;
const SEMI_MINOR		= 35;
const SEMI_MAJOR_OFFSET	= 10;
const SEMI_MINOR_OFFSET	= 10;
const PLANET_MIN_SPEED  = 0.00001;
const PLANET_MAX_SPEED  = 0.00009;
const PLANET_MIN_RADIUS = 0.1;
const PLANET_MAX_RADIUS = 5;
const MIN_PLANETS_IN_SYSTEM = 1;
const MAX_PLANETS_IN_SYSTEM = 10;
const SYSTEM_X_DIST     = 100;
const SYSTEM_Y_DIST     = 100;
const SYSTEM_DIST_MAX_HEIGHT_DIFF = 300;
const SYSTEM_GLOBAL_HEIGHT_VARIATION = 50;
const SUN_MIN_RADIUS    = 1;
const SUN_MAX_RADIUS    = 30;

class SolarSystem {
    // Arguments:
    // vectorPos			-> Position of center (Sun).
    // numPlanets			-> Number of planets.
    // arrayPlanets			-> Array with info about planets [radius, rotationSpeed, semiminor, semimajor, ...] with a size of numPlanets * 4.
    // sunRadius			-> value that is used as the Sun's radius.

    constructor(vectorPos, numPlanets, infoPlanets, sunRadius) {
        this.pos = vectorPos;
        this.numPlanets = numPlanets;
        this.infoPlanets = infoPlanets;
        this.sunRadius = sunRadius;
        this.arrayPlanets = [];
        this.sun = null;
    }
      
    spawn(scene, randomizer) {
        // Spawn Sun.
        this.sun = new THREE.Mesh( new THREE.SphereGeometry( this.sunRadius, 16, 16 ), new THREE.MeshToonMaterial( {color: new THREE.Color( 1, 0.85 + randomizer.genrand_real1() * 0.15, 0.15 + randomizer.genrand_real1() * 0.85 )} ) );
        this.sun.position.set(this.pos.x, this.pos.z, this.pos.y);
        scene.add(this.sun);

        // Spawn Planets
        for (var i = 0; i < this.numPlanets; i++) {
            var planet = new THREE.Mesh(
                new THREE.SphereGeometry(
                    this.infoPlanets[i*4], 16, 16),
                    new THREE.MeshToonMaterial(
                        {color: new THREE.Color(
                            randomizer.genrand_real1() / 4,
                            randomizer.genrand_real1() / 2,
                            randomizer.genrand_real1() / 2 )
                        }
                    )
                );
            this.arrayPlanets.push(new Planet(this.pos, this.infoPlanets[i*4], this.infoPlanets[i*4+1], this.infoPlanets[i*4+2], this.infoPlanets[i*4+3], planet));
            scene.add(planet);
        }

    }

    // Update Planets.
    update() {
        for (var i = 0; i < this.numPlanets; i++) {
            this.arrayPlanets[i].update();
        }
    }

}

class Universe {
    constructor() {
        this.solarSystems = [];
    }
    
    generate(randomizer) {
        for (var i = 0; i < SOLAR_SYSTEM_W; i++) {
            for (var j = 0; j < SOLAR_SYSTEM_H; j++) {
                var semiminor = SEMI_MINOR, semimajor = SEMI_MAJOR;
                var numPlanets = MIN_PLANETS_IN_SYSTEM + (randomizer.genrand_int31() % MAX_PLANETS_IN_SYSTEM);
                var infoPlanets = [];
    
                for (var k = 0; k < numPlanets; k++) {
                    infoPlanets.push(PLANET_MIN_RADIUS + (randomizer.genrand_int31() % PLANET_MAX_RADIUS)); 
                    infoPlanets.push(PLANET_MIN_SPEED + (randomizer.genrand_real1() * PLANET_MAX_SPEED));
                    infoPlanets.push(semiminor + (randomizer.genrand_real1() * k));
                    infoPlanets.push(semimajor + (randomizer.genrand_real1() * k));
                    semiminor += SEMI_MINOR_OFFSET;
                    semimajor += SEMI_MAJOR_OFFSET;
                }
                this.solarSystems.push(
                    new SolarSystem(
                        new THREE.Vector3(
                            i*SYSTEM_X_DIST + (randomizer.genrand_int31() % MAX_PLANETS_IN_SYSTEM) - SOLAR_SYSTEM_W * (SYSTEM_X_DIST/2),
                            j*SYSTEM_Y_DIST + (randomizer.genrand_int31() % MAX_PLANETS_IN_SYSTEM) - SOLAR_SYSTEM_H * (SYSTEM_Y_DIST/2),
                            (((i+j)%4) - 2) * (randomizer.genrand_int31() % SYSTEM_DIST_MAX_HEIGHT_DIFF) + (randomizer.genrand_int31() % SYSTEM_GLOBAL_HEIGHT_VARIATION) - (SYSTEM_GLOBAL_HEIGHT_VARIATION)),
                        numPlanets,
                        infoPlanets,
                        SUN_MIN_RADIUS + (randomizer.genrand_int31() % SUN_MAX_RADIUS)
                    )
                );
            }
        }
    }

    spawn(scene, randomizer) {
        for (var i = 0; i < (SOLAR_SYSTEM_W * SOLAR_SYSTEM_H); i++)
            this.solarSystems[i].spawn(scene, randomizer);
    }

    update() {
        // Update Solar Systems.
        for (var i = 0; i < (SOLAR_SYSTEM_W * SOLAR_SYSTEM_H); i++)
            this.solarSystems[i].update();
    }
}
