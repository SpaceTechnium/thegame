class Planet {
    // Arguments:
    // vectorPos			-> Position of one focus of the orbit (Sun Focus).
    // radius				-> Planet radius.
    // speed				-> Orbit Speed.
    // semiminor			-> Semiminor distance.
    // semimajor			-> Semimajor distance.
    // planet				-> Planet Object3D.

    constructor(vectorPos, radius, speed, semiminor, semimajor, planet) {
        this.vectorPos = vectorPos;
        this.radius = radius;
        this.speed = speed;
        this.semiminor = semiminor;
        this.semimajor = semimajor;
        this.planet = planet;
    }

    getSpeed() {
        return this.speed;
    }
    
    getSemiminor() {
        return this.semiminor;
    }

    getSemimajor() {
        return this.semimajor;
    }

    // Update planet position.
    update(tick) {
        this.planet.position.set(this.vectorPos.x + this.semiminor * Math.cos(tick * this.speed), this.vectorPos.z, this.vectorPos.y + this.semimajor * Math.sin(tick * this.speed));
    }
}