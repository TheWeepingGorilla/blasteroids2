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
		if ((thing.location.y > (p.height * topWrap)) && (thing.velocity.y > 0)) {
			thing.location.y = -p.height * topWrap;
			console.log("Y: " + thing.location.y + " Height: " + p.height);
		}
	}

	wrapBottom = function(thing) {
		if ((thing.location.y < (-p.height * bottomWrap)) && (thing.velocity.y < 0)) {
			thing.location.y = p.height * bottomWrap;
			console.log("Y: " + thing.location.y + " Height: " + p.height);
		}
	}

	wrapLeft = function(thing) {
		if ((thing.location.x < (-p.width * leftWrap)) && (thing.velocity.x < 0)) {
			thing.location.x = p.width * leftWrap;
			console.log("X: " + thing.location.x + " Width: " + p.width);
		}
	}

	wrapRight = function(thing) {
		if ((thing.location.x > (p.width * rightWrap)) && (thing.velocity.x > 0)) {
			thing.location.x = -p.width * rightWrap;
			console.log("X: " + thing.location.x + " Width: " + p.width);
		}
	}

	wrapCallibrate = function() {
		if ((p.width >= 1700) && (p.width < 1800)) {
			rightWrap = .59;
			leftWrap = .59;
		}
		if ((p.width >= 1600) && (p.width < 1700)) {
			rightWrap = .61;
			leftWrap = .61;
		}
		if ((p.width >= 1500) && (p.width < 1600)) {
			rightWrap = .66;
			leftWrap = .66;
		}
		if ((p.width >= 1400) && (p.width < 1500)) {
			rightWrap = .72;
			leftWrap = .72;
		}
		if ((p.width >= 1300) && (p.width < 1400)) {
			rightWrap = .77;
			leftWrap = .77;
		}
		if ((p.width >= 1200) && (p.width < 1300)) {
			rightWrap = .81;
			leftWrap = .81;
		}
		if ((p.width >= 1100) && (p.width < 1200)) {
			rightWrap = .91;
			leftWrap = .91;
		}
		if ((p.width >= 1000) && (p.width < 1100)) {
			rightWrap = 1.04;
			leftWrap = 1.04;
		}
		if ((p.width >= 900) && (p.width < 1000)) {
			rightWrap = 1.21;
			leftWrap = 1.21;
		}
		if ((p.width >= 800) && (p.width < 900)) {
			rightWrap = 1.33;
			leftWrap = 1.33;
		}
		if ((p.width >= 700) && (p.width < 800)) {
			rightWrap = 1.45;
			leftWrap = 1.45;
		}
		// Top & Bottom
		if ((p.height >= 700) && (p.height < 800)) {
			topWrap = 1.60;
			bottomWrap = 1.60;
		}
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
		wrapCallibrate();
		console.log(p.height);
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
		wrapCallibrate();
	}
};

var myp5 = new p5(s,'sketch0');