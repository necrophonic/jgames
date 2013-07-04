var grid_size = 51; // Size for both X and Y axes
var speed	  = 1000; // 1s
var runner    = undefined; // Interval

/* One time set up called on page load
*/
function init() {
	debug("Initialise");
	set_up_grid();
}

// ----------------------------------------------------------------------------

/* Clear down previous state (if any) and start a new game.
*/
function new_game() {

}

// ----------------------------------------------------------------------------

/* Convert true coordinates to an ID string. The ID string is the concatenation of the
	coords in order y -> x with a dash in between.
*/
function coords_to_id(x,y) {
	return y + "-" + x;
}

// ----------------------------------------------------------------------------

function set_up_grid() {
	debug("Set up grid");
	var grid = document.getElementById("snake");

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

/* Walk the entire grid, row by row, left to right, and perform the given function
   on each cell as found.
*/
function walk_grid(func) {

	for (var y=0;y<grid_size;y++) {
		for (var x=0;x<grid_size;x++) {

			var cell_id = coords_to_id(x,y);
			var cell    = document.getElementById(cell_id);
			func(cell);

		}
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