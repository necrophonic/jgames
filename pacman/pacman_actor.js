var Actor = function(name) {
  this.name = name;
  this.x    = 0; // Current x cell coord (not screen coord)
  this.y    = 0; // Current y cell coord (not screen coord)
  this.direction = -1; // Enum of the current direction of travel
  this.ref  = undefined;
  this.is_alive = true;
};
Actor.prototype.move = function() {};
Actor.prototype.draw = function() {
    if (!this.is_alive) {return;}
    this.ref.css({left: this.x * SCALING_X});
    this.ref.css({top:  this.y * SCALING_Y});
    return;
}
