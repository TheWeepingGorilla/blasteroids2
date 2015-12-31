var s = function( p ) {
	var fps = 60;

	function Thing() {
		this.spin = p.createVector(0, 0, 0);
		this.spinAccumulator = 0;
		this.spinVelocity = 0;

		this.angle = 0;
		this.angularVelocity = 0;
		this.angularVelocityLimit = 0;

		this.location = p.createVector(0, 0);
		this.velocity = p.createVector(0, 0);
		this.thrust = 0;

		this.controller = 'program';
		this.radius = 7; // collision detection radius

		this.explosionFrame = 0;
		this.explosionDuration = 60;
		this.exploding = false;
		this.remove = false;

		this.explosion = function() {
			this.explosionAnimation(this.explosionFrame);
			this.explosionFrame += 1;
			if (this.explosionFrame >= this.explosionDuration) {
				this.explosionFrame = 0;
				this.exploding = false;
				this.remove = true;
			}
		}

this.explosionAnimation = function(frame) {
			if (frame < 20) {
				p.noStroke();
  			for (j = 0; j < 10; j++) {
  				p.ellipse(0, 0, frame, frame * 2.5);
  				p.rotate(p.PI/5);
  			}
			}
			if ((frame >= 20) && (frame < 40)) {
				p.noStroke();
  			for (j = 0; j < 10; j++) {
  				p.ellipse(0, 0, 20, 50);
  				p.rotate(p.PI/5);
  			}
			}
			if ((frame >= 40) && (frame < 45)) {
				p.noStroke();
				for (j = 0; j < 10; j++) {
  				p.ellipse(0, 0, 20 - ((frame - 40) * 4), 50 - ((frame - 40) * 10));
  				p.rotate(p.PI/5);
  			}
			}
		}

		this.setLocation = function(x, y) {
			this.location.x = x;
			this.location.y = y;
		}

		this.applyThrust = function() {
			var x = p.cos(this.angle);
			var y = p.sin(this.angle);
			var vecToAdd = p.createVector(x,y);
			vecToAdd.rotate(this.thrust[0].directionOffset);
			vecToAdd.mult(this.thrust[0].strength);
			this.velocity = this.velocity.add(vecToAdd);
		}

		this.rotate = function(direction) {
			this.angularVelocity = this.angularVelocity + (this.rotation.strength * direction);
			if (Math.abs(this.angularVelocity) >= this.rotation.angularVelocityLimit) {
				if (this.angularVelocity <= 0) {
					this.angularVelocity = -this.rotation.angularVelocityLimit;
				}
				else {
					this.angularVelocity= this.rotation.angularVelocityLimit;
				}
			}
		}

		this.rotationDamping = function() {
			if (this.angularVelocity > 0) {
				this.angularVelocity = this.angularVelocity - this.rotation.damping;
				if (this.angularVelocity <= 0) {
					this.angularVelocity = 0;
				}
			}
			if (this.angularVelocity < 0) {
				this.angularVelocity = this.angularVelocity + this.rotation.damping;
				if (this.angularVelocity >= 0) {
					this.angularVelocity = 0;
				}
			}
		}

		this.move = function() {
			this.angle = this.angle + this.angularVelocity;
			this.location = this.location.add(this.velocity);
			this.spinAccumulator += this.spinVelocity;
		}
	}

	function Box(size) {
		Thing.call(this);

		this.spinAccumulator = 0;
		this.spin = p.createVector(1,1,0);
		this.size = size;

		this.drawMain = function() {
			p.box(this.size);
		}
	}
	Box.prototype = Object.create(Thing.prototype);

	function Level(args) {
		this.top = args.top;
		this.left = args.left;
		this.bottom = args.bottom;
		this.right = args.right;

		this.checkBoundaries = function(thing) {
			this.top(thing);
			this.left(thing);
			this.bottom(thing);
			this.right(thing);
		}
	}

	wrapTop = function(thing) {
		if (thing.location.y > p.windowHeight) {
		  thing.location.y = -p.windowHeight;
		};
	}

	wrapBottom = function(thing) {
		if (objects[i].location.y < -p.windowHeight) {
		  objects[i].location.y = p.windowHeight;
		};
	}

	wrapLeft = function(thing) {
		if (objects[i].location.x < -p.windowWidth) {
	    objects[i].location.x = p.windowWidth;
		};
	}

	wrapRight = function(thing) {
		if (objects[i].location.x > p.windowWidth) {
	    objects[i].location.x = -p.windowWidth;
		};
	}

	var objects = [];
	objects[0] = new Box(50);
	objects[0].velocity.x = 0;
	objects[0].velocity.y = -4;
	objects[0].spin.x = 1;
	objects[0].spin.y = 1;
	objects[0].spin.z = 0;
	objects[0].spinVelocity = .1;

	var levels = [];
	levels[0] = {top: wrapTop, left: wrapLeft, bottom: wrapBottom, right: wrapRight};
	var level = new Level(levels[0]);

	p.setup = function() {
  	p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
  	p.ortho(-p.width, p.width, p.height, -p.height, 0.1, 100);
	};

	p.draw = function() {
		p.background(0);

  	for (i=0; i<objects.length; i++) {
	  	p.translate(objects[i].location.x, objects[i].location.y, objects[i].location.z);
	  	p.rotate(objects[i].spinAccumulator, objects[i].spin);
	  	objects[i].drawMain();
	  	objects[i].move();
	 		level.checkBoundaries(objects[i]);
		}
	};

	// auto-resize canvas to window size
	p.windowResized = function() {
  	p.resizeCanvas(p.windowWidth, p.windowHeight);
	}
};

var myp5 = new p5(s,'sketch0');