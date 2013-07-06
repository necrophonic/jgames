var grid_size = 51; // Size for both X and Y axes
var midpoint  = undefined;
var speed	  = 100;
var runner    = undefined; // Interval
var snake	  = undefined; // Snake queue
var grid      = undefined;
var score	  = 0;

var kill_count = 0;

var snake_default_start_size = 3;
var snake_initial_orientation = new Array( 0, -1 ); // Tail up

var velocity = undefined; // Array x / y velocity

/* One time set up called on page load
*/
function init() {
	debug("Initialise");
	grid = document.getElementById("snake");
	set_up_grid();
	
	midpoint = new Array( Math.ceil(grid_size/2), Math.ceil(grid_size/2) );

	return;
}

// ----------------------------------------------------------------------------

/* Clear down previous state (if any) and start a new game.
*/
function new_game() {

	// Create new snake
	snake = new Array();
	
	for (var i=0; i<snake_default_start_size; i++) {
		var x = midpoint[0] + snake_initial_orientation[0]*i;
		var y = midpoint[1] + snake_initial_orientation[1]*i;
		snake.push( coords_to_id(x,y) );
		ink_cell( coords_to_id(x,y) );
	}

	score = 0;

	velocity = new Array( 0, 1 ); // Start moving downwards

	runner = setInterval("update();",speed);
}

// ----------------------------------------------------------------------------

function update() {
	kill_count++;
	if (kill_count == 100) {
		clearInterval(runner);
	}
	move_snake();	
}

// ----------------------------------------------------------------------------

/* Move the snake as per velocity. We do this by unshifting to one end
*  of the queue.
*/
function move_snake() {	
	var head = id_to_coords( snake[0] ); // Current head

	head[0] += velocity[0];
	head[1] += velocity[1];

	var new_head = coords_to_id(head[0],head[1]);
	
	// TODO check whether hit body

	// TODO check whether head hit boundary
	if (has_hit_boundary(new_head)) {
		debug("Hit wall!");
		stop_game();
	}

	// TODO check whether hit fruit

	ink_cell(new_head);
	snake.unshift(new_head);

	clear_tail();

	return;
}

// ----------------------------------------------------------------------------

function has_hit_boundary(proposed) {
	var coords = id_to_coords(proposed);
	var x = coords[0];
	var y = coords[1];

	debug("X is "+x);

	if (x < 0 || x > grid_size-1 || y < 0 || y > grid_size-1) {
		return true;
	}
	return false;
}

// ----------------------------------------------------------------------------

function stop_game() {
	if (runner) {
		clearInterval(runner);
	}
}

// ----------------------------------------------------------------------------

/* Remove the current tail cell
*/
function clear_tail() {	
	rub_cell(snake.pop());
}

// ----------------------------------------------------------------------------

/* Convert true coordinates to an ID string. The ID string is the concatenation of the
	coords in order y -> x with a dot in between
*/
function coords_to_id(x,y) {
	return y + "." + x;
}
function id_to_coords(id) {
	var coords = id.split(".");
	return new Array(coords[1]*1,coords[0]*1); /// *1 ensure cast to actual ints
}

// ----------------------------------------------------------------------------

function ink_cell(id) {
	var cell = document.getElementById(id);
		cell.style.backgroundColor = "#555555";
}
function rub_cell(id) {
	var cell = document.getElementById(id);
		cell.style.backgroundColor = "#ededed"; // Move to css
}

// ----------------------------------------------------------------------------

function set_up_grid() {
	debug("Set up grid");	

	for (var y=0;y<grid_size;y++) {
		var row = document.createElement("DIV");
			row.setAttribute("class","row");

		for (var x=0;x<grid_size;x++) {		
			var cell = document.createElement("DIV");
				cell.setAttribute("id",coords_to_id(x,y));
				cell.setAttribute("class","cell");
			row.appendChild(cell);
		}
		grid.appendChild(row);
	}
}

// ----------------------------------------------------------------------------

function debug(msg) {
	var debug_area = document.getElementById("debug");	
	var current_text = debug_area.innerHTML;	
	current_text = '<div class="debug-msg">' + msg + "</div>" + current_text;
	debug_area.innerHTML = current_text;
	
	return;
}

// ----------------------------------------------------------------------------

/* Called by the key press event
*/
function navigate(e) {
	switch(e.keyCode) {
		case 38: case 87: velocity[0]= 0; velocity[1]=-1; break; // Up
		case 40: case 83: velocity[0]= 0; velocity[1]= 1; break; // Down
		case 37: case 65: velocity[0]=-1; velocity[1]= 0; break; // Left
		case 39: case 68: velocity[0]=1;  velocity[1]= 0; break; // Right
	}
}