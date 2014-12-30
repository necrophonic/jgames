var game_is_running = false;

var board = undefined;

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


var ref_board = $("#game-board");

var runner = undefined;

var pman = {};
    pman.alive = false;
    pman.direction = LEFT;
    pman.cellx = undefined;
    pman.celly = undefined;
    pman.ref   = $("#pman");
    pman.score = 0;

function init() {}

function start_game() {

  // Generate board
  create_board();

  // Initialise positions
  reset_pman();

  // Swap from the title screen to the game
  $("#game-board").show();
  $("#title-screen").hide();

  runner = setInterval("game_tick();",GAME_SPEED);
  game_is_running = true;
}

function reset_pman() {
  pman.alive = true;
  pman.direction = LEFT;
  pman.cellx = 10;
  pman.celly = 15;
  pman.score = 0;

  $("#pman").addClass("pman-left");

  draw_pman();
}

function create_board() {
  board = new Array(21,21);

  $("#game-canvas").empty();

  // TODO move to data somewhere
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


  for (y=0;y<21;y++) {
    for (x=0;x<21;x++) {
      // TODO Icky mix of javascript and jquery and bit brutish

      switch(board[y][x]) {

        case 1:
          var d = document.createElement("DIV");
          d.setAttribute("class","wall");
          d.setAttribute("style","top: "+y*SCALING_Y+"; left: "+x*SCALING_X);
          $("#game-canvas").append(d);
          break;
        case 2:
          var d = document.createElement("DIV");
          d.setAttribute("class","pill");
          d.setAttribute("id",y+"-"+x);
          d.setAttribute("style","top: "+y*SCALING_Y+"; left: "+x*SCALING_X);
          $("#game-canvas").append(d);
          break;
        case 3:
          var d = document.createElement("DIV");
          d.setAttribute("class","power-pill");
          d.setAttribute("id",y+"-"+x);
          d.setAttribute("style","top: "+y*SCALING_Y+"; left: "+x*SCALING_X);
          $("#game-canvas").append(d);
          break;
        case 4:
          var d = document.createElement("DIV");
          d.setAttribute("class","ghost-gate");
          d.setAttribute("style","top: "+y*SCALING_Y+"; left: "+x*SCALING_X);
          $("#game-canvas").append(d);
          break;
      }

    }
  }
}

// Main tick function - executed once for each time through the main game loop
function game_tick() {

  move_pman();

}

function move_pman() {

  // TODO check ghosts

  var proposed = {};
      proposed.x = pman.cellx;
      proposed.y = pman.celly;

  switch(pman.direction) {
    case UP:    proposed.y = pman.celly - 1; break;
    case DOWN:  proposed.y = pman.celly + 1; break;
    case LEFT:  proposed.x = pman.cellx - 1; break;
    case RIGHT: proposed.x = pman.cellx + 1; break;
  }

  // [WALL]
  // Look ahead to see if the potental move would be a wall. If so then
  // quit moving.
  if (board[proposed.y][proposed.x]==WALL || board[proposed.y][proposed.x]==GHOSTGATE) {
    return;
  }

  // [PILL]
  // Look underneath to see if it's a pill. If so collect it!
  if (board[pman.celly][pman.cellx]==PILL) {
    board[pman.celly][pman.cellx] = 0; // Remove it
    $("#"+pman.celly+"-"+pman.cellx).hide(); // TODO look at efficiency - slows it down
    pman.score = pman.score + 10;
    console.log("SCORE "+pman.score);
    return;
  }

  // [POWER PILL]
  // Look underneath to see if it's a power pill. If so chug it!
  if (board[pman.celly][pman.cellx]==POWERPILL) {
    board[pman.celly][pman.cellx] = 0; // Remove it
    $("#"+pman.celly+"-"+pman.cellx).hide(); // TODO look at efficiency - slows it down
    pman.score = pman.score + 50;
    console.log("SCORE "+pman.score);
    // TODO Trigger ghost chase
    return;
  }

  pman.celly = proposed.y;
  pman.cellx = proposed.x;

  // Warp - only occurs if board is open on edges
  if (pman.cellx<0) { pman.cellx = 20 }
  if (pman.cellx>20){ pman.cellx = 0  }
  if (pman.celly<0) { pman.celly = 20 }
  if (pman.celly>20){ pman.celly = 0  }

  draw_pman();
}

function draw_pman() {
  var xy = cell_to_xy(pman.cellx,pman.celly);

  var $pm = $("#pman");
  $pm.css({left: xy[0]})
  $pm.css({top:  xy[1]});
}

function cell_to_xy(cellx,celly) {
  return [cellx*SCALING_X,celly*SCALING_Y];
}

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
  if (direction != pman.direction) {
    pman.direction = direction;
    $("#pman").removeClass("pman-left pman-right pman-up pman-down");
    switch (pman.direction) {
      case UP:    $("#pman").addClass("pman-up");    break;
      case DOWN:  $("#pman").addClass("pman-down");  break;
      case LEFT:  $("#pman").addClass("pman-left");  break;
      case RIGHT: $("#pman").addClass("pman-right"); break;
    }
  }
}
