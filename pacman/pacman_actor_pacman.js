var Pacman = function() {
  Actor.call(this,"pacman"); // Inherit from the Actor class
  this.lives = 0;
  this.score = 0;
};
Pacman.prototype = Object.create(Actor.prototype);
Pacman.prototype.constructor = Pacman;

// Override
Pacman.prototype.move = function() {
  // Before performing the move, check where we propose to go.
  // This allows us to check for wall hits before actually moving onto
  // the wall space.
  var proposed = {};
  proposed.x = this.x;
  proposed.y = this.y;

  var pacman = this;

  switch(this.direction) {
    case UP:    proposed.y = this.y - 1; break;
    case DOWN:  proposed.y = this.y + 1; break;
    case LEFT:  proposed.x = this.x - 1; break;
    case RIGHT: proposed.x = this.x + 1; break;
  }

  // [GHOSTS]
  ghost_names.map(function(name) {
    ghost_actor = actors[name];
    if (ghost_actor.is_alive && pacman.x == ghost_actor.x && pacman.y == ghost_actor.y) {
      pacman.lives--;
      console.log("Killed by a ghost. "+pacman.lives+" lives remaining");
      if (pacman.lives == 0) {
        // DEAD!!!
        console.log("PLAYER IS DEAD!!!");
        // TODO End game
      }
      restart_after_player_death(); // TODO throw event!
    }
  });


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
  if (board[this.y][this.x]==PILL) {
    board[this.y][this.x] = 0; // Remove it
    $("#"+this.y+"-"+this.x).hide();
    this.score = this.score + 10;
    console.log("SCORE "+this.score);
  }

  // [POWER PILL]
  // Look underneath to see if it's a power pill. If so chug it!
  if (board[this.y][this.x]==POWERPILL) {
    board[this.y][this.x] = 0; // Remove it
    $("#"+this.y+"-"+this.x).hide();
    this.score = this.score + 50;
    console.log("SCORE "+this.score);
    // TODO Trigger ghost chase
  }

  // Now we've resolved collisions we actually move our player on screen.
  this.y = proposed.y;
  this.x = proposed.x;

  // Warp - only occurs if board is open on edges and allows wrap around
  // from one edge to another.
  if (this.x<0) { this.x = 20 }
  if (this.x>20){ this.x = 0  }
  if (this.y<0) { this.y = 20 }
  if (this.y>20){ this.y = 0  }

  return;
}

Pacman.prototype.change_direction = function(direction) {
    if (direction != this.direction) {
      this.direction = direction;
      this.ref.removeClass("pman-left pman-right pman-up pman-down");
      switch (direction) {
        case UP:    this.ref.addClass("pman-up");    break;
        case DOWN:  this.ref.addClass("pman-down");  break;
        case LEFT:  this.ref.addClass("pman-left");  break;
        case RIGHT: this.ref.addClass("pman-right"); break;
      }
    }
}
