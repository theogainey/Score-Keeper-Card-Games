const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

const fs = require('fs');




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//get defult game data
app.get('/api/data', (req, res) => {
 var metadata = {};
 var gameData = fs.readFileSync('gameData.json');
 var gameDataParsed = JSON.parse(gameData);
 res.json({ _metadata: metadata, players: gameDataParsed.players });
});

//reset game data
app.post('/api/resetgamedata', (req, res) => {
 var gameData = fs.readFileSync('gameData.json');
 var gameDataParsed = JSON.parse(gameData);
 var defultData = fs.readFileSync('defultData.json');
 var defultDataParsed = JSON.parse(defultData);
 var writeData = JSON.stringify(defultDataParsed, null,2);
 gameDataParsed.numPlayers=0;
 fs.writeFile('gameData.json', writeData, done)
 function done(){
   var metadata = {};
   res.json({ _metadata: metadata, players: defultDataParsed.players });
  }
});


//add player
app.post('/api/newplayer/:playername?', (req, res) => {
 var gameData = fs.readFileSync('gameData.json');
 var gameDataParsed = JSON.parse(gameData);
 if(req.params.playername){
  var playerid= gameDataParsed.numPlayers;
  var playername= req.params.playername;
  gameDataParsed.players[playerid]= {
   id: playerid,
   name: playername ,
   currentBid: 0,
   score: 0
  };
  gameDataParsed.numPlayers++;
  var writeData = JSON.stringify(gameDataParsed, null,2);
  fs.writeFile('gameData.json', writeData, done)
  function done(){
    res.json({ players: gameDataParsed.players  });
  }
 }
  else{
    res.json({ players: gameDataParsed.players  });
  }
});

//Post Data needed to start game.
app.post('/api/startgame/:largesthand', (req, res) => {
 var gameData = fs.readFileSync('gameData.json');
 var gameDataParsed = JSON.parse(gameData);
 gameDataParsed.largestHand = parseInt(req.params.largesthand);
 gameDataParsed.roundData[0].numOfCards = parseInt(req.params.largesthand);
 var writeData = JSON.stringify(gameDataParsed, null,2);
 fs.writeFile('gameData.json', writeData, done)
 function done(){
 res.json({status: 'sucess'});
 };
});


//Get Data for bid round
app.get('/api/bidround', (req, res) => {
 var gameData = fs.readFileSync('gameData.json');
 var gameDataParsed = JSON.parse(gameData);
 var roundid = gameDataParsed.roundData.length -1;
 gameDataParsed.players.forEach(function(item, index, array) {
   item.currentBid = 0;
 });
 gameDataParsed.roundData[roundid].totalBid = 0;
 var writeData = JSON.stringify(gameDataParsed, null,2);
 fs.writeFile('gameData.json', writeData, done)
 function done(){
   res.json({
    players: gameDataParsed.players,
    roundData: gameDataParsed.roundData,
    numofPlayer: gameDataParsed.numPlayers,
   });
 }
});

//Get Data for score board
app.get('/api/scoreboard', (req, res) => {
 var gameData = fs.readFileSync('gameData.json');
 var gameDataParsed = JSON.parse(gameData);
 res.json({
    players: gameDataParsed.players,
    roundData: gameDataParsed.roundData,
   });
});

//Get Data for score round Component
app.get('/api/scoreround', (req, res) => {
 var gameData = fs.readFileSync('gameData.json');
 var gameDataParsed = JSON.parse(gameData);
 res.json({
    players: gameDataParsed.players,
    roundData: gameDataParsed.roundData,
    cardCountDirection: gameDataParsed.cardCountDirection,
    largestHand: gameDataParsed.largestHand
   });
});

//Get Data for Final Scores
//Need To sort our players
app.get('/api/finalscores', (req, res) => {
 var gameData = fs.readFileSync('gameData.json');
 var gameDataParsed = JSON.parse(gameData);
 res.json({
    players: gameDataParsed.players,
   });
});


//post player bid
app.post('/api/bid/:playerid/:roundid/:newbid', (req, res) => {
 var playerid= req.params.playerid;
 var roundid = req.params.roundid;
 var newbid = req.params.newbid;
 var gameData = fs.readFileSync('gameData.json');
 var gameDataParsed = JSON.parse(gameData);
 gameDataParsed.players[playerid].currentBid = parseInt(newbid);

 var totalbids=0;
 for (var i = 0; i < gameDataParsed.players.length; i++) {
   totalbids= totalbids + gameDataParsed.players[i].currentBid;
 }
 gameDataParsed.roundData[roundid].totalBid = totalbids;
 var writeData = JSON.stringify(gameDataParsed, null,2);
 fs.writeFile('gameData.json', writeData, done)
 function done(){
  res.json({
             players:  gameDataParsed.players,
             totalBid: totalbids
           });
  }
});

//get player bid
app.get('/api/bid/:playerid', (req, res) => {
 var playerid= req.params.playerid;
 var gameData = fs.readFileSync('gameData.json');
 var gameDataParsed = JSON.parse(gameData);
 var playBid = gameDataParsed.players[playerid].currentBid;
 res.json({ playerBid: playBid  });
});

//get total bid
app.get('/api/totalbids', (req, res) => {
 var totalbids=0;
 var gameData = fs.readFileSync('gameData.json');
 var gameDataParsed = JSON.parse(gameData);
 for (var i = 0; i < gameDataParsed.players.length; i++) {
   totalbids= totalbids + gameDataParsed.players[i].currentBid;
 }
 res.json({ totalBid: totalbids  });
});


//score round
app.post('/api/score/:roundNum/:newscores', (req, res) => {
  var newscores = JSON.parse(req.params.newscores);
  var round = JSON.parse(req.params.roundNum);
  var gameData = fs.readFileSync('gameData.json');
  var gameDataParsed = JSON.parse(gameData);
  gameDataParsed.players.forEach(function(item, index, array) {
    item.score = newscores[index];
  });
  if((gameDataParsed.roundData[(round-1)].numOfCards ===1)&& (gameDataParsed.cardCountDirection ==="Down" )){
    gameDataParsed.cardCountDirection = "Up";
    gameDataParsed.roundData[round]={
      roundNum: round + 1,
      numOfCards: 1 ,
      totalBid: 0
    }
  }
  else if (gameDataParsed.cardCountDirection ==="Up") {
    gameDataParsed.roundData[round]={
      roundNum: round + 1,
      numOfCards: (gameDataParsed.roundData[(round-1)].numOfCards) + 1,
      totalBid: 0
    }
  }
  else{
    gameDataParsed.roundData[round]={
      roundNum: round + 1,
      numOfCards: (gameDataParsed.roundData[(round-1)].numOfCards) -1,
      totalBid: 0
    }
  }
  var writeData = JSON.stringify(gameDataParsed, null,2);
  fs.writeFile('gameData.json', writeData, done)
  function done(){
   res.json({ status: 'success'  });
   }
});
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
