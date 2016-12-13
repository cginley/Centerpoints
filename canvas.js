/***************************************************************************
* canvas
*
* Description:
*	Used as input for creating a p5 object, which draws in this canvas
*
* Args:
*	c - a P5 object
***************************************************************************/
function canvas(c) {
	c.componenets = [];
	c.animationspeed = window.constants.speeds.normal.speed;
	c.animationframes = window.constants.speeds.normal.frames;
	c.animationcontroller;
	c.animationdrawer;
	c.issolution = false;

	/***********************************************************************
	* setup
	*
	* Description:
	*	Runs once on load. Defines initial environment properties and sets
	*	up the drawing area and associated buttons.
	***********************************************************************/
	c.setup = function() {
		c._pointset = new PointSet();
		c._selectedpoint = null;
		c.displayWidth = window.constants.canvas.width;
		c.displayHeight = window.constants.canvas.height;
		c.attempts = 0;

		var mycanvas = c.createCanvas(c.displayWidth, c.displayHeight);
		mycanvas.parent('maincanvas');

		// Set up the pointset input
		var numpoints = $('#numpoints');
		numpoints.change(function() {
			window.myp5.setPointset(this.value);
		});

		// Set up the show solution button
		var solutionbutton = c.createButton('Show Solution');
		solutionbutton.id('solutionbutton');
		solutionbutton.parent('input');
		solutionbutton.mousePressed(c.playSolutionAnimation);

		// Set up the clear button
		var resetbutton = c.createButton('Reset');
		resetbutton.id('resetbutton');
		resetbutton.parent('input');
		resetbutton.mousePressed(c.reset);


		// Set up the speed buttons
		$('input[type=radio][name=speed]').change(function () {
			if (this.value == 'noanimation') {
				return;
			}
			var animationspeeds = window.constants.speeds[this.value];
        	window.myp5.setAnimationSpeed(animationspeeds.speed, animationspeeds.frames);
    	});

		c.reset();

		return;
	};

	/***********************************************************************
	* mousePressed
	*
	* Description:
	*	Runs each time the user clicks on the screen.  If the user clicks
	*	inside of the drawing canvas, a point will be added and the centroid
	*	of the pointset will be redrawn.
	***********************************************************************/
	c.mousePressed = function() {
		var x = c.mouseX;
		var y = c.mouseY;

		// Only consider mouseclicks which are inside of the canvas
		if (x < 0 || x > c.displayWidth || y < 0 || y > c.displayHeight) {
			return;
		}

		c._selectedpoint = new Point(x, y);

		c.stopAnimation();
		c.clearBackground();
		c.clearCounts();

		// Check if we should allow the user to show the solution
		c.attempts++;
		if (c.attempts >= window.constants.solution.attempts) {
			c.enableSolutionButton();
		}

		// Check if this is a solution
		var centerpointline = c._pointset.findCenterPointCounterExample(c._selectedpoint);
		if (centerpointline) {
			var clockwise = c._pointset.halfSpacePointCount(centerpointline);
			var endpoints = centerpointline.getEndPoints(0, c.displayWidth, 0, c.displayHeight);
			var p1 = endpoints[0];
			var p2 = endpoints[1];

			// Fill in the counts
			if ((p1.y == 0 && p2.y == c.displayHeight)
			 || (p1.y == 0 && p2.x == c.displayWidth)
			 || (p1.y == 0 && p2.x == 0)
			 || (p1.x == 0 && p2.y == c.displayHeight)
			 || (p1.x == c.displayWidth && p2.y == c.displayHeight)
			 || (p1.x == 0 && p2.x == c.displayWidth && p1.y < p2.y)
			 || (p1.x == c.displayWidth && p2.x == 0 && p1.y < p2.y)
			) {
				c.setRightCount(clockwise);
				c.setLeftCount(c._pointset._size - clockwise);
			}
			else {
				c.setLeftCount(clockwise);
				c.setRightCount(c._pointset._size - clockwise);
			}
			
			c.drawLine(centerpointline);
			c.issolution = false;
			c.drawForeground();
		} 
		else {
			c.issolution = true;
			c.playSolutionAnimation();
		}

		return;
	}


	/***********************************************************************
	* setAnimationSpeed
	*
	* Description:
	*	Sets the speed of the animation
	*
	* Args:
	*	ms - the number of milliseconds between each frame
	*	frames - the number of frames required to rotate from one point to
	*		the next
	***********************************************************************/
	c.setAnimationSpeed = function(ms, frames) {
		c.animationspeed = ms;
		c.animationframes = frames;
		return;
	}

	/***********************************************************************
	* stopAnimation
	*
	* Description:
	*	Stops the animation from running
	*
	* Args:
	*	None
	***********************************************************************/
	c.stopAnimation = function() {
		if (c.animationcontroller) {
			c.animationcontroller.reject();
		}
		if (c.animationdrawer) {
			clearInterval(c.animationdrawer);
		}
		return;
	}

	/***********************************************************************
	* reset
	*
	* Description:
	*	Clears the canvas and removes all of the points from the pointset.
	***********************************************************************/
	c.reset = function() {
		c.stopAnimation();
		c.resetSolutionButton();
		c.clearCounts();
		c.clearMinCounts();
		c.clearCanvas();
		$('#numpoints').val('');

		return;
	}

	/***********************************************************************
	* resetSolutionButton
	*
	* Description:
	*	Resets the solution button
	***********************************************************************/
	c.resetSolutionButton = function() {
		c.attempts = 0;
		$('#solutionbutton').prop('disabled', true);
		return;
	}

	/***********************************************************************
	* enableSolutionButton
	*
	* Description:
	*	Allows the user to use the solution button
	***********************************************************************/
	c.enableSolutionButton = function() {
		$('#solutionbutton').prop('disabled', false);
		return;
	}

	/***********************************************************************
	* drawBackground
	*
	* Description:
	*	Redraws the canvas to only contain the background objects
	***********************************************************************/
	c.drawBackground = function() {
		c.background(255);
		for (var i = 0; i < c.componenets.length; i++) {
			c.drawHalfSpace(c.componenets[i]);
		}
		return;
	}

	/***********************************************************************
	* clearBackground
	*
	* Description:
	*	Clears everything in the background of the canvas
	***********************************************************************/
	c.clearBackground = function() {
		c.componenets = [];
		c.redrawCanvas();
		return;
	}

	/***********************************************************************
	* drawForeground
	*
	* Description:
	*	Redraws the foreground objects on the canvas
	***********************************************************************/
	c.drawForeground = function() {
		c.drawPointSet(c._pointset);

		// Draw the selected point
		if (c._selectedpoint) {
			c.issolution ? c.fill(0, 255, 0) : c.fill(255, 0, 0);
			c.stroke(0);
			c.strokeWeight(2);
			c.ellipse(c._selectedpoint.x, c._selectedpoint.y, 8, 8);
			c.strokeWeight(1);
		}
		return;
	}

	/***********************************************************************
	* clearForeground
	*
	* Description:
	*	Clears everything in the foreground of the canvas
	***********************************************************************/
	c.clearForeground = function() {
		c._pointset = new PointSet();
		c._selectedpoint = null;
		c.redrawCanvas();
		return;
	}

	/***********************************************************************
	* redrawCanvas
	*
	* Description:
	*	Redraws the canvas to only contain the background and foregroundobjects
	***********************************************************************/
	c.redrawCanvas = function() {
		c.drawBackground();
		c.drawForeground();
		return;
	}

	/***********************************************************************
	* clearCanvas
	*
	* Description:
	*	Redraws the canvas to only contain the background and foregroundobjects
	***********************************************************************/
	c.clearCanvas = function() {
		c.clearBackground();
		c.clearForeground();
		return;
	}

	/***********************************************************************
	* clearCounts
	*
	* Description:
	*	Clears the count circles
	***********************************************************************/
	c.clearCounts = function() {
		$('#leftcount').html('');
		$('#rightcount').html('');
		return;
	}

	/***********************************************************************
	* setLeftCount
	*
	* Description:
	*	Sets the number displayed in the left circle
	***********************************************************************/
	c.setLeftCount = function(num) {
		$('#leftcount').html(num);
		return;
	}

	/***********************************************************************
	* setRightCount
	*
	* Description:
	*	Sets the number displayed in the right circle
	***********************************************************************/
	c.setRightCount = function(num) {
		$('#rightcount').html(num);
		return;
	}

	/***********************************************************************
	* clearMinCounts
	*
	* Description:
	*	Clears the minimum values under the count circles
	***********************************************************************/
	c.clearMinCounts = function() {
		$('#leftmin').html(' ');
		$('#rightmin').html(' ');
		return;
	}

	/***********************************************************************
	* setMinCounts
	*
	* Description:
	*	Sets the number displayed below the count circles
	***********************************************************************/
	c.setMinCounts = function(num) {
		$('#leftmin').html('at least ' + num);
		$('#rightmin').html('at least ' + num);
		return;
	}

	/***********************************************************************
	* setPointset
	*
	* Description:
	*	Clears the canvas and places a new random collection of points 
	*	on the canvas
	*
	* Args:
	*	num - the number of random points to place on the canvas
	***********************************************************************/
	c.setPointset = function(num) {
		c.stopAnimation();
		c.clearCanvas();
		c.resetSolutionButton();

		c._pointset = new PointSet();
		c._pointset.generateRandomPoints(num, 0, c.displayWidth, 0, c.displayHeight);
		c.setMinCounts(Math.ceil(num/3));
		c.redrawCanvas();
		return;
	}

	/***********************************************************************
	* playSolutionAnimation
	*
	* Description:
	*	Plays the animation which reveals the polygon which all centerpoints
	*	of the pointset lie in.
	*
	* Args:
	*	none
	***********************************************************************/
	c.playSolutionAnimation = function() {
		c.stopAnimation();
		c.clearBackground();
		c.enableSolutionButton();

		// No solution to show if there is no pointset
		if (c._pointset._size == 0) {
			return;
		}

		var minypoint = c._pointset.getMinYPoint();
		var minyline = new Line(minypoint, new Point(minypoint.x + 1, minypoint.y));

		var halfspaces = c._pointset.getCenterPointBoundaries();
		halfspaces.unshift(minyline);

		c.scanToY(minypoint.y, halfspaces).done(c.rotateLineList);

		return;
	}

	/***********************************************************************
	* scanToY
	*
	* Description:
	*	Animates a horizontal line scanning from y = 0 to the yval specified
	*
	* Args:
	*	yval - the y value to scan to
	*	halfspaces - the list of halfspaces to be passed to the deferred
	*		object's resolve at the end of this animation (usually for
	*		c.rotateLineList)
	***********************************************************************/
	c.scanToY = function(yval, halfspaces) {
		c.animationcontroller = $.Deferred();
		var i = 1;
		c.animationdrawer = setInterval(function() {
			c.drawBackground();
			var l = new Line(new Point(0, i / c.animationframes * yval), new Point(c.displayWidth, i / c.animationframes * yval));
			c.drawHalfSpace(l);
			c.drawForeground();

			// Finish the animation
			if (i >= c.animationframes) {
				clearInterval(c.animationdrawer);
				c.animationcontroller.resolve(halfspaces);
			}
			i++;
		}, c.animationspeed);

		return c.animationcontroller;
	}

	/***********************************************************************
	* rotateLineList
	*
	* Description:
	*	wrapper around _rotateLineList
	***********************************************************************/
	c.rotateLineList = function(lines) {
		c._rotateLineList(lines, 0);
		return;
	}

	/***********************************************************************
	* _rotateLineList
	*
	* Description:
	*	Animates a line rotation from each line in the list to the next
	*
	* Args:
	*	lines - an array of Line objects
	*	index - the index in the array that the animation is currentlly at
	***********************************************************************/
	c._rotateLineList = function(lines, index) {
		// If we have reached the end of the list, we can exit
		if (index == (lines.length - 1)) {
			return;
		}
		// Create a new deferred object
		c.animationcontroller = $.Deferred();
		// Rotate the line
		c.lineRotation(lines[index], lines[index+1], lines, index);

		// When the rotation is done, rotate the next line (recursive here)
		c.animationcontroller.done(function(c, lines, index) {
			c._rotateLineList(lines, index + 1);
		});
		return;
	}

	/***********************************************************************
	* lineRotation
	*
	* Description:
	*	Animates a line rotating on the canvas.  It rotates the direction which
	*	is the shortest
	*
	* Args:
	*	startline - A line object representing where the animation will start
	*	endline - A line object representing where the animation will end
	*
	* Args used if this is being called from _rotateLineList
	*	lines - an array of Line objects
	*	index - the index in the array that the animation is currentlly at
	***********************************************************************/
	c.lineRotation = function(startline, endline, lines, index) {
		c.componenets.push(startline);
		var intersection = startline.getIntersection(endline);
		if (!intersection) {
			return;
		}
		var startunit = startline.unitVector();
		var endunit = endline.unitVector();
		var p1 = new Point(intersection.x + startunit.x, intersection.y + startunit.y);
		var p2 = new Point(intersection.x + endunit.x, intersection.y + endunit.y);

		// Make sure we are rotating in the clockwise direction
		if (window.GeomUtil.orient(p1, intersection, p2) == 1) {
			p2 = new Point(intersection.x + -1 * endunit.x, intersection.y + -1 * endunit.y);
		}

		var l1 = new Line(intersection, p1);
		var l2 = new Line(intersection, p2);

		lines[index + 1] = l2;

		var direction = new Vector(l2._point2.x - l1._point2.x, l2._point2.y - l1._point2.y);
		var newline = l1;

		var i = 1;
		c.animationdrawer = setInterval(function() {
			c.drawBackground();
			newline = new Line(newline._point1, new Point(newline._point2.x + .1 * direction.x, newline._point2.y + .1 * direction.y));
			c.drawHalfSpace(newline);
			c.drawForeground();

			if (i == 10) {
				clearInterval(c.animationdrawer);
				c.animationcontroller.resolve(c, lines, index);
			}
			i++;
		}, c.animationspeed);

		return;
	}

	/***************************************************************************
	* drawPointset
	*
	* Description:
	*	Draws a collection of points onto a canvas
	*
	* Args:
	*	ps - a PointSet object
	*
	* Returns:
	*	Null
	***************************************************************************/
	c.drawPointSet = function(ps) {
		c.fill(0);
		c.stroke(0);
		for (var i = 0; i < ps._size; i++) {
			var p = ps._points[i];
			c.ellipse(p.x, p.y, 5, 5);
		}
		return;
	}

	/***************************************************************************
	* drawLine
	*
	* Description:
	*	draws a line onto a canvas
	*
	* Args:
	*	line - a Line object
	*
	* Returns:
	*	Null
	***************************************************************************/
	c.drawLine = function(line) {
		var verticies = line.getEndPoints(0, c.displayWidth, 0, c.displayHeight);

		c.stroke(255, 0, 0);
		c.strokeWeight(2);
		c.line(verticies[0].x, verticies[0].y, verticies[1].x, verticies[1].y);
		c.strokeWeight(1);

		return;
	}

	/***************************************************************************
	* drawHalfSpace
	*
	* Description:
	*	draws this line onto a canvas with the clockwise halfspace shaded in
	*
	* Args:
	*	line - a Line object defining this halfspace
	*
	* Returns:
	*	Null
	***************************************************************************/
	c.drawHalfSpace = function(line) {
		var width = c.displayWidth;
		var height = c.displayHeight;
		
		var verticies = line.getEndPoints(0, c.displayWidth, 0, c.displayHeight);

		var ccw = window.GeomUtil.orient;

		// Find which corners are on the clockwise side
		if (ccw(line._point1, line._point2, new Point(0, 0)) == -1) {
			verticies.push(new Point(0, 0));
		}
		if (ccw(line._point1, line._point2, new Point(0, height)) == -1) {
			verticies.push(new Point(0, height));
		}
		if (ccw(line._point1, line._point2, new Point(width, 0)) == -1) {
			verticies.push(new Point(width, 0));
		}
		if (ccw(line._point1, line._point2, new Point(width, height)) == -1) {
			verticies.push(new Point(width, height));
		}

		// Make sure all the points are in ccw order, with insertion sort
		for (var i = 0; i < (verticies.length - 2); i++) {
			for (var j = i; j < (verticies.length - 2); j++) {
				if (ccw(verticies[i], verticies[j+1], verticies[j+2]) == 1) {
					var temp = verticies[j+1];
					verticies[j+1] = verticies[j+2];
					verticies[j+2] = temp;
				}
			}
		}

		// Draw the shape
		c.stroke(0);
		c.fill(255, 100, 100);

		c.beginShape();
		for (var i = 0; i < (verticies.length); i++) {
			c.vertex(verticies[i].x, verticies[i].y);
		}
		c.endShape(c.CLOSE);

		return;
	}
};