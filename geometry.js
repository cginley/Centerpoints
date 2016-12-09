/*******************************************************************************
* Vector
*
* Description:
*	An object that represents a vector in 2 dimensions
*
* Attributes:
*	x - an integer, the x component of the vector
*	y - an integer, the y component of the vector
*******************************************************************************/
function Vector(xcomp, ycomp) {
	this.x = xcomp;
	this.y = ycomp;

	/***************************************************************************
	* equals
	*
	* Description:
	*	Checks if this vector is the same as another, within reasonable error
	*
	* Args:
	*	vec - a Vector object
	*
	* Returns:
	*	Boolean
	***************************************************************************/
	this.equals = function(vec) {
		return (Math.abs(this.x - vec.x) < .00001) && (Math.abs(this.y - vec.y) < .00001);
	}

	/***************************************************************************
	* add
	*
	* Description:
	*	Adds a vector to this one
	*
	* Args:
	*	vec - a Vector object
	*
	* Returns:
	*	a Vector object
	***************************************************************************/
	this.add = function(vec) {
		return new Vector(this.x + vec.x, this.y + vec.y);
	}

	/***************************************************************************
	* subtract
	*
	* Description:
	*	Subtracts a vector from this one
	*
	* Args:
	*	vec - a Vector object
	*
	* Returns:
	*	a Vector object
	***************************************************************************/
	this.subtract = function(vec) {
		return new Vector(this.x - vec.x, this.y - vec.y);
	}

	/***************************************************************************
	* scale
	*
	* Description:
	*	Computes a vector that is a scale of this vector
	*
	* Args:
	*	c - a number
	*
	* Returns:
	*	a Vector object
	***************************************************************************/
	this.scale = function(c) {
		return new Vector(c * this.x, c * this.y);
	}
}

/*******************************************************************************
* Point
*
* Description:
*	An object that represents a point in the plane
*
* Attributes:
*	x - an integer, the x coordinate of the point
*	y - an integer, the y coordinate of the point
*******************************************************************************/
function Point(xcor, ycor) {
	this.x = xcor;
	this.y = ycor;

	/***************************************************************************
	* move
	*
	* Description:
	*	Computes a point by moving this one by a vector
	*
	* Args:
	*	vec - a Vector object
	*
	* Returns:
	*	a Point object
	***************************************************************************/
	this.move = function(vec) {
		return new Point(this.x + vec.x, this.y + vec.y);
	}
}

/*******************************************************************************
* Line
*
* Description:
*	An object that represents a line in the plane
*
* Attributes:
*	x1 - an integer, the x coordinate of the point 1
*	y1 - an integer, the y coordinate of the point 1
*	x2 - an integer, the x coordinate of the point 2
*	y2 - an integer, the y coordinate of the point 2
*******************************************************************************/
function Line(point1, point2) {
	this._point1 = point1;
	this._point2 = point2;
	
	/***************************************************************************
	* getintersection
	*
	* Description:
	*	Finds the point of intersection between this line and another
	*
	* Args:
	*	line - a Line object
	*
	* Returns:
	*	a Point object - the intersection of the two lines if it exists
	*	Null otherwise
	***************************************************************************/
	this.getintersection = function(line) {
		// Extract the coordinates from the points of the lines
		var x1 = this._point1.x;
		var y1 = this._point1.y;
		var x2 = this._point2.x;
		var y2 = this._point2.y;
		var x3 = line._point1.x;
		var y3 = line._point1.y;
		var x4 = line._point2.x;
		var y4 = line._point2.y;

		// Calculate the denominator to each coordinate of the intersection point
		var denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		// If it is zero, the lines are either parallel or coincident, so just return null
		if (denominator == 0) {
			return;
		}

		// Calculate the coordinates of the intersection point
		var det12 = x1 * y2 - y1 * x2;
		var det34 = x3 * y4 - y3 * x4;
		var x = (det12 * (x3 - x4) - det34 * (x1 - x2)) / denominator;
		var y = (det12 * (y3 - y4) - det34 * (y1 - y2)) / denominator;

		return new Point(x, y);
	}

	/***************************************************************************
	* segmentlength
	*
	* Description:
	*	Computes the length of the line segment between the two points
	*
	* Args:
	*	None
	*
	* Returns:
	*	A number - the length
	***************************************************************************/
	this.segmentlength = function() {
		return window.GeomUtil.distance(this._point1, this._point2);
	}

	/***************************************************************************
	* unitvector
	*
	* Description:
	*	Computes the unit vector in the direction of this line
	*
	* Args:
	*	None
	*
	* Returns:
	*	a Vector object
	***************************************************************************/
	this.unitvector = function() {
		var len = this.segmentlength();
		return new Vector((this._point2.x - this._point1.x)/len, (this._point2.y - this._point1.y)/len);
	}

	/***************************************************************************
	* normalvector
	*
	* Description:
	*	Computes the normal vector (of unit length) in the counter-clockwise 
	*	direction
	*
	* Args:
	*	None
	*
	* Returns:
	*	a Vector object
	***************************************************************************/
	this.normalvector = function() {
		var len = this.segmentlength();
		return new Vector((this._point1.y - this._point2.y)/len, (this._point2.x - this._point1.x)/len);
	}

	/***************************************************************************
	* getendpoints
	*
	* Description:
	*	Calculates the endpoints of this line on the canvas.  This maintains the 
	*	order of the points
	*
	* Args:
	*	canvas - a P5 object where this line will be drawn
	*
	* Returns:
	*	an array of two points
	***************************************************************************/
	this.getendpoints = function(canvas) {
		var width = canvas.displayWidth;
		var height = canvas.displayHeight;

		var points = [];

		// Vertical line
		if (this._point1.x == this._point2.x) {
			points.push(new Point(this._point1.x, 0));
			points.push(new Point(this._point2.x, height));
		} 
		// Horizontal line
		else if (this._point1.y == this._point2.y) {
			points.push(new Point(0, this._point1.y));
			points.push(new Point(width, this._point2.y));
		} 
		// All other cases
		else {
			var slope = (this._point2.y-this._point1.y)/(this._point2.x-this._point1.x);
			var intercept1 = this._point1.y-slope*this._point1.x;
			var intercept2 = (height-intercept1)/slope;
			var intercept3 = slope*width+intercept1;
			var intercept4 = -intercept1/slope;
			var coordinates = [];
			if ((intercept1 >= 0) && (intercept1 <= height)) {
				coordinates.push(0);
				coordinates.push(intercept1);
			}
			if ((intercept2 >= 0) && (intercept2 <= width)) {
				coordinates.push(intercept2);
				coordinates.push(width);
			}
			if ((intercept3 >= 0) && (intercept3 <= height)) {
				coordinates.push(width);
				coordinates.push(intercept3);
			}
			if ((intercept4 >= 0) && (intercept4 <= width)) {
				coordinates.push(intercept4);
				coordinates.push(0);
			}

			// Add the end points to the list in the correct order
			var p1 = new Point(coordinates[0], coordinates[1]);
			var p2 = new Point(coordinates[2], coordinates[3]);
			var fullline = new Line(p1, p2);
			// If they are in the correct order
			if (this.unitvector().equals(fullline.unitvector())) {
				points.push(p1);
				points.push(p2);
			}
			// Otherwise they are in the wrong order
			else {
				points.push(p2);
				points.push(p1);
			}
		}

		return points;
	}

	/***************************************************************************
	* draw
	*
	* Description:
	*	draws this line onto a canvas
	*
	* Args:
	*	canvas - a P5 object where this line will be drawn
	*
	* Returns:
	*	Null
	***************************************************************************/
	this.draw = function(canvas) {
		var verticies = this.getendpoints(canvas);

		canvas.stroke(255, 0, 0);
		canvas.strokeWeight(2);
		canvas.line(verticies[0].x, verticies[0].y, verticies[1].x, verticies[1].y);
		canvas.strokeWeight(1);
	}

	/***************************************************************************
	* drawhalfspace
	*
	* Description:
	*	draws this line onto a canvas with the clockwise halfspace shaded in
	*
	* Args:
	*	canvas - a P5 object where this halfspace will be drawn
	*
	* Returns:
	*	Null
	***************************************************************************/
	this.drawhalfspace = function(canvas) {
		var width = canvas.displayWidth;
		var height = canvas.displayHeight;
		
		var verticies = this.getendpoints(canvas);

		var ccw = window.GeomUtil.orient;
		var l = this;

		// Find which corners are on the clockwise side
		if (ccw(l._point1, l._point2, new Point(0, 0)) == -1) {
			verticies.push(new Point(0, 0));
		}
		if (ccw(l._point1, l._point2, new Point(0, height)) == -1) {
			verticies.push(new Point(0, height));
		}
		if (ccw(l._point1, l._point2, new Point(width, 0)) == -1) {
			verticies.push(new Point(width, 0));
		}
		if (ccw(l._point1, l._point2, new Point(width, height)) == -1) {
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
		canvas.stroke(0);
		canvas.fill(255, 100, 100);

		canvas.beginShape();
		for (var i = 0; i < (verticies.length); i++) {
			canvas.vertex(verticies[i].x, verticies[i].y);
		}
		canvas.endShape(canvas.CLOSE);

		return;
	}
}


/*******************************************************************************
* PointSet
*
* Description:
*	An object - a collection of points
*
* Attributes:
*	_points	- an array containing all the points in the set
*	_size - the number of points in the set
*	_centroid - a Point object which is located at the centroid of this
*				collection of points (should not be accessed directly as it will
*				be null until explicitly computed)
*******************************************************************************/
function PointSet() {
	this._points = [];
	this._size = 0;
	this._centroid = null;

	/***************************************************************************
	* samepoint
	*
	* Description:
	*	tests if two points have the same coordinates
	*
	* Args:
	*	pointa and pointb - two Point objects, whose coordinates are to be compared
	*
	* Returns:
	*	A boolean, returns true if the two points have the same coordinates
	***************************************************************************/
	this.samepoint = function(pointa, pointb) {
		return (pointa.x == pointb.x)&&(pointa.y == pointb.y);
	}

	/***************************************************************************
	* addpoint
	*
	* Description:
	*	Adds a point to this collection of points; an attempt to add a preexisting point will fail, and result in no changes
	*
	* Args:
	*	point - a Point object, the point to add to this collection.
	*
	* Returns:
	*	An integer - the number of points in the set after adding this new one; returns the current size on an attempted point duplication
	***************************************************************************/
	this.addpoint = function(point) {
		for (var i = 0; i < this._size; i++) 
		{
			if (this.samepoint(point, this._points[i]))
				return this._size;
		}
		this._points.push(point);
		this._size++;
		this._centroid = null;
		return this._size;
	}

	/***************************************************************************
	* getminypoint
	*
	* Description:
	*	Finds the point in this pointset that has the minimum y value
	*
	* Args:
	*	None
	*
	* Returns:
	*	a Point object
	***************************************************************************/
	this.getminypoint = function() {
		if (!this._size) {
			return;
		}

		var miny = this._points[0];
		for (var i = 1; i < this._size; i++) {
			if (this._points[i].y < miny.y) {
				miny = this._points[i];
			}
		}
		return miny;
	}

	/***************************************************************************
	* halfspacepointcount
	*
	* Description:
	*	counts points of this pointset on one side of a line
	*
	* Args:
	*	points - a Line object, against whom the points will be compared
	*
	* Returns:
	*	An integer - the number of points which are clockwise from the given line's end points
	***************************************************************************/
	this.halfspacepointcount = function(line) {
		var runsum = 0;
		for (var i = 0; i < this._size; i++) 
		{
			if (window.GeomUtil.orient(line._point1, line._point2, this._points[i]) == -1)
				runsum++;
		}
		return runsum;
	}

	/***************************************************************************
	* iscenterpoint
	*
	* Description:
	*	determines whether given point is a centerpoint of the pointset
	*
	* Args:
	*	querypoint - a Point object, which will be evaluated as a potential centerpoint
	*
	* Returns:
	*	A boolean - true if the point is a centerpoint, false otherwise
	***************************************************************************/
	this.iscenterpoint = function(querypoint) {
		var counterexample = this.findcentercounterline(querypoint);
		if(counterexample == null)
			return true;
		else
			return false;
	}
	
	/***************************************************************************
	* findcentercounterline
	*
	* Description:
	*	finds a line illustrating that the query point is not a fit centerpoint, if such a line exists
	*
	* Args:
	*	querypoint - a Point object, which will be evaluated as a potential centerpoint
	*
	* Returns:
	*	A Line - the line should pass through querypoint and illustrate that it is not a center point 
	***************************************************************************/
	this.findcentercounterline = function(querypoint) {
		
		//make a list of points with the points below the query point getting rotated above it
		var shiftedpoints = [];
		for (var i = 0; i < this._size; i++)
		{
			var curpoint = this._points[i];
			if(curpoint.y < querypoint.y)
				shiftedpoints[i] = new Point((querypoint.x + (querypoint.x - curpoint.x)), (querypoint.y + (querypoint.y - curpoint.y)));
			else
				shiftedpoints[i] = curpoint;
		}
		
		//sort the points in ccw order in relation to the query point using orient test. remove redundant colinear points
		var numshiftedpoints = this._size; 
		var sortedpoints = [];
		var numsorted = 2;
		sortedpoints[0] = new Point((querypoint.x + 1), querypoint.y);
		sortedpoints[1] = new Point((querypoint.x - 1), querypoint.y);
		for(var shiftedindex = 0; shiftedindex < numshiftedpoints; shiftedindex++)
		{
			var sortedindex = 0;
			var curccw = window.GeomUtil.orient(querypoint, sortedpoints[sortedindex], shiftedpoints[shiftedindex]);
			while(curccw == 1)
			{
				sortedindex++;
				var curccw = window.GeomUtil.orient(querypoint, sortedpoints[sortedindex], shiftedpoints[shiftedindex]);
			}
			if(curccw == -1) //insert the new point into the sorted list
			{
				var insertionindex = sortedindex;
				numsorted++;
				for(sortedindex = numsorted - 1; sortedindex > insertionindex; sortedindex--)
				{
					sortedpoints[sortedindex] = sortedpoints[sortedindex - 1];
				}
				sortedpoints[insertionindex] = shiftedpoints[shiftedindex];
			}
			//if new point is colinear with another point we've already sorted, just ignore it
			
		}
		
		//make a list of lines intersecting the query point and the centroid of each pair of adjacent elements in the ordered point list (including query point (+1,+0) and query point (-1, +0))
		var linelist = [];
		var linecount = 0;
		for(var curindex = 0; curindex < numsorted - 1; curindex++)
		{
			var curpt = new Point((sortedpoints[curindex].x + sortedpoints[curindex + 1].x)/2, (sortedpoints[curindex].y + sortedpoints[curindex + 1].y)/2);
			linelist[2 * curindex] = new Line(querypoint, curpt);
			linelist[(2 * curindex) + 1] = new Line(curpt, querypoint);
			linecount += 2;
		}
		
		// Find the line which has the most points on one side of it
		var largestline;
		var largestpoints = 0;
		for(var i = 0; i < linecount; i++) {
			var count = this.halfspacepointcount(linelist[i]);
			if (count > largestpoints) {
				largestline = linelist[i];
				largestpoints = count;
			}
		}

		// If the line with the largest point count if larger than 2/3rd of the total points, return it
		if (largestpoints > Math.floor(2*(this._size / 3))) {
			return largestline;
		}

		return null;
	}
	
	/***************************************************************************
	* removepoint
	*
	* Description:
	*	Removes a point from this collection of points
	*
	* Args:
	*	point - a Point object, the point to remove to this collection.
	*
	* Returns:
	*	An integer - the number of points in the set after removing this one
	***************************************************************************/
	this.removepoint = function(point) {
		var ind = this._points.indexOf(point);
		if(ind > -1) {
			this._points.splice(ind,1);
			this._size--;
			this._centroid = null;
		}
		return this._size;
	}

	/***************************************************************************
	* generaterandompoints
	*
	* Description:
	*	Adds a certain number of random points to the pointset
	*
	* Args:
	*	num - an integer, the number of points to add
	*	minx - the minimum x value allowed
	*	maxx - the maximum x value allowed
	*	miny - the minimum y value allowed
	*	maxy - the maximum y value allowed
	*
	* Returns:
	*	An integer - the number of points in the set after adding the random ones
	***************************************************************************/
	this.generaterandompoints = function(num, minx, maxx, miny, maxy) {
		var startsize = this._size;
		while (this._size - startsize < num) {
			var x = Math.floor(Math.random() * (maxx - minx + 1)) + minx;
			var y = Math.floor(Math.random() * (maxy - miny + 1)) + miny;
			this.addpoint(new Point(x, y));
		}
		return this._size;
	}

	/***************************************************************************
	* centroid
	*
	* Description:
	*	Computes the centroid for this collectoin of points
	*
	* Args:
	*	None
	*
	* Returns:
	*	a Point object - the centroid of this collection of points
	***************************************************************************/
	this.centroid = function() {
		if (this._centroid === null) {
			var totalx = 0;
			var totaly = 0;
			for (var i = 0; i < this._size; i++) {
				var p = this._points[i];
				totalx += p.x;
				totaly += p.y;
			}
			this._centroid = new Point(totalx/this._size, totaly/this._size);
		}
		return this._centroid;
	}

	/***************************************************************************
	* draw
	*
	* Description:
	*	Draws this collection of points onto a canvas
	*
	* Args:
	*	canvas - a P5 object where this pointset will be drawn
	*
	* Returns:
	*	Null
	***************************************************************************/
	this.draw = function(canvas) {
		canvas.fill(0);
		canvas.stroke(0);
		for (var i = 0; i < this._size; i++) {
			var p = this._points[i];
			canvas.ellipse(p.x, p.y, 5, 5);
		}
		return;
	}
	
	/***************************************************************************
	* get_cpoint_boundry
	*
	* Description:
	*	Finds all halfspaces which define the pointset's centerpoint space
	*
	* Args:
	*	None
	*
	* Returns:
	*	a list of Lines, in order of rotation.
	***************************************************************************/
	this.get_cpoint_boundry = function() {
		var next = window.GeomUtil.find_next;
		var ps = this;
		// returns next line segment of rotation
		var next_line = function(ln, add) {
			return new Line(ln._point1,next(ln,ps,add));
		}
		
		// Takes line segment [a,b] and returns segment [b,a]
		var l_flip = function(ln) {
			return new Line(ln._point2,ln._point1);
		}
		
		// test point equality
		var same_point = function(peq1,peq2) {
			return ((peq1.x==peq2.x)&&(peq1.y==peq2.y));
		}
		
		// Test line equality
		var same_line = function(leq1,leq2) {
			var peq1 = same_point(leq1._point1,leq2._point1);
			var peq2 = same_point(leq1._point2,leq2._point2);
			return ((peq1==1)&&(peq2==1));
		}
		
		// List of halfspace lines:
		var lines = [];
		// get first line
		var l1 = window.GeomUtil.find_first(this);
		lines.push(l1);
		// get size of 1/3 points needed out of halfspace
		var size_hlfspc = Math.ceil(this._size/3.0);
		
		// find starting halfspace line
		for(var i = 0; i < size_hlfspc-1; i++) {
			lines.push(next_line(lines.slice(-1)[0],1));
		}
		
		// keep track of starting line
		var s_line = lines.slice(-1)[0];
		lines.push(next_line(l_flip(lines.slice(-1)[0]),1));
		var count = 1;
		// Add all lines in rotation
		while(same_line(s_line, lines.slice(-1)[0]) == 0) {
			count ++;
			lines.push(next_line(l_flip(lines.slice(-1)[0])));
			// Return error if line doesn't return back to start
			if (count > 4*this._size*this._size) {
				return 1;
			}
		}
		return lines;
	}
}

/*******************************************************************************
* GeomUtil
*
* Description:
*	An object containing utility functions related to computational geometry
*******************************************************************************/
window.GeomUtil = {
	/***************************************************************************
	* distance
	*
	* Description:
	*	Determines the distance between two points
	*
	* Args:
	*	a - a Point object
	*	b - a Point object
	*
	* Returns:
	*	an Integer - the distance
	***************************************************************************/
	distance: function(a, b) {
		return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
	},
	
	/***************************************************************************
	* orient
	*
	* Description:
	*	Determines the orientation of three points
	*
	* Args:
	*	a - a Point object
	*	b - a Point object
	*	c - a Point object
	*
	* Returns:
	*	One of the following integers:
	*		 1 if triangle abc is oriented counterclockwise
	*		 0 if triangle abc is colinear
	*		-1 if triangle abc is oriented clockwise 
	***************************************************************************/
	orient: function(a, b, c) {
		return Math.sign(a.x * (b.y - c.y) - b.x * (a.y - c.y) + c.x * (a.y - b.y));
	},

	/***************************************************************************
	* colinear
	*
	* Description:
	*	Determines if three points are colinear
	*
	* Args:
	*	a - a Point object
	*	b - a Point object
	*	c - a Point object
	*
	* Returns:
	*	boolean
	***************************************************************************/
	colinear: function(a, b, c) {
		return (this.orient(a, b, c) == 0);
	},

	/***************************************************************************
	* cocyclic
	*
	* Description:
	*	Determines if four points are cocircular
	*
	* Args:
	*	a - a Point object
	*	b - a Point object
	*	c - a Point object
	*	d - a Point object
	*
	* Returns:
	*	boolean
	***************************************************************************/
	cocyclic: function(a, b, c, d) {
		// First, if any three points are colinear, then they cannot all be cocylic
		if (this.colinear(a, b, c) || this.colinear(b, c, d) || this.colinear(a, c, d)) {
			return false;
		}

		// Order the points in counterclockwise order
		var p1 = a;
		var p2 = b;
		var p3 = c;
		var p4 = d;
		if (this.orient(p1, p2, p3) == -1) {
			var temp = p2;
			p2 = p3;
			p3 = temp;
		}
		if (this.orient(p1, p3, p4) == -1) {
			var temp = p3;
			p3 = p4;
			p4 = temp;
			if (this.orient(p1, p2, p3) == -1) {
				temp = p2;
				p2 = p3;
				p3 = temp;
			}
		}

		// Use Ptolemy's theorem to determine if they are cocylic (within an error of .00001)
		return Math.abs((this.distance(p1, p3) * this.distance(p2, p4)) - (this.distance(p1, p2) * this.distance(p3, p4) + this.distance(p2, p3) * this.distance(p1, p4))) < .00001;
	},
	/***************************************************************************
	* find_next
	*
	* Description:
	*	Finds the next point in ccw order wrt a line segment.
	*	'add' determines order of collinear points on line segment.
	*		If add=0 and collinear points wrt l.point1, l.point2 outside l, next
	*			point will be collinear point on l nearest to l.point2
	*		If add=1 and collinear points wrt l.point1, l.point2 outside l, next
	*			point will be collinear point outside l nearest to l.point2
	*
	* Args:
	*	l   - a line object
	*	P   - a PointSet object
	*	add - boolean
	*
	* Returns:
	*	a point - the next point in ccw order
	***************************************************************************/
	find_next: function(l,P,add) {
		// Create PointSet L of potential next points ( [0,180) deg)
		// and PointSet R of potential next points ( [180,360) deg)
		var L  = new PointSet;
		var R  = new PointSet;
		l_exist = 0;
		r_exist = 0;
		for(var i = 0; i < P._size; i++){
			var pt  = P._points[i];
			var ccw = window.GeomUtil.orient(l._point1,l._point2,pt);
			if (ccw == 1) {
				L.addpoint(pt);
			} else if (ccw == 0) {
				var t = (pt.x-l._point1.x)/(l._point2.x-l._point1.x);
				if ((t > 1.0) && (add == 1)) {
					L.addpoint(pt);
				} else if (((t>0.0) && (t < 1.0)) && (add == 0)) {
					L.addpoint(pt);
				}
			} else {
				R.addpoint(pt)
			}
		}
		
		// See if points in L and R
		if(L._size > 0) {
			l_exist = 1;
		}
		if(R._size > 0) {
			r_exist = 1;
		}
		
		// Find next point from L
		var pcL = L._points[0];
		L.removepoint(pcL);
		while(L._size>0) {
			// Test if pc is on l; move to next section if so
			if(window.GeomUtil.orient(l._point1,l._point2,pcL) == 0) {
				break;
			}
			// Test if pt has smaller angle than pc
			// If same angle, choose pt if closer to l._point1 than pc
			var pt  = L._points[0];
			L.removepoint(pt);
			var ccw = window.GeomUtil.orient(l._point1,pcL,pt);
			if (ccw == -1) {
				pcL = pt;
			} else if (ccw == 0) {
				var t = (pt.x-l._point1.x)/(pcL.x-l._point1.x);
				if (t < 1.0) {
					pcL = pt;
				}
			}
		}
		
		// Find next point from R
		if (R._size > 0) {
			var pcR = R._points[0];
			R.removepoint(pcR);
			while(R._size>0) {
				// Test if pc is on l; move to next section if so
				if(window.GeomUtil.orient(l._point1,l._point2,pcR) == 0) {
					break;
				}
				// Test if pt has smaller angle than pc
				// If same angle, choose pt if closer to l._point1 than pc
				var pt  = R._points[0];
				R.removepoint(pt);
				var ccw = window.GeomUtil.orient(l._point1,pcR,pt);
				if (ccw == -1) {
					pcR = pt;
				} else if (ccw == 0) {
					var t = (pt.x-l._point1.x)/(pcR.x-l._point1.x);
					if (t < 1.0) {
						pcR = pt;
					}
				}
			}
		}
		
		// Test if pcL closer to l than pcR
		/*
		console.log('point L',pcL)
		console.log('point R',pcR)
		*/
		var pc = pcL
		if(l_exist == 0) {
			pc = pcR;
		} else if (r_exist == 1) {
			if (window.GeomUtil.orient(l._point1,pcL,pcR) == 1) {
				pc = pcR;
			}
		}
		
		
		/* This only runs if pc on l
		if (L._size>0){
			// Remove all points from L not on l
			for (var i=0; i<L._size; i++) {
				if(window.GeomUtil.orient(l._point1,l._point2,L._points[i]) != 0) {
					L.removepoint(L._points[i]);
					i--;
				}
			}
			// Find point on l closest to l._point2
			while(L._size>0){
				var pt  = L._points[0];
				L.removepoint(pt);
				var t = (pt.x-l._point2.x)/(pc.x-l._point2.x);
				if (t < 1.0) {
					pc = pt;
				}
			}
		}*/
		return pc;
	},
	/***************************************************************************
	* find_first
	*
	* Description:
	*	Finds the first line segment lf in a set of points such that the
	*	halfspace defined by lf contains all points
	*	
	*
	* Args:
	*	P   - a PointSet object
	*
	* Returns:
	*	a line - a line segment whose halfspace contains all points in P
	***************************************************************************/
	find_first: function(P) {
		// Ensure P contains enough points
		if (P._size < 2) {
			return 1;
		}
		
		// Point comparison for sorting
		// Sort y, then x in ascending order (prefer top left of canvas)
		function compare(a, b) {
			if (a.y === b.y) {
			  return (a.x < b.x) ? -1 : 1;
			}
			else {
			  return (a.y < b.y) ? -1 : 1;
			}
		}
		
		// Make copy of P points, sort, then return line with
		// first two sorted points
		var L  = P._points.slice(0);
		L      = L.sort(compare);
		var p1 = L[0];
		var p2 = L[1];
		
		// If p1  p2 not collinear, call find_next to locate nearest point by angle
		if (p1.y != p2.y) {
			horz_pt = new Point(p1.x+10,p1.y);
			p2 = window.GeomUtil.find_next(new Line(p1,horz_pt),P,1);
		}
		
		return new Line(p1,p2);
	}
}
