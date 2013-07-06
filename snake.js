var grid_size = 51; // Size for both X and Y axes
var midpoint  = undefined;
var speed	  = 100;
var start_speed = 100;
var runner    = undefined; // Interval
var snake	  = undefined; // Snake queue
var grid      = undefined;
var score	  = 0;

var fruit 	   = {}; // Only allowing single fruit for now
    fruit.alive	  	   = false;
	fruit.position 	   = undefined;
	fruit.life	  	   = 0;			// Time to live (decreases)
	fruit.start_value  = 10;
	fruit.likely	   = 10; // Percentage chance of spawning

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
	speed = start_speed;

	velocity = new Array( 0, 1 ); // Start moving downwards

	runner = setInterval("update();",speed);
}

// ----------------------------------------------------------------------------

function update() {

	move_snake();	

	// Check to create fruit
	if (!fruit.alive) {

		var rand = Math.floor((Math.random()*100)+1);
		if (rand <= fruit.likely) {
			spawn_fruit();			
		}

	}
	else {
		decay_fruit();
	}
}

// ----------------------------------------------------------------------------

/* Move the snake as per velocity. We do this by unshifting to one end
*  of the queue.
*/
function move_snake() {	
	var head = id_to_coords( snake[0] ); // Current head

	head[0] += velocity[0];
	head[1] += velocity[1];

	// Test the proposed new head position to see whether it's hit something
	// nice or nasty.
	var new_head = coords_to_id(head[0],head[1]);
		
	if (has_hit_body(new_head) || has_hit_boundary(new_head)) {
		end_game();
	}
		
	ink_cell(new_head);
	snake.unshift(new_head);

	if (!check_hit_fruit(new_head)) {
		// If we haven't eaten fruit, then let the end of the tail drop off.
		clear_tail();
	}

	return;
}

// ----------------------------------------------------------------------------

function check_hit_fruit(position) {
	if (!fruit.alive) { return }

	if (position == fruit.position) {		
		score += fruit.value;

		debug("Score: "+score);
		speed--;
		return true;
	}

	return false;
}

// ----------------------------------------------------------------------------

function spawn_fruit() {
	debug("Fruit spawning");
	// Randomly generate where to place the fruit
	var rand_x = Math.floor(Math.random()*grid_size);
	var rand_y = Math.floor(Math.random()*grid_size);

	debug("Place new fruit at "+rand_x+","+rand_y);

	fruit.position = coords_to_id(rand_x,rand_y);

	// Check whether we're clasing with the snake!
	if (in_snake(fruit.position)) {
		debug("Fruit clash with snake");
		spawn_fruit();
	}

	ink_cell(fruit.position);

	fruit.life  = 50;
	fruit.alive = true;
	fruit.value = fruit.start_value;
}

// ----------------------------------------------------------------------------

function decay_fruit() {
	fruit.life--;
	//fruit.value = (fruit.start_value / 100 ) * fruit.life;
	//debug("Fruit value "+fruit.value);

	if (fruit.life == 0) {
		rub_cell(fruit.position);
		fruit.alive=false;
	}
}

// ----------------------------------------------------------------------------

function has_hit_body(proposed) {
	var is_in = in_snake(proposed);
	if (is_in) {
		debug("Hit body!");
		return true;
	}
	return false;
}

// ----------------------------------------------------------------------------

/**
* Check whether a given position is within the body of the snake
* @param	position	string	position to be checked
* @returns	true=in snake, false=not in snake
*/
function in_snake(position) {
	for (var s=0; s<snake.length; s++) {
		if (snake[s] == position) {			
			return true;
		}
	}
	return false
}

// ----------------------------------------------------------------------------

function has_hit_boundary(proposed) {
	var coords = id_to_coords(proposed);
	var x = coords[0];
	var y = coords[1];

	if (x < 0 || x > grid_size-1 || y < 0 || y > grid_size-1) {
		debug("Hit wall!");
		return true;
	}
	return false;
}

// ----------------------------------------------------------------------------

function end_game() {
	if (runner) {
		clearInterval(runner);
	}

	// TODO highscore

	debug("Final score "+score);
	debug("Game stopped");
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