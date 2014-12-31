// Globals
var game_is_running = false;
var board = undefined;
var runner = undefined;
var actors = new Array();

// General game constants
var SCALING_X  = 28;
var SCALING_Y  = 28;
var GAME_SPEED = 175; // ms between ticks

// Directional constants
var LEFT  = 0;
var RIGHT = 1;
var UP    = 2;
var DOWN  = 3;

// Map constants
var SPACE     = 0;
var WALL      = 1;
var PILL      = 2;
var POWERPILL = 3;
var GHOSTGATE = 4;

function init() {}

function start_game() {

  // Generate board
  create_board();

  // Initialise positions
  init_pman();
  init_ghosts();

  // Swap from the title screen to the game
  $("#game-canvas").show();
  $("#title-screen").hide();

  runner = setInterval("game_tick();",GAME_SPEED);
  game_is_running = true;
}

// Initialise the player pac man onto the board
function init_pman() {
  var pman = {};
  pman.direction = LEFT;
  pman.x = 10;
  pman.y = 15;
  pman.score = 0;
  actors["pman"] = pman;
  $('<div>',{id:"pman",class:"pman-left"}).appendTo('#game-canvas');
  draw("pman");
}

// Initialise the ghosts onto the board
function init_ghosts() {

  $('<div>',{id:"inky",  class:"ghost inky"}  ).appendTo('#game-canvas');
  $('<div>',{id:"blinky",class:"ghost blinky"}).appendTo('#game-canvas');
  $('<div>',{id:"pinky", class:"ghost pinky"} ).appendTo('#game-canvas');
  $('<div>',{id:"clyde", class:"ghost clyde"} ).appendTo('#game-canvas');

  actors['inky']    = { alive: true, x: 10, y: 9 };
  actors['blinky']  = { alive: true, x: 9,  y: 9 };
  actors['pinky']   = { alive: true, x: 11, y: 9 };
  actors['clyde']   = { alive: true, x: 10, y: 7 };

  draw( "inky" );
  draw( "blinky" );
  draw( "pinky" );
  draw( "clyde" );

}

// function end_game() {
//   // Tear down
//   $("#pman").remove();
// }

function create_board() {
  board = new Array(21,21);

  $("#game-canvas").empty(); // Clear up anything from a previous game

  // Set up the board we want - will load into the "board" array
  load_game_board(1);

  // Now we have the board data, create and place the actual elements
  // that are needed to display it.
  for (y=0;y<board.length;y++) {
    for (x=0;x<board[0].length;x++) {

      var clss = undefined;

      switch(board[y][x]) {
        case 1: clss="wall";       break;
        case 2: clss="pill";       break;
        case 3: clss="power-pill"; break;
        case 4: clss="ghost-gate"; break;
      }
      $("<div>",{
        id    : y+"-"+x,
        class : clss,
        style : "top : " + y*SCALING_Y + "; left : " + x*SCALING_X
      }).appendTo($("#game-canvas"));
    }
  }
}

// Main tick function - executed once for each time through the main game loop
function game_tick() {
  move_pman();
  for (var actor in actors) {
    draw(actor);
  }
}

function move_pman() {

  // Take a refence shorthand to keep the syntax clean as we'll be using
  // pman a lot in this method!
  pman = actors["pman"];

  // TODO check ghosts

  // Before performing the move, check where we propose to go.
  // This allows us to check for wall hits before actually moving onto
  // the wall space.
  var proposed = {};
      proposed.x = pman.x;
      proposed.y = pman.y;

  switch(pman.direction) {
    case UP:    proposed.y = pman.y - 1; break;
    case DOWN:  proposed.y = pman.y + 1; break;
    case LEFT:  proposed.x = pman.x - 1; break;
    case RIGHT: proposed.x = pman.x + 1; break;
  }


  // For checking collisions we look at the logical board map rather than
  // trying visible collision detection.

  // [WALL]
  // Look ahead to see if the potental move would be a wall. If so then
  // quit moving.
  if (board[proposed.y][proposed.x]==WALL || board[proposed.y][proposed.x]==GHOSTGATE) {
    return;
  }

  // [PILL]
  // Look underneath to see if it's a pill. If so collect it!
  if (board[pman.y][pman.x]==PILL) {
    board[pman.y][pman.x] = 0; // Remove it
    $("#"+pman.y+"-"+pman.x).hide();
    pman.score = pman.score + 10;
    console.log("SCORE "+pman.score);
  }

  // [POWER PILL]
  // Look underneath to see if it's a power pill. If so chug it!
  if (board[pman.y][pman.x]==POWERPILL) {
    board[pman.y][pman.x] = 0; // Remove it
    $("#"+pman.y+"-"+pman.x).hide();
    pman.score = pman.score + 50;
    console.log("SCORE "+pman.score);
    // TODO Trigger ghost chase
  }

  // Now we've resolved collisions we actually move our player on screen.
  pman.y = proposed.y;
  pman.x = proposed.x;

  // Warp - only occurs if board is open on edges and allows wrap around
  // from one edge to another.
  if (pman.x<0) { pman.x = 20 }
  if (pman.x>20){ pman.x = 0  }
  if (pman.y<0) { pman.y = 20 }
  if (pman.y>20){ pman.y = 0  }

  return;
}

function draw(actor_id) {
  var actor = actors[actor_id];
  var $selector = $("#"+actor_id);
  $selector.css({left: actors[actor_id].x * SCALING_X});
  $selector.css({top:  actors[actor_id].y * SCALING_Y});
  return;
}

// Main key handling function
function read_key(e) {
  if (game_is_running) {
    switch(e.keyCode) {
        case 38: case 87: change_pman_direction(UP);    break; // W or up arrow
        case 40: case 83: change_pman_direction(DOWN);  break; // S or down arrow
        case 37: case 65: change_pman_direction(LEFT);  break; // A or left arrow
        case 39: case 68: change_pman_direction(RIGHT); break; // D or right arrow
    }
  }
}

// Change player direction (only if not already going that way)
function change_pman_direction(direction) {
  var pman = actors["pman"];
  if (direction != pman.direction) {
    pman.direction = direction;
    $("#pman").removeClass("pman-left pman-right pman-up pman-down");
    switch (direction) {
      case UP:    $("#pman").addClass("pman-up");    break;
      case DOWN:  $("#pman").addClass("pman-down");  break;
      case LEFT:  $("#pman").addClass("pman-left");  break;
      case RIGHT: $("#pman").addClass("pman-right"); break;
    }
  }
}

function load_game_board(board_id) {
  board = new Array();
  switch(board_id) {
    case 1:
      board[0]  = [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0];
      board[1]  = [0,1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1,0];
      board[2]  = [0,1,3,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,3,1,0];
      board[3]  = [0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0];
      board[4]  = [0,1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1,0];
      board[5]  = [0,1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1,0];
      board[6]  = [0,1,1,1,1,2,1,1,1,0,1,0,1,1,1,2,1,1,1,1,0];
      board[7]  = [0,0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0,0];
      board[8]  = [1,1,1,1,1,2,1,0,1,1,4,1,1,0,1,2,1,1,1,1,1];
      board[9]  = [0,0,0,0,0,2,0,0,1,0,0,0,1,0,0,2,0,0,0,0,0];
      board[10] = [1,1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1,1];
      board[11] = [0,0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0,0];
      board[12] = [0,1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1,0];
      board[13] = [0,1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1,0];
      board[14] = [0,1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1,0];
      board[15] = [0,1,3,2,1,2,2,2,2,2,0,2,2,2,2,2,1,2,3,1,0];
      board[16] = [0,1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,1,1,0];
      board[17] = [0,1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1,0];
      board[18] = [0,1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1,0];
      board[19] = [0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0];
      board[20] = [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0];
  }
}
