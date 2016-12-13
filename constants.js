function Constants() {
	this.canvas = {
		width: 500,
		height: 500,
	};
	this.speeds = {
		slow: {
			speed: 150,
			frames: 50,
		},
		normal: {
			speed: 75,
			frames: 20,
		},
		fast: {
			speed: 10,
			frames: 5,
		},
	};
	this.solution = {
		attempts: 5,
	}
}