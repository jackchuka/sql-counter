var fireworks = function () {
	// defines some design constants
	const colors = {
		green: '#00ffd3',
		white: '#fff',
		yellow: '#f6cc00',
		blue: '#00c3f4',
		orange: '#ff8b26',
		magenta: '#ff2de3',
		red: '#f31250'
	};

	// linear easing path (1:1)
	const linearCurve = mojs.easing.path('M0, -100 C0, -100 100, 0 100, 0');

	// firework explosion blast
	let blast = new mojs.Shape({
		radius: {
			0: 'rand(100, 200)'
		},
		fill: 'transparent',
		stroke: colors.white,
		strokeWidth: {
			50: 0
		},
		opacity: {
			0.8: 0
		},
		duration: 700,
		isShowEnd: false,
		isForce3d: true
	});

	// firework explosion sparks
	let sparks = new mojs.Burst({
		count: 'rand(20, 50)',
		radius: {
			0: 'rand(100, 200)'
		},
		degree: 400,
		children: {
			fill: [colors.green, colors.white, colors.yellow],
			duration: 'rand(1000, 2000)',
			radius: {
				10: 0
			}
		},
		isShowEnd: false,
		isForce3d: true
	});

	// firework explosion trails
	let trails = new mojs.Burst({
		count: 'rand(20, 30)',
		radius: {
			0: 'rand(150, 250)'
		},
		degree: 400,
		children: {
			shape: 'line',
			stroke: [colors.green, colors.white, colors.yellow],
			strokeWidth: {
				5: 2
			},
			duration: 'rand(1500, 2500)',
			radius: {
				3: 'rand(50, 100)'
			}
		},
		isShowEnd: false,
		isForce3d: true,
	});

	// firework particles
	let particle = mojs.stagger(mojs.Burst);
	let particles = new particle({
		quantifier: 12,
		count: 'rand(5, 10)',
		children: {
			fill: colors.white,
			opacity: {
				1: 0,
				curve: linearCurve
			},
			duration: 'rand(1000, 2000)',
			radius: {
				'rand(3, 5)': 0
			},
			delay: 'rand(800, 1200)'
		},
		isShowEnd: false,
		isForce3d: true
	});

	// trajectory of the projectile
	let rocket = new mojs.ShapeSwirl({
		shape: 'circle',
		fill: colors.white,
		x: 'rand(-400, 400)',
		y: {
			200: 'rand(-100, -300)'
		},
		radius: 2,
		swirlSize: 3,
		swirlFrequency: 10,
		degreeShift: 'rand(-45, 45)',
		direction: -1,
		scale: {
			2: 0,
			curve: linearCurve
		},
		duration: 1400,
		easing: mojs.easing.quad.out,
		isShowEnd: false,
		isForce3d: true,
		onProgress: function (p) {

			// fixes a small bug
			if (Math.round(p * 100) < 5) {
				return;
			}

			// smoke of the projectile
			new mojs.Shape({
				x: rocket._props.x,
				y: rocket._props.y,
				fill: colors.yellow,
				radius: {
					1: 0,
					curve: linearCurve
				},
				duration: 500,
				delay: 'stagger(10, 250)',
				isShowEnd: false,
				isForce3d: true,
				onComplete: function () {
					this.el.parentNode.removeChild(this.el);
				}
			}).play();
		},
		onComplete: function () {
			let x = parseInt(rocket._props.x.replace('px', ''));
			let y = parseInt(rocket._props.y.replace('px', ''));
			let r = trails._props.radius;

			sparks.tune({
				x: x,
				y: y
			}).generate().replay();

			blast.tune({
				x: x,
				y: y
			}).generate().replay();

			trails.tune({
				x: x,
				y: y
			}).generate().replay();

			particles.tune({
				x: 'rand(' + (x - 100) + ', ' + (x + 100) + ')',
				y: 'rand(' + (y - 100) + ', ' + (y + 100) + ')',
				radius: 'stagger(rand(0, ' + r * 0.2 + '), 1)'
			}).play();

			setTimeout(function () {
				rocket.generate().play();
			}, Math.floor((Math.random() * 2200) + 1800));
		}
	});

	// creates the timeline
	const timeline = new mojs.Timeline();

	// adds shapes to the timeline
	timeline.add(
		rocket,
	);

	document.querySelector('body').classList.add('go');

	// plays the timeline
	setTimeout(function () {
		timeline.play();
	}, 1000);

	// creates a color palette
	let effect = [
		colors.green,
		colors.blue,
		colors.yellow,
		colors.orange,
		colors.magenta,
		colors.red
	];

	// allows user interaction
	setTimeout(function () {
		window.pipe = 0;

		document.querySelector('body').addEventListener('click', function (e) {
			if (window.pipe > 4) {
				return;
			}

			new mojs.Shape({
				left: e.clientX,
				top: e.clientY,
				radius: {
					0: 'rand(50, 100)'
				},
				fill: 'transparent',
				stroke: colors.white,
				strokeWidth: {
					10: 0
				},
				opacity: {
					0.8: 0
				},
				duration: 700,
				isShowEnd: false,
				isForce3d: true,
				onComplete: function () {
					this.el.parentNode.removeChild(this.el);
				}
			}).play();

			new mojs.Burst({
				left: e.clientX,
				top: e.clientY,
				count: 'rand(10, 15)',
				radius: {
					0: 'rand(100, 200)'
				},
				children: {
					shape: 'line',
					stroke: [effect[Math.floor(Math.random() * effect.length)], colors.white],
					duration: 'rand(1000, 1500)',
					radius: {
						5: 'rand(50, 100)'
					}
				},
				isShowEnd: false,
				isForce3d: true,
				onComplete: function () {
					this.el.parentNode.removeChild(this.el);
					window.pipe--;
				}
			}).play();

			window.pipe++;
		});
	}, 7000);
};