/*******************************************************************************
* Canvas
*
* Description:
*	An object that represents a drawing area
*******************************************************************************/
function Canvas() {

	/***************************************************************************
	* pfive
	*
	* Description:
	*	Used as input for creating a p5 object, which draws in this canvas
	*
	* Args:
	*	c - a P5 object
	***************************************************************************/
	this.pfive = function(c) {
		c.componenets = [];
		c.animationspeed = 75;
		c.animationframes = 20;
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
			c.displayWidth = 500;
			c.displayHeight = 500;
			c.attempts = 0;

			var mycanvas = c.createCanvas(c.displayWidth, c.displayHeight);
			mycanvas.parent('maincanvas');

			// Set up the pointset input
			var numpoints = $('#numpoints');
			numpoints.change(function() {
				window.myp5.setpointset(this.value);
			});

			// Set up the show solution button
			var solutionbutton = c.createButton('Show Solution');
			solutionbutton.id('solutionbutton');
			solutionbutton.parent('input');
			solutionbutton.mousePressed(c.playsolutionanimation);

			// Set up the clear button
			var resetbutton = c.createButton('Reset');
			resetbutton.id('resetbutton');
			resetbutton.parent('input');
			resetbutton.mousePressed(c.reset);


			// Set up the speed buttons
			$('input[type=radio][name=speed]').change(function () {
					var speed;
					var frames;
					if (this.value == 'slow') {
						speed = 150;
						frames = 50;
					}
					else if (this.value == 'normal') {
						speed = 75;
						frames = 20;
					}
					else if (this.value == 'fast') {
						speed = 10;
						frames = 5;
					}
					else {
						return;
					}
		        	window.myp5.setanimationspeed(speed, frames);
		        });
			c.reset();
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

			c.stopanimation();
			c.clearbackground();

			// Check if we should allow the user to show the solution
			c.attempts++;
			if (c.attempts >= 5) {
				c.enablesolutionbutton();
			}

			// Check if this is a solution
			var centerpointline = c._pointset.findcentercounterline(c._selectedpoint);
			if (centerpointline) {
				centerpointline.draw(c);
				c.issolution = false;
				c.drawforeground();
			} else {
				c.issolution = true;
				c.playsolutionanimation();
			}
		}


		/***********************************************************************
		* setanimationspeed
		*
		* Description:
		*	Sets the speed of the animation
		*
		* Args:
		*	ms - the number of milliseconds between each frame
		*	frames - the number of frames required to rotate from one point to
		*		the next
		***********************************************************************/
		c.setanimationspeed = function(ms, frames) {
			c.animationspeed = ms;
			c.animationframes = frames;
		}

		/***********************************************************************
		* stopanimation
		*
		* Description:
		*	Stops the animation from running
		*
		* Args:
		*	None
		***********************************************************************/
		c.stopanimation = function() {
			if (c.animationcontroller) {
				c.animationcontroller.reject();
			}
			if (c.animationdrawer) {
				clearInterval(c.animationdrawer);
			}
		}

		/***********************************************************************
		* reset
		*
		* Description:
		*	Clears the canvas and removes all of the points from the pointset.
		***********************************************************************/
		c.reset = function() {
			c.stopanimation();
			c.resetsolutionbutton();
			c.clearcanvas();
			$('#numpoints').val('');
		}

		/***********************************************************************
		* resetsolutionbutton
		*
		* Description:
		*	Resets the solution button
		***********************************************************************/
		c.resetsolutionbutton = function() {
			c.attempts = 0;
			$('#solutionbutton').prop('disabled', true);
		}

		/***********************************************************************
		* enablesolutionbutton
		*
		* Description:
		*	Allows the user to use the solution button
		***********************************************************************/
		c.enablesolutionbutton = function() {
			$('#solutionbutton').prop('disabled', false);
		}

		/***********************************************************************
		* drawbackground
		*
		* Description:
		*	Redraws the canvas to only contain the background objects
		***********************************************************************/
		c.drawbackground = function() {
			c.background(255);
			for (var i = 0; i < c.componenets.length; i++) {
				c.componenets[i].drawhalfspace(c);
			}
		}

		/***********************************************************************
		* clearbackground
		*
		* Description:
		*	Clears everything in the background of the canvas
		***********************************************************************/
		c.clearbackground = function() {
			c.componenets = [];
			c.redrawcanvas();
		}

		/***********************************************************************
		* drawforeground
		*
		* Description:
		*	Redraws the foreground objects on the canvas
		***********************************************************************/
		c.drawforeground = function() {
			c._pointset.draw(c);

			// Draw the selected point
			if (c._selectedpoint) {
				c.issolution ? c.fill(0, 255, 0) : c.fill(255, 0, 0);
				c.stroke(0);
				c.strokeWeight(2);
				c.ellipse(c._selectedpoint.x, c._selectedpoint.y, 8, 8);
				c.strokeWeight(1);
			}
		}

		/***********************************************************************
		* clearforeground
		*
		* Description:
		*	Clears everything in the foreground of the canvas
		***********************************************************************/
		c.clearforeground = function() {
			c._pointset = new PointSet();
			c._selectedpoint = null;
			c.redrawcanvas();
		}

		/***********************************************************************
		* redrawcanvas
		*
		* Description:
		*	Redraws the canvas to only contain the background and foregroundobjects
		***********************************************************************/
		c.redrawcanvas = function() {
			c.drawbackground();
			c.drawforeground();
		}

		/***********************************************************************
		* clearcanvas
		*
		* Description:
		*	Redraws the canvas to only contain the background and foregroundobjects
		***********************************************************************/
		c.clearcanvas = function() {
			c.clearbackground();
			c.clearforeground();
		}

		/***********************************************************************
		* setpointset
		*
		* Description:
		*	Clears the canvas and places a new random collection of points 
		*	on the canvas
		*
		* Args:
		*	num - the number of random points to place on the canvas
		***********************************************************************/
		c.setpointset = function(num) {
			c.stopanimation();
			c.clearcanvas();
			c.resetsolutionbutton();

			c._pointset = new PointSet();
			c._pointset.generaterandompoints(num, 0, c.displayWidth, 0, c.displayHeight);
			c.redrawcanvas();
		}

		/***********************************************************************
		* playsolutionanimation
		*
		* Description:
		*	Plays the animation which reveals the polygon which all centerpoints
		*	of the pointset lie in.
		*
		* Args:
		*	none
		***********************************************************************/
		c.playsolutionanimation = function() {
			c.stopanimation();
			c.clearbackground();
			c.enablesolutionbutton();

			// No solution to show if there is no pointset
			if (c._pointset._size == 0) {
				return;
			}

			var minypoint = c._pointset.getminypoint();
			var minyline = new Line(minypoint, new Point(minypoint.x + 1, minypoint.y));

			var halfspaces = c._pointset.get_cpoint_boundry();
			halfspaces.unshift(minyline);

			c.scantoy(minypoint.y, halfspaces).done(c.rotatelinelist);

			return;
		}

		/***********************************************************************
		* scantoy
		*
		* Description:
		*	Animates a horizontal line scanning from y = 0 to the yval specified
		*
		* Args:
		*	yval - the y value to scan to
		*	halfspaces - the list of halfspaces to be passed to the deferred
		*		object's resolve at the end of this animation (usually for
		*		c.rotatelinelist)
		***********************************************************************/
		c.scantoy = function(yval, halfspaces) {
			c.animationcontroller = $.Deferred();
			var i = 1;
			c.animationdrawer = setInterval(function() {
				c.drawbackground();
				var l = new Line(new Point(0, i / c.animationframes * yval), new Point(c.displayWidth, i / c.animationframes * yval));
				l.drawhalfspace(c);
				c.drawforeground();

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
		* rotatelinelist
		*
		* Description:
		*	wrapper around _rotatelinelist
		***********************************************************************/
		c.rotatelinelist = function(lines) {
			c._rotatelinelist(lines, 0);
		}

		/***********************************************************************
		* _rotatelinelist
		*
		* Description:
		*	Animates a line rotation from each line in the list to the next
		*
		* Args:
		*	lines - an array of Line objects
		*	index - the index in the array that the animation is currentlly at
		***********************************************************************/
		c._rotatelinelist = function(lines, index) {
			// If we have reached the end of the list, we can exit
			if (index == (lines.length - 1)) {
				return;
			}
			// Create a new deferred object
			c.animationcontroller = $.Deferred();
			// Rotate the line
			c.linerotation(lines[index], lines[index+1], lines, index);

			// When the rotation is done, rotate the next line (recursive here)
			c.animationcontroller.done(function(c, lines, index) {
				c._rotatelinelist(lines, index + 1);
			});
		}

		/***********************************************************************
		* linerotation
		*
		* Description:
		*	Animates a line rotating on the canvas.  It rotates the direction which
		*	is the shortest
		*
		* Args:
		*	startline - A line object representing where the animation will start
		*	endline - A line object representing where the animation will end
		*
		* Args used if this is being called from _rotatelinelist
		*	d - a Deferred object
		*	lines - an array of Line objects
		*	index - the index in the array that the animation is currentlly at
		***********************************************************************/
		c.linerotation = function(startline, endline, lines, index) {
			c.componenets.push(startline);
			var intersection = startline.getintersection(endline);
			if (!intersection) {
				return;
			}
			var startunit = startline.unitvector();
			var endunit = endline.unitvector();
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
				c.drawbackground();
				newline = new Line(newline._point1, new Point(newline._point2.x + .1 * direction.x, newline._point2.y + .1 * direction.y));
				newline.drawhalfspace(c);
				c.drawforeground();

				if (i == 10) {
					clearInterval(c.animationdrawer);
					c.animationcontroller.resolve(c, lines, index);
				}
				i++;
			}, c.animationspeed);
		}
	}
};