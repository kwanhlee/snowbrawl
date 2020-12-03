////  Page-scoped globals  ////

// Global Window Handles (gwh__)
let gwhGame;

// Player's Ship Dictionary
let player1_ship_dict = {};
let player1_ship_locations_alive = new Set();
let ai_ship_locations = [];
let ai_ships_locations_alive = [];

// Player choices options
let player1_options = new Set([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]);
let AI_options = new Set([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
21,22,23,24,25]);                      

// Players choices (for example: index -> 0/1)
let player_choices_dict = {}
let ai_choices_dict = {}

// State "ENUM" for game (No apparent enums in JS)
const GameState = {
  PLAYERTURN: 1,
  OPPONENTTURN: 2,
  GAMEOVER: 3
}

// Attack Result Enum
const AttackResult = {
  MISS: 0,
  HIT: 1
}

Set.prototype.getByIndex = function(index) { return [...this][index]; }

// Main
$(document).ready( function() {
  console.log("Ready!");



  // Set global handles (now that the page is loaded)
  gwhGame = $('#actualGame');
});

// Ship Class Constructor Function
class Ship {
  constructor(id) {
    this.id = id;
    this.placed = false;
    // 0 means it is in the origin
    this.location = 0;
  }
}

// Function to loop and check if all items has been placed
function isAllItemsPlaced() {
  for (const [key, value] of Object.entries(player1_ship_dict)) {
    if (value.placed === false) {
      return false;
    }
  }
  return true;
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
  $("#actualGame").append( "<audio id='menu_music'><source src='style/sounds/jingle_bells.mp3' type='audio/mpeg'></source></audio>" );

  let song = document.getElementById("menu_music");
  song.loop = true;
  song.load();
  song.play();

  leave_menu();
  create_boards();
}

function leave_menu(){
  $(".game-window").css("background-image", "url('style/images/game_background.jpg')");
  $(".title").remove();
  $(".single-player-btn").remove();

  $("#actualGame").append( "<h1 id='game_title'>Place your items</h1>" );

  let timer = 45;
  $( "#actualGame" ).append( "<h1 id='timer'>" + timer + "</h1>" );
  let timer_interval = setInterval(function(){
    timer -= 1;
    $("#timer").text(timer);

    if (timer == 0){
      clearInterval(timer_interval)
      if (isAllItemsPlaced() === true) {
        start_single_player_game_interaction();
      } else {
        end_game();
      }
    }
  }, 1000);
}

function create_boards(){
  $("#actualGame").append("<div class='board' id='userBoard'></div>");
  $("#actualGame").append("<div class='board' id='opponentBoard'></div>");

  for (let i = 1; i < 26; i++){
    $("#userBoard").append("<div id='user-tile-" + i + "' class='tile user_tile'></div>");
    $("#opponentBoard").append("<div id='opponent-tile-" + i + "' class='tile shootable'></div>");
  }

  $("#actualGame").append("<div class='select-legend'></div>")

  $( ".user_tile" ).droppable({
    classes: {
      "ui-droppable-hover": "highlight",
    },
    drop: function( event, ui ) {
      $( this ).addClass("selected");
      var $this = $(this);
      ui.draggable.position({
        my: "center",
        at: "center",
        of: $this,
        using: function(pos) {
          $(this).animate(pos, 200, "linear");
        }
      });

      $(this).droppable('option', 'accept', ui.draggable);
      update_item_placed(false, ui, $this);
    },
    out: function(event, ui) {
      $(this).droppable('option', 'accept', '.ship');
      $( this ).removeClass("selected");
    }
  });

  for (let i = 1; i < 9; i++){
    let image = ""

    if (i < 3){
      image = "snowman.png";
    }
    else if (i < 5){
      image = "reindeer.png";
    }
    else if (i < 7){
      image = "christmas_tree.png";
    }
    else {
      image = "present.png";
    }

    $('.select-legend').append("<div class='size_1_item'><img src='style/images/" + image + "' class='ship center' id='ship-" + i + "'></div>");

    // Create new ship object
    let shipObject = new Ship(i);

    // Push ship object to player_1 dictionary --> [index: shipObject] pairs
    player1_ship_dict[i] = shipObject;
  }

  $(".size_1_item").droppable({
    classes: {
      "ui-droppable-hover": "highlight",
    },
    drop: function( event, ui ) {
      var $this = $(this);
      ui.draggable.position({
        my: "center",
        at: "center",
        of: $this,
        using: function(pos) {
          $(this).animate(pos, 200, "linear");
        }
      });
  
      update_item_placed(true, ui);
    },
    out: function(event, ui) {

    }
  });

  $(".ship").draggable({
    revert: 'invalid',
    disabled: false
  });

  make_ai_ship_choices();
}

// If the item has been dropped into the user tile, update "placed" property to true
// If the item has been dropped back to the origin, update "placed" property to false
function update_item_placed(isOrigin, ui, origin=undefined) {
  // Returns for example: ship-2
  let rawDraggableId = ui.draggable.attr("id");
  
  // Returns: [ship, 2]
  let draggableId = rawDraggableId.split("-");

  // If Item is returned to the origin
  if (isOrigin === true) {
    // Modify the placed property
    player1_ship_dict[draggableId[1]].placed = false;
    player1_ship_dict[draggableId[1]].location = 0;

  } else {
    // get the id of the origin
    let rawOriginId = origin.attr("id");
    let originId = rawOriginId.split("-");

    // Modify the placed property
    player1_ship_dict[draggableId[1]].placed = true;
    player1_ship_dict[draggableId[1]].location = originId[2];
  }
}

function end_game(){
  player1_ship_dict = {};
  player1_ship_locations_alive = new Set();
  ai_ship_locations = [];
  ai_ships_locations_alive = [];

  player1_options = new Set([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]);
  AI_options = new Set([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]);                      

  player_choices_dict = {}
  ai_choices_dict = {}


  $("#actualGame").html("<h1 id='game_title' style='top: 30%; color: red;'>Game Ended</h1>");
  $("#actualGame").append( "<audio id='btn_sound'><source src='style/sounds/btn_sound.mp3' type='audio/mpeg'></source></audio>" );
  $("#actualGame").append("<button type='button' class='btn btn-primary btn-lg single-player-btn' onclick='menu_button(); document.getElementById('btn_sound').play();' style='top: 40%'>Menu</button>");
}

// Function that is called when User has placed all its items on the grid after 30 seconds
function start_single_player_game_interaction() {
  console.log("Start Match");

  // initialize player1 alive ship locations
  initialize_player1_ship_locations();


  // Change Instruction Text Label
  $("#game_title").text("Start Match");

  // Disable Draggable Interactions
  $(".ship").draggable('disable');


  // Move all child div inside Legend div into each divs inside the grid tiles and remove style attribute for positioning
  for (const [key, value] of Object.entries(player1_ship_dict)) {
    $("#ship-" + key).appendTo($("#user-tile-" + value.location));
    $("#ship-" + key).removeAttr('style');
    $("#ship-" + key).css("top", ".3vw");
  }
  
  // Remove the Legends
  $( ".select-legend" ).remove();

  $("#actualGame").append("<p id='user_ships_remaining'>Ships Remaining: 8</p>");
  $("#actualGame").append("<p id='ai_ships_remaining'>Ships Remaining: 8</p>");


  // run game
  runGame(GameState.PLAYERTURN);

}

function runGame(state) {
  if (state === GameState.GAMEOVER) {
    console.log("Game Over");
    end_game()
    return;
  }

  switch (state) {
    case GameState.PLAYERTURN:
      console.log("player turn");

      // Player can choose opponent grid
      let timer = 15;
      $("#timer").html(timer);
      let timer_interval = setInterval(function(){
        timer -= 1;
        $("#timer").text(timer);

        if (timer == 0){
          let rand_element_position = Math.floor(Math.random() * player1_options.size);
          let random_square = player1_options.getByIndex(rand_element_position);
          player1_options.delete(random_square);
          $('#opponent-tile-' + random_square)[0].click(); 
        }
      }, 1000); 

      $("#game_title").text("Select a square to shoot");

      $( ".shootable" ).bind({
        mouseover: function() {
          // highlight the mouseover target
          $(event.target).addClass("highlight");
        },
        mouseleave: function() {
          $(event.target).removeClass("highlight");
        },
        click: function() {
          $( ".shootable").unbind( "mouseover" );
          $( ".shootable").unbind( "mouseleave" );
          $( ".shootable").unbind( "click" );
          $( ".shootable").removeClass("highlight");
          clearInterval(timer_interval);
          $("#timer").text("");

          let target_id = $(event.target).attr("id");
  
          target_id = parseInt(target_id.split("-")[2]);

          player1_options.delete(target_id);

          $(event.target).removeClass("shootable");

          if(ai_ships_locations_alive.includes(target_id)){
            console.log("HIT");

            ai_ships_locations_alive.splice(ai_ships_locations_alive.indexOf(target_id), 1);

            // Need to append image of a hit sign to the event.target
            $("#opponent-tile-" + target_id).append("<img src='style/images/" + "hit.png'" + "class='attack_img center'" + ">");

            $("#ai_ships_remaining").html("Ships Remaining: " + ai_ships_locations_alive.length);

            if(ai_ships_locations_alive.length == 0){
              $("#game_title").text("You won!");
              setTimeout(function(){
                runGame(GameState.GAMEOVER);
              }, 5000); 
            }
            else {
              runGame(GameState.OPPONENTTURN);
            }
          }
          else {
            // Need to append image of miss sign to the event.target
            $("#opponent-tile-" + target_id).append("<img src='style/images/" + "miss.png'" + "class='attack_img center'" + ">");
            console.log("MISS");
            runGame(GameState.OPPONENTTURN);
          }
        }
      });
      
      break;
    case GameState.OPPONENTTURN:
      $("#game_title").text("Wait for opponent");

      // Player can choose opponent grid
      let t = 5;
      $("#timer").html(t);
      let t_interval = setInterval(function(){
        t -= 1;
        $("#timer").text(t);

        if (t == 0){
          clearInterval(t_interval);
        }
      }, 1000); 

      setTimeout(function(){
        clearInterval(t_interval);
        make_ai_attack_choices();

        // If the player ship's alive size is 0, end the game.
        if (player1_ship_locations_alive.size === 0) {
          $("#game_title").text("You lost!");
          setTimeout(function(){
            runGame(GameState.GAMEOVER);
          }, 5000); 
        } else {
          runGame(GameState.PLAYERTURN);
        }
  
      }, 5000); 

      // AI needs to make a random selection from the selectable grid squares on the users side. 
      // If the AI gets a hit, append a image over top the players ship
      // If the AI gets a miss, append a image inside the grid the AI choose to shoot.
      

      console.log("opponent Turn")
      break;
  }
}


function menu_button(){
  let menu_html = "<h1 class='title'>Snow Brawl</h1>";
  menu_html += "<audio id='btn_sound'><source src='style/sounds/btn_sound.mp3' type='audio/mpeg'></source></audio>"
  menu_html += "<button type='button' class='btn btn-primary btn-lg single-player-btn' onclick='singleplayer_game(); document.getElementById('btn_sound').play();'>Single Player</button>";
  menu_html += "<button type='button' class='btn btn-primary btn-lg multiplayer-btn single-player-btn' onclick='multiplayer_game(); document.getElementById('btn_sound').play();'>Multiplayer</button>";
  $(".game-window").css("background-image", "url('style/images/menu_background.jpg')");
  $("#actualGame").html(menu_html);
}


function initialize_player1_ship_locations() {
  for (const [key, value] of Object.entries(player1_ship_dict)) {
    player1_ship_locations_alive.add(parseInt(value.location));
  }
}
//////////////// AI Functions
function make_ai_ship_choices() {
  for(let i = 0; i < 8; ++i){
    let randNum = Math.ceil(getRandomNumber(0, 24));
    while(ai_ship_locations.includes(randNum) == true){
      randNum = Math.ceil(getRandomNumber(0, 24));
    }
    ai_ship_locations.push(randNum);
  }

  ai_ships_locations_alive = ai_ship_locations;
}

// AI makes a random choice from available options. It then appends image HIT or MISS to player's grid depending on the choice.
function make_ai_attack_choices() {

  // Choose a random number with the length as an index of the options
  let randNum = Math.ceil(getRandomNumber(0, AI_options.size - 1));

  let indexToAttack = AI_options.getByIndex(randNum);

  // Delete this number from the options
  AI_options.delete(indexToAttack);

  // If this chosen option is in Player 1 Alive, append to AI choices dict with the [choice: HIT], where 1 = HIT
  if (player1_ship_locations_alive.has(indexToAttack)) {

    ai_choices_dict[indexToAttack] = AttackResult.HIT;

    // Delete from the player location alive set
    player1_ship_locations_alive.delete(indexToAttack);

    // Append HIT image to player's grid
    $("#user-tile-" + indexToAttack).append("<img src='style/images/" + "hit.png'" + "class='attack_img center' style='top: -5vw;'" + ">");

    $("#user_ships_remaining").html("Ships Remaining: " + player1_ship_locations_alive.size);
    
  } else {
    // Else, append to AI choices dict with the choice [choice: 0]
    ai_choices_dict[indexToAttack] = AttackResult.MISS;

    // Append MISS image to player's grid
    $("#user-tile-" + indexToAttack).append("<img src='style/images/" + "miss.png'" + "class='attack_img center'" + ">");
  }
}

