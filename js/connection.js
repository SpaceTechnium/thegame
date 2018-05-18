"use strict";

var connection = (function() {
  var socket;

  function create(url) {
    socket = new WebSocket(url);
    console.log("oi");
    attach_cbs();
  }

  function attach_cbs() {
    socket.onclose = function () {
      console.log("Connection closed")
    }

    socket.onerror = function () {
      console.error("Connection error")
    }

    socket.onmessage = function (event) {
      var data = JSON.parse(event.data);
      var type = data.type;

      if (type == "handshake") {
        GAME.updatePlayers(data.players);
        GAME.updateBullets(data.bullets);
        GAME.universe.update(data.tick);
        SCREEN.updateRanking(data.ranking);

      } else if (type == "bulletOut") {
        GAME.deleteBullets(data.bullets);
      } else if (type == "playerOut") {
        GAME.deletePlayers(data.players);
      }

    }
  }

  return {
    estabilish: function(url) {create(url);},
    send: function(message) {socket.send(message);}
  }
})();


window.addEventListener("load", function () {
  httpGetAsync("/requestserver", connection.estabilish); // false for synchronous request
})

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