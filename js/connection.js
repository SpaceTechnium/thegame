"use strict";

var connection = (function() {
  var socket;

  function create(url) {
    socket = new WebSocket(url);
    attach_cbs();
  }

  function attach_cbs() {
    socket.onclose = function () {
      console.log("Connection closed")
    }

    socket.onerror = function () {
      console.error("Connection error")
      SCREEN.errorScreen(nickname.value.toUpperCase() + "?! What a silly name! It either exists or is too long!")
    }

    socket.onmessage = function (event) {
      var data = JSON.parse(event.data);
      var type = data.type;

      if (type == "update") {
        console.log(data);
        GAME.updatePlayers(data.players);
        GAME.updateBullets(data.bullets);
        GAME.universe.update(data.tick);
        SCREEN.updateRanking(data.ranking);
      } 
      else if (type == "bulletOut") {
        GAME.deleteBullets(data.bullets);
      } 
      else if (type == "playerOut") {
        GAME.deletePlayers(data.players);
      } 
      else if (type == "planet") {
        Screen.planetConquest(data.conquest);
      } 
      else if (type == "handshake") {
        socket.send(JSON.stringify({
          type: 'nickname',
          nick: nickname
        }))
        SHIP = new Ship(nickname);
	      SHIP.load_model();

        GAME = new Technium(data.seed);
        SHIP.refToScene(GAME.scene, GAME.camera)
        GAME.addShip(SHIP);

        SCREEN = new Screen();
	      SCREEN.fadeToBlack();
      	SCREEN.displayHUD();

        animate();
      } 
      else if (type == "kick") {
        // TODO: Show the error.
        SCREEN.errorScreen(nickname.value.toUpperCase() + "?! What a silly name!")
      }

    }
  }

  return {
    estabilish: function(url) {create(url);},
    send: function(message) {socket.send(message);},
    setNickname: function(nick) {nickname = nick;}
  }
})();

function httpGetAsync(theUrl, callback)
{
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      console.log(xmlHttp.responseText);
      callback(xmlHttp.responseText);
    }
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous 
  xmlHttp.send(null);
}
