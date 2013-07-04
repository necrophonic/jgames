var grid_size = 51; // Size for both X and Y axes


/* One time set up called on page load
*/
function init() {
	debug("Initialise");
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

/* Walk the entire grid, row by row, left to right, and perform the given function
   on each cell as found.
*/
function walk_grid(func) {

	for (var y=0;y<grid_size;y++) {
		for (var x=0;x<grid_size;x++) {

			var cell_id = coords_to_id(x,y);

		}
	}

}

// ----------------------------------------------------------------------------

function debug(msg) {
	var debug_area = document.getElementById("debug");	
	var current_text = debug_area.innerHTML;	
	current_text = msg + "<br>" + current_text;
	debug_area.innerHTML = current_text;
	
	return;
}