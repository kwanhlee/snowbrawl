////  Page-scoped globals  ////

// Global Window Handles (gwh__)
let gwhGame;

////  Functional Code  ////

// Main
$(document).ready( function() {
  console.log("Ready!");

  // Set global handles (now that the page is loaded)
  gwhGame = $('#actualGame');
});

// Check if two objects are colliding
function isColliding(o1, o2) {
  const o1D = { 'left': o1.offset().left,
        'right': o1.offset().left + o1.width(),
        'top': o1.offset().top,
        'bottom': o1.offset().top + o1.height()
      };
  const o2D = { 'left': o2.offset().left,
        'right': o2.offset().left + o2.width(),
        'top': o2.offset().top,
        'bottom': o2.offset().top + o2.height()
      };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
     // collision detected!
     return true;
  }
  return false;
}

// Get random number between min and max integer
function getRandomNumber(min, max){
  return (Math.random() * (max - min)) + min;
}

function click_multiplayer(){
  alert("user wants to play multiplayer")
}

function click_singleplayer(){
  alert("user wants to play single player")
}
