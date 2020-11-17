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

function multiplayer_game(){
  leave_menu();
  create_boards();
}

function singleplayer_game(){
  leave_menu();
  create_boards();
}

function leave_menu(){
  $(".game-window").css("background-image", "url('style/images/game_background.jpg')");
  $(".title").remove();
  $(".single-player-btn").remove();

  $("#actualGame").append( "<h1 id='place_items_title'>Place your items</h1>" );

  let timer = 30;
  $( "#actualGame" ).append( "<h1 id='timer'>" + timer + "</h1>" );
  let timer_interval = setInterval(function(){
    timer -= 1;
    console.log(timer)
    $("#timer").html(timer);

    if (timer == 0){
      clearInterval(timer_interval)
      end_game();
    }
  }, 1000);
}

function create_boards(){
  $("#actualGame").append("<div class='board' id='userBoard'></div>")
  $("#actualGame").append("<div class='board' id='opponentBoard'></div>")

  for (let i = 1; i < 26; i++){
    $("#userBoard").append("<div id='user-tile-" + i + "' class='tile'></div>");
    $("#opponentBoard").append("<div id='opponent-tile-" + i + "' class='tile'></div>");
  }
}

function end_game(){
  $("#actualGame").html("<h1 id='place_items_title' style='top: 30%; color: red;'>Game Ended</h1>");
  $("#actualGame").append("<button type='button' class='btn btn-primary btn-lg single-player-btn' onclick='menu_button()' style='top: 40%'>Menu</button>")
}

function menu_button(){
  let menu_html = "<h1 class='title'>Snow Brawl</h1>"
  menu_html += "<button type='button' class='btn btn-primary btn-lg single-player-btn' onclick='singleplayer_game()'>Single Player</button>"
  menu_html += "<button type='button' class='btn btn-primary btn-lg multiplayer-btn single-player-btn' onclick='multiplayer_game()'>Multiplayer</button>"
  $("#actualGame").html(menu_html)
}