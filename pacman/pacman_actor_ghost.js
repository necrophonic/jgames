var Ghost = function(name) {
  Actor.call(this,name); // Inherit from the Actor class
  this.is_scared = false;
};
Ghost.prototype = Object.create(Actor.prototype);
Ghost.prototype.constructor = Ghost;
