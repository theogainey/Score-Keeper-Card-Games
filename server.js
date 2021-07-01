const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

const fs = require('fs');




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//get game data by id
app.get('/api/getgamedata/:gameID', (req, res)=>{
  var gameID= req.params.gameID;
  var gameData = fs.readFileSync('gameData.json');
  var gameDataParsed = JSON.parse(gameData);
  var thisGameData = gameDataParsed.gameDataObjects[gameID];
  res.json({gameData: thisGameData});
});

//post new game id
app.post('/api/postnewgame', (req,res)=>{
  var defultData = fs.readFileSync('defultData.json');
  var defultDataParsed = JSON.parse(defultData);
  //assign id here
  var gameData = fs.readFileSync('gameData.json');
  var gameDataParsed = JSON.parse(gameData);
  var newgameID = gameDataParsed.gameDataObjects.length;
  gameDataParsed.gameDataObjects[newgameID]=defultDataParsed;
  gameDataParsed.gameDataObjects[newgameID].gameID= newgameID;
  var writeData = JSON.stringify(gameDataParsed, null,2);
  fs.writeFile('gameData.json', writeData, done)
  function done(){
    res.json({gameID: newgameID });
   }
});
// reset game data
app.delete('/api/cleardata', (req, res)=>{
  var gameData = fs.readFileSync('gameData.json');
  var gameDataParsed = JSON.parse(gameData);
  gameDataParsed.gameDataObjects=[];
  var writeData = JSON.stringify(gameDataParsed, null,2);
  fs.writeFile('gameData.json', writeData, done)
  function done(){
    res.json({response: "sucess" });
   }
});

//clearout a games records
app.delete('/api/cleargame/:gameID', (req, res)=>{
  var gameID = req.params.gameID;
  var gameData = fs.readFileSync('gameData.json');
  var gameDataParsed = JSON.parse(gameData);
  gameDataParsed.gameDataObjects[gameID]=null;
  var writeData = JSON.stringify(gameDataParsed, null,2);
  fs.writeFile('gameData.json', writeData, done)
  function done(){
    res.json({response: "sucess" });
   }
});

//get defult game data
app.get('/api/data', (req, res) => {
 var gameData = fs.readFileSync('gameData.json');
 var gameDataParsed = JSON.parse(gameData);
 res.json({players: gameDataParsed.players });
});

//get game data by ID
app.get('/api/data/:gameID', (req, res)=>{
  var gameID = req.params.gameID;
  var gameData = fs.readFileSync('gameData.json');
  var gameDataParsed = JSON.parse(gameData);
  var players = gameDataParsed.gameDataObjects[gameID].players;
  res.json({players: players});
});

//reset game data
app.put('/api/resetgamedata/:gameID', (req, res) => {
 var gameID = req.params.gameID;
 var gameData = fs.readFileSync('gameData.json');
 var gameDataParsed = JSON.parse(gameData);
 gameDataParsed.gameDataObjects[gameID].players=[];
 gameDataParsed.gameDataObjects[gameID].numPlayers=0;
 var players= gameDataParsed.gameDataObjects[gameID].players;
 var writeData = JSON.stringify(gameDataParsed, null,2);
 fs.writeFile('gameData.json', writeData, done)
 function done(){
   res.json({players: players });
  }
});


//add player
app.post('/api/newplayer/:gameID/:playername', (req, res) => {
 var gameData = fs.readFileSync('gameData.json');
 var gameDataParsed = JSON.parse(gameData);
 var gameID = req.params.gameID;
 if(req.params.playername){
  var playerid= gameDataParsed.gameDataObjects[gameID].numPlayers;
  var playername= req.params.playername;
  gameDataParsed.gameDataObjects[gameID].players[playerid]= {
   id: playerid,
   name: playername ,
   currentBid: 0,
   score: 0
  };
  gameDataParsed.gameDataObjects[gameID].numPlayers++;
  var writeData = JSON.stringify(gameDataParsed, null,2);
  fs.writeFile('gameData.json', writeData, done)
  function done(){
    res.json({ players: gameDataParsed.gameDataObjects[gameID].players  });
  }
 }
  else{
    res.json({ players: gameDataParsed.players  });
  }
});

//Put Method update data needed to start game.
app.put('/api/startgame/:gameID/:largesthand', (req, res) => {
 var gameID= req.params.gameID;
 var gameData = fs.readFileSync('gameData.json');
 var gameDataParsed = JSON.parse(gameData);
 gameDataParsed.gameDataObjects[gameID].largestHand = parseInt(req.params.largesthand);
 gameDataParsed.gameDataObjects[gameID].roundData[0].numOfCards = parseInt(req.params.largesthand);
 var writeData = JSON.stringify(gameDataParsed, null,2);
 fs.writeFile('gameData.json', writeData, done)
 function done(){
 res.json({status: 'sucess'});
 };
});


//Get Data for bid round
app.get('/api/bidround/:gameID', (req, res) => {
 var gameID = req.params.gameID;
 var gameData = fs.readFileSync('gameData.json');
 var gameDataParsed = JSON.parse(gameData);
 var thisGameData = gameDataParsed.gameDataObjects[gameID];
 var roundid = thisGameData.roundData.length -1;
 thisGameData.players.forEach(function(item, index, array) {
   item.currentBid = 0;
 });
 thisGameData.roundData[roundid].totalBid = 0;
 gameDataParsed.gameDataObjects[gameID]=thisGameData;
 var writeData = JSON.stringify(gameDataParsed, null,2);
 fs.writeFile('gameData.json', writeData, done)
 function done(){
   res.json({
    players: thisGameData.players,
    roundData: thisGameData.roundData,
    numofPlayer: thisGameData.numPlayers,
   });
 }
});

//Get Data for score board
app.get('/api/scoreboard/:gameID', (req, res) => {
 var gameID = req.params.gameID;
 var gameData = fs.readFileSync('gameData.json');
 var gameDataParsed = JSON.parse(gameData);
 var thisGameData= gameDataParsed.gameDataObjects[gameID];
 res.json({
    players: thisGameData.players,
    roundData: thisGameData.roundData,
   });
});

//Get Data for score round Component
app.get('/api/scoreround/:gameID', (req, res) => {
  var gameID= req.params.gameID;
 var gameData = fs.readFileSync('gameData.json');
 var gameDataParsed = JSON.parse(gameData);
 var thisGameData = gameDataParsed.gameDataObjects[gameID];

 res.json({
    players: thisGameData.players,
    roundData: thisGameData.roundData,
    cardCountDirection: thisGameData.cardCountDirection,
    largestHand: thisGameData.largestHand
   });
});

//Get Data for Final Scores
app.get('/api/finalscores/:gameID', (req, res) => {
 var gameID = req.params.gameID;
 var gameData = fs.readFileSync('gameData.json');
 var gameDataParsed = JSON.parse(gameData);
 res.json({
    players: gameDataParsed.gameDataObjects[gameID].players,
   });
});


//update player's bid
app.put('/api/bid/:gameID/:playerid/:roundid/:newbid', (req, res) => {
 var gameID = req.params.gameID;
 var playerid= req.params.playerid;
 var roundid = req.params.roundid;
 var newbid = req.params.newbid;
 var gameData = fs.readFileSync('gameData.json');
 var gameDataParsed = JSON.parse(gameData);
 var thisGameData= gameDataParsed.gameDataObjects[gameID];
 thisGameData.players[playerid].currentBid = parseInt(newbid);

 var totalbids=0;
 for (var i = 0; i < thisGameData.players.length; i++) {
   totalbids= totalbids + thisGameData.players[i].currentBid;
 }
 thisGameData.roundData[roundid].totalBid = totalbids;
 gameDataParsed.gameDataObjects[gameID]= thisGameData;
 var writeData = JSON.stringify(gameDataParsed, null,2);
 fs.writeFile('gameData.json', writeData, done)
 function done(){
  res.json({
             players:  thisGameData.players,
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


//update scores after a round
app.put('/api/score/:gameID/:roundNum/:newscores', (req, res) => {
  var gameID = req.params.gameID;
  var newscores = JSON.parse(req.params.newscores);
  var round = JSON.parse(req.params.roundNum);
  var gameData = fs.readFileSync('gameData.json');
  var gameDataParsed = JSON.parse(gameData);
  var thisGameData = gameDataParsed.gameDataObjects[gameID];
  thisGameData.players.forEach(function(item, index, array) {
    item.score = newscores[index];
  });
  if((thisGameData.roundData[(round-1)].numOfCards ===1)&& (thisGameData.cardCountDirection ==="Down" )){
    thisGameData.cardCountDirection = "Up";
    thisGameData.roundData[round]={
      roundNum: round + 1,
      numOfCards: 1 ,
      totalBid: 0
    }
  }
  else if (thisGameData.cardCountDirection ==="Up") {
    thisGameData.roundData[round]={
      roundNum: round + 1,
      numOfCards: (thisGameData.roundData[(round-1)].numOfCards) + 1,
      totalBid: 0
    }
  }
  else{
    thisGameData.roundData[round]={
      roundNum: round + 1,
      numOfCards: (thisGameData.roundData[(round-1)].numOfCards) -1,
      totalBid: 0
    }
  }
  gameDataParsed.gameDataObjects[gameID]=thisGameData;
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
