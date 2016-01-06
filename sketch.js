var s = function( p ) {
	var fps = 60;

	function Thing() {
		this.spin = p.createVector(0, 0, 0);
		this.spinAccumulator = 0;
		this.spinVelocity = 0;

		this.angle = 0;
		this.angularVelocity = 0;
		this.angularVelocityLimit = 0;

		this.location = p.createVector(0, 0, 0);
		this.velocity = p.createVector(0, 0, 0);
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

		this.setLocation = function(x, y, z) {
			this.location.x = x;
			this.location.y = y;
			this.location.z = z;
		}

		this.setVelocity = function(x,y,z) {
			this.velocity.x = x;
			this.velocity.y = y;
			this.velocity.z = z;
		}

		this.setSpin = function(x,y,z,velocity) {
			this.spin.x = x;
			this.spin.y = y;
			this.spin.z = z;
			this.spinVelocity = velocity;
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

	function TriangleShip(args) {
		Thing.call(this);

		this.spinAccumulator = 0;
		this.spin = p.createVector(1,1,0);
		this.size = args.size;
		this.height = args.height;
		this.id = 'TS' + args.id;
		this.thrust = [{strength: 0.2, directionOffset: 0}];
		this.rotation = {strength: Math.PI / 64, damping: .05, angularVelocityLimit: .2};

		this.drawMain = function() {
			p.fill('#d1e1e1');
			p.beginShape();
			p.vertex(40,0,0);
			p.vertex(-40,-20,0);
			p.vertex(-16,0,0);
			p.endShape();
			p.beginShape();
			p.vertex(40,0,0);
			p.vertex(-40,20,0);
			p.vertex(-16,0,0);
			p.endShape();
		}

		this.drawThrust = function() {
			p.beginShape();
 			p.vertex(-56,0,0);
 			p.vertex(-16,-8,0);
 			p.vertex(-16,8,0);
 			p.endShape();
		}
	}
	TriangleShip.prototype = Object.create(Thing.prototype);

	function Box(args) {
		Thing.call(this);

		this.spinAccumulator = 0;
		this.spin = p.createVector(1,1,0);
		this.size = args.size;

		this.drawMain = function() {
			p.box(this.size);
		}

	}
	Box.prototype = Object.create(Thing.prototype);

	function Player() {
		this.thrust = 87;
		this.rotateCounterclockwise = 65;
		this.rotateClockwise = 68;
		this.name = 'playerOne';
	}

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
		if ((p.width > 1700) && (p.width <= 1800)) {
			rightWrap = .59;
			leftWrap = .59;
		}
		if ((p.width > 1600) && (p.width <= 1700)) {
			rightWrap = .61;
			leftWrap = .61;
		}
		if ((p.width > 1500) && (p.width <= 1600)) {
			rightWrap = .66;
			leftWrap = .66;
		}
		if ((p.width > 1400) && (p.width <= 1500)) {
			rightWrap = .72;
			leftWrap = .72;
		}
		if ((p.width > 1300) && (p.width <= 1400)) {
			rightWrap = .65;
			leftWrap = .65;
		}
		if ((p.width > 1200) && (p.width <= 1300)) {
			rightWrap = .81;
			leftWrap = .81;
		}
		if ((p.width > 1100) && (p.width <= 1200)) {
			rightWrap = .91;
			leftWrap = .91;
		}
		if ((p.width > 1000) && (p.width <= 1100)) {
			rightWrap = 1.04;
			leftWrap = 1.04;
		}
		if ((p.width > 900) && (p.width <= 1000)) {
			rightWrap = 1.21;
			leftWrap = 1.21;
		}
		if ((p.width > 800) && (p.width <= 900)) {
			rightWrap = 1.33;
			leftWrap = 1.33;
		}
		if ((p.width > 700) && (p.width <= 800)) {
			rightWrap = 1.45;
			leftWrap = 1.45;
		}
		// Top & Bottom
		if ((p.height > 900) && (p.height <= 1000)) {
			topWrap = .65;
			bottomWrap = .65;
		}
		if ((p.height > 800) && (p.height <= 900)) {
			topWrap = .55;
			bottomWrap = .55;
		}
		if ((p.height > 700) && (p.height <= 800)) {
			topWrap = .75;
			bottomWrap = .75;
		}
		if ((p.height > 600) && (p.height <= 700)) {
			topWrap = .75;
			bottomWrap = .75;
		}
		if ((p.height > 500) && (p.height <= 600)) {
			topWrap = 1.80;
			bottomWrap = 1.80;
		}
		if ((p.height >= 400) && (p.height < 500)) {
			topWrap = 2.00;
			bottomWrap = 2.00;
		}
		if ((p.height >= 300) && (p.height < 400)) {
			topWrap = 3.00;
			bottomWrap = 3.00;
		}
		if ((p.height >= 200) && (p.height < 300)) {
			topWrap = 3.20;
			bottomWrap = 3.20;
		}
	}

	var players = [];
	players[0] = new Player();

	var objects = [];
	var largeBox = {size: 40};

	var levels = [];
	levels[0] = {top: wrapTop, left: wrapLeft, bottom: wrapBottom, right: wrapRight};
	var level = new Level(levels[0]);

	// var img;
	// function preload(){
	// 	img = loadImage(“path/to/img.jpg”);
	// }

	p.setup = function() {
		p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
		wrapCallibrate();
		console.log(p.height);

		objects[0] = new Box(largeBox);
		objects[0].setVelocity(0,0,0);
		objects[0].setSpin(1,1,.5,.1);
		objects[0].setLocation(-p.width * .25, 0, -200);
		objects[1] = new TriangleShip({id: 0, size: 20, height: 40});
		// objects[1].setVelocity(0,1,0);
		// objects[1].setSpin(2,1,.5,.1);
		objects[1].setLocation(p.width * .25 ,0,-200);
	};

	p.draw = function() {
		p.push();
		p.background(0);

		for (i=0; i<objects.length; i++) {
			p.push();
			p.translate(objects[i].location.x, objects[i].location.y, objects[i].location.z);
			p.rotate(objects[i].spinAccumulator, objects[i].spin);
			objects[i].drawMain();
			objects[i].move();
			level.checkBoundaries(objects[i]);
			p.pop();
		}
		p.pop();
	};

	// auto-resize canvas to window size
	p.windowResized = function() {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
		wrapCallibrate();
	}
};

var myp5 = new p5(s,'sketch0');