// Globals
var game_is_running = false;
var board = undefined;
var runner = undefined;
var ghost_names = ["inky","blinky","pinky","clyde"];
var actors = new Array();
var pill_count = 0;

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

// NB. Actor classes are defined in their respective files
// pacman_actor - base class
// pacman_actor_pacman - player character
// pacman_actor_ghost - ghost actors

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

  var pman = new Pacman();
      pman.direction = LEFT;
      pman.x = 10;
      pman.y = 15;
      pman.lives = 3;

  actors["pman"] = pman;
  pman.ref = $('<div>',{id:"pman",class:"pman-left"}).appendTo('#game-canvas');
  pman.draw();
}

// Initialise the ghosts onto the board
function init_ghosts() {

  ["inky","blinky","pinky","clyde"].map(function(name) {
    var ghost = new Ghost(name);
    ghost.ref = $('<div>',{id:name,  class:"ghost "+name}  ).appendTo('#game-canvas');
    actors[name] = ghost;
    ghost.draw();
  });

  // TODO Replace with proper positional setup
  actors['inky'].x    = 10;
  actors['inky'].y    = 9;
  actors['blinky'].x  = 9;
  actors['blinky'].y  = 9;
  actors['pinky'].x   = 11;
  actors['pinky'].y   = 9;
  actors['clyde'].x   = 10;
  actors['clyde'].y   = 7;
  ["inky","blinky","pinky","clyde"].map(function(name) {
    actors[name].draw();
  });

}

// function end_game() {
//   // Tear down
//   $("#pman").remove();
// }

function create_board() {
  board = new Array(21,21);
  pill_count = 0;

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
        case 2: clss="pill";       pill_count++; break;
        case 3: clss="power-pill"; pill_count++; break;
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

function restart_after_player_death() {
  // TODO needs to be triggered by event
  // Move pman to start position
  // Move ghosts to start position
}

// Main tick function - executed once for each time through the main game loop
function game_tick() {
  ["pman","pinky","inky","blinky","clyde"].map(function(name) {
    actors[name].move();
    actors[name].draw();
  });
}

// Main key handling function
function read_key(e) {
  if (game_is_running) {
    switch(e.keyCode) {
        case 38: case 87: actors["pman"].change_direction(UP);    break; // W or up arrow
        case 40: case 83: actors["pman"].change_direction(DOWN);  break; // S or down arrow
        case 37: case 65: actors["pman"].change_direction(LEFT);  break; // A or left arrow
        case 39: case 68: actors["pman"].change_direction(RIGHT); break; // D or right arrow
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
