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
	* equals
	*
	* Description:
	*	tests if two points have the same coordinates
	*
	* Args:
	*	p - a Point object
	*
	* Returns:
	*	A boolean, returns true if the two points have the same coordinates
	***************************************************************************/
	this.equals = function(p) {
		return (this.x == p.x && this.y == p.y);
	}

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
	* equals
	*
	* Description:
	*	Tests if two lines are the same
	*
	* Args:
	*	l - a Line object
	*
	* Returns:
	*	A boolean, returns true if the two lines are the same
	***************************************************************************/
	this.equals = function(l) {
		var end1 = this.getEndPoints(-1000, 1000, -1000, 1000);
		var end2 = l.getEndPoints(-1000, 1000, -1000, 1000);
		return (end1[0].equals(end2[0]) && end1[1].equals(end2[1]));
	}

	/***************************************************************************
	* getIntersection
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
	this.getIntersection = function(line) {
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
	* segmentLength
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
	this.segmentLength = function() {
		return window.GeomUtil.distance(this._point1, this._point2);
	}

	/***************************************************************************
	* unitVector
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
	this.unitVector = function() {
		var len = this.segmentLength();
		return new Vector((this._point2.x - this._point1.x)/len, (this._point2.y - this._point1.y)/len);
	}

	/***************************************************************************
	* normalVector
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
	this.normalVector = function() {
		var len = this.segmentLength();
		return new Vector((this._point1.y - this._point2.y)/len, (this._point2.x - this._point1.x)/len);
	}

	/***************************************************************************
	* getEndPoints
	*
	* Description:
	*	Calculates the endpoints of this line given boundaries.  This maintains the 
	*	order of the points
	*
	* Args:
	*	minx - the minimum x value allowed for the end points
	*	maxx - the maximum x value allowed for the end points
	*	miny - the minimum y value allowed for the end points
	*	maxy - the maximum y value allowed for the end points
	*
	* Returns:
	*	an array of two Point objects
	***************************************************************************/
	this.getEndPoints = function(minx, maxx, miny, maxy) {
		var points = [];

		// Vertical line
		if (this._point1.x == this._point2.x) {
			points.push(new Point(this._point1.x, miny));
			points.push(new Point(this._point2.x, maxy));
		} 
		// Horizontal line
		else if (this._point1.y == this._point2.y) {
			points.push(new Point(minx, this._point1.y));
			points.push(new Point(maxx, this._point2.y));
		} 
		// All other cases
		else {
			var slope = (this._point2.y - this._point1.y) / (this._point2.x - this._point1.x);
			var yintercept = this._point1.y - slope * this._point1.x;
			var intercept1 = slope * minx + yintercept;
			var intercept2 = (maxy - yintercept) / slope;
			var intercept3 = slope * maxx + yintercept;
			var intercept4 = (miny - yintercept) / slope;
			var coordinates = [];
			if ((intercept1 >= miny) && (intercept1 <= maxy)) {
				coordinates.push(minx);
				coordinates.push(intercept1);
			}
			if ((intercept2 >= minx) && (intercept2 <= maxx)) {
				coordinates.push(intercept2);
				coordinates.push(maxy);
			}
			if ((intercept3 >= miny) && (intercept3 <= maxy)) {
				coordinates.push(maxx);
				coordinates.push(intercept3);
			}
			if ((intercept4 >= minx) && (intercept4 <= maxx)) {
				coordinates.push(intercept4);
				coordinates.push(miny);
			}

			// Add the end points to the list in the correct order
			var p1 = new Point(coordinates[0], coordinates[1]);
			var p2 = new Point(coordinates[2], coordinates[3]);
			var fullline = new Line(p1, p2);
			// If they are in the correct order
			if (this.unitVector().equals(fullline.unitVector())) {
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
	* flip
	*
	* Description:
	*	Computes a new line which is this line rotated 180 degrees
	*
	* Args:
	*	None
	*
	* Returns:
	*	a Line object
	***************************************************************************/
	this.flip = function() {
		return new Line(this._point2, this._point1);
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

	/***************************************************************************
	* addPoint
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
	this.addPoint = function(point) {
		for (var i = 0; i < this._size; i++) {
			if (point.equals(this._points[i])) {
				return this._size;
			}
		}
		this._points.push(point);
		this._size++;
		this._centroid = null;
		return this._size;
	}

	/***************************************************************************
	* removePoint
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
	this.removePoint = function(point) {
		var ind = this._points.indexOf(point);
		if (ind > -1) {
			this._points.splice(ind,1);
			this._size--;
			this._centroid = null;
		}
		return this._size;
	}

	/***************************************************************************
	* generateRandomPoints
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
	this.generateRandomPoints = function(num, minx, maxx, miny, maxy) {
		var startsize = this._size;
		while (this._size - startsize < num) {
			var x = Math.floor(Math.random() * (maxx - minx + 1)) + minx;
			var y = Math.floor(Math.random() * (maxy - miny + 1)) + miny;
			this.addPoint(new Point(x, y));
		}
		return this._size;
	}

	/***************************************************************************
	* getMinYPoint
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
	this.getMinYPoint = function() {
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
	* halfSpacePointCount
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
	this.halfSpacePointCount = function(line) {
		var runsum = 0;
		for (var i = 0; i < this._size; i++) {
			if (window.GeomUtil.orient(line._point1, line._point2, this._points[i]) == -1) {
				runsum++;
			}
		}
		return runsum;
	}

	/***************************************************************************
	* isCenterPoint
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
	this.isCenterPoint = function(querypoint) {
		return this.findCenterPointCounterExample(querypoint) ? false : true;
	}
	
	/***************************************************************************
	* findCenterPointCounterExample
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
	this.findCenterPointCounterExample = function(querypoint) {
		// Make a list of points with the points below the query point getting rotated above it
		var shiftedpoints = [];
		for (var i = 0; i < this._size; i++) {
			var curpoint = this._points[i];
			if(curpoint.y < querypoint.y) {
				shiftedpoints[i] = new Point((querypoint.x + (querypoint.x - curpoint.x)), (querypoint.y + (querypoint.y - curpoint.y)));
			}
			else {
				shiftedpoints[i] = curpoint;
			}
		}
		
		// Sort the points in ccw order in relation to the query point using orient test. remove redundant colinear points
		var numshiftedpoints = this._size; 
		var sortedpoints = [];
		var numsorted = 2;
		sortedpoints[0] = new Point((querypoint.x + 1), querypoint.y);
		sortedpoints[1] = new Point((querypoint.x - 1), querypoint.y);
		for(var shiftedindex = 0; shiftedindex < numshiftedpoints; shiftedindex++) {
			var sortedindex = 0;
			var curccw = window.GeomUtil.orient(querypoint, sortedpoints[sortedindex], shiftedpoints[shiftedindex]);
			while(curccw == 1) {
				sortedindex++;
				var curccw = window.GeomUtil.orient(querypoint, sortedpoints[sortedindex], shiftedpoints[shiftedindex]);
			}
			// Insert the new point into the sorted list
			if(curccw == -1) {
				var insertionindex = sortedindex;
				numsorted++;
				for(sortedindex = numsorted - 1; sortedindex > insertionindex; sortedindex--) {
					sortedpoints[sortedindex] = sortedpoints[sortedindex - 1];
				}
				sortedpoints[insertionindex] = shiftedpoints[shiftedindex];
			}
			//if new point is colinear with another point we've already sorted, just ignore it
		}
		
		// Make a list of lines intersecting the query point and the centroid of each pair of adjacent elements in the ordered point list (including query point (+1,+0) and query point (-1, +0))
		var linelist = [];
		var linecount = 0;
		for(var curindex = 0; curindex < numsorted - 1; curindex++) {
			var curpt = new Point((sortedpoints[curindex].x + sortedpoints[curindex + 1].x)/2, (sortedpoints[curindex].y + sortedpoints[curindex + 1].y)/2);
			linelist[2 * curindex] = new Line(querypoint, curpt);
			linelist[(2 * curindex) + 1] = new Line(curpt, querypoint);
			linecount += 2;
		}
		
		// Find the line which has the most points on one side of it
		var largestline;
		var largestpoints = 0;
		for(var i = 0; i < linecount; i++) {
			var count = this.halfSpacePointCount(linelist[i]);
			if (count > largestpoints) {
				largestline = linelist[i];
				largestpoints = count;
			}
		}

		// If the line with the largest point count is larger than 2/3rd of the total points, return it
		if (largestpoints > Math.floor(2*(this._size / 3))) {
			return largestline;
		}

		return;
	}

	/***************************************************************************
	* centroid
	*
	* Description:
	*	Computes the centroid for this collection of points
	*
	* Args:
	*	None
	*
	* Returns:
	*	a Point object - the centroid of this collection of points
	***************************************************************************/
	this.centroid = function() {
		var totalx = 0;
		var totaly = 0;
		for (var i = 0; i < this._size; i++) {
			var p = this._points[i];
			totalx += p.x;
			totaly += p.y;
		}
		return new Point(totalx / this._size, totaly / this._size);
	}
	
	/***************************************************************************
	* getCenterPointBoundaries
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
	this.getCenterPointBoundaries = function() {
		var ps = this;
		// returns next line segment of rotation
		var next_line = function(ln, add) {
			return new Line(ln._point1, ps.findNextPoint(ln, add));
		};
		
		// List of halfspace lines:
		var lines = [];
		// Get first line
		var l1 = this.findFirstLine();
		lines.push(l1);
		// Get size of 1/3 points needed out of halfspace
		var size_hlfspc = Math.ceil(this._size/3.0);
		
		// Find starting halfspace line
		for (var i = 0; i < size_hlfspc-1; i++) {
			lines.push(next_line(lines.slice(-1)[0],1));
		}
		
		// Keep track of starting line
		var s_line = lines.slice(-1)[0];
		lines.push(next_line(lines.slice(-1)[0].flip(),1));
		var count = 1;
		// Add all lines in rotation
		while (!s_line.equals(lines.slice(-1)[0])) {
			count ++;
			lines.push(next_line(lines.slice(-1)[0].flip()));
			// Return error if line doesn't return back to start
			if (count > 4*this._size*this._size) {
				return 1;
			}
		}
		return lines;
	}

	/***************************************************************************
	* findNextPoint
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
	*	add - boolean
	*
	* Returns:
	*	a point - the next point in ccw order
	***************************************************************************/
	this.findNextPoint = function(l, add) {
		// Create PointSet L of potential next points ( [0,180) deg)
		// and PointSet R of potential next points ( [180,360) deg)
		var L  = new PointSet;
		var R  = new PointSet;
		l_exist = 0;
		r_exist = 0;
		for (var i = 0; i < this._size; i++) {
			var pt  = this._points[i];
			var ccw = window.GeomUtil.orient(l._point1, l._point2,pt);
			if (ccw == 1) {
				L.addPoint(pt);
			}
			else if (ccw == 0) {
				var t = (pt.x-l._point1.x)/(l._point2.x-l._point1.x);
				if (((t > 1.0) && (add == 1)) || ((t>0.0) && (t < 1.0) && (add == 0))) {
					L.addPoint(pt);
				}
			}
			else {
				R.addPoint(pt)
			}
		}

		// See if points in L and R
		if (L._size > 0) {
			l_exist = 1;
		}
		if (R._size > 0) {
			r_exist = 1;
		}

		// Find next point from L
		var pcL = L._points[0];
		L.removePoint(pcL);
		while (L._size>0) {
			// Test if pc is on l; move to next section if so
			if (window.GeomUtil.orient(l._point1,l._point2,pcL) == 0) {
				break;
			}
			// Test if pt has smaller angle than pc
			// If same angle, choose pt if closer to l._point1 than pc
			var pt  = L._points[0];
			L.removePoint(pt);
			var ccw = window.GeomUtil.orient(l._point1,pcL,pt);
			if (ccw == -1) {
				pcL = pt;
			}
			else if (ccw == 0) {
				var t = (pt.x-l._point1.x)/(pcL.x-l._point1.x);
				if (t < 1.0) {
					pcL = pt;
				}
			}
		}

		// Find next point from R
		if (R._size > 0) {
			var pcR = R._points[0];
			R.removePoint(pcR);
			while (R._size>0) {
				// Test if pc is on l; move to next section if so
				if (window.GeomUtil.orient(l._point1,l._point2,pcR) == 0) {
					break;
				}
				// Test if pt has smaller angle than pc
				// If same angle, choose pt if closer to l._point1 than pc
				var pt  = R._points[0];
				R.removePoint(pt);
				var ccw = window.GeomUtil.orient(l._point1,pcR,pt);
				if (ccw == -1) {
					pcR = pt;
				} 
				else if (ccw == 0) {
					var t = (pt.x-l._point1.x)/(pcR.x-l._point1.x);
					if (t < 1.0) {
						pcR = pt;
					}
				}
			}
		}

		var pc = pcL
		if (l_exist == 0 || (r_exist == 1 && window.GeomUtil.orient(l._point1,pcL,pcR) == 1)) {
			pc = pcR;
		} 

		return pc;
	}

	/***************************************************************************
	* findFirst
	*
	* Description:
	*	Finds the first line segment lf in a set of points such that the
	*	halfspace defined by lf contains all points
	*
	* Args:
	*	None
	*
	* Returns:
	*	a line - a line segment whose halfspace contains all points in P
	***************************************************************************/
	this.findFirstLine = function() {
		// Ensure this point set contains enough points
		if (this._size < 2) {
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

		// Make copy of the points, sort, then return line with
		// first two sorted points
		var L  = this._points.slice(0);
		L      = L.sort(compare);
		var p1 = L[0];
		var p2 = L[1];

		// If p1  p2 not collinear, call findNextPoint to locate nearest point by angle
		if (p1.y != p2.y) {
			horz_pt = new Point(p1.x + 10, p1.y);
			p2 = this.findNextPoint(new Line(p1, horz_pt), 1);
		}

		return new Line(p1, p2);
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
	}
}
