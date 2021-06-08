import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FaultyGamePlayAlert from './FaultyGamePlayAlert';




class Player extends React.Component{
  constructor(){
    super();
    this.state ={madebid:false};
  }
  handleChange(e){
    if(this.state.madebid){
      this.setState({madebid:false})
      this.props.handleMadeBidStatus(this.props.id, false);
    }
    else{
      this.setState({madebid:true})
      this.props.handleMadeBidStatus(this.props.id, true);
    }
  }

  render(){
    return(
      <Col xs={4} >
        <Row>
          <Col xs={4}/>
          <p>{this.props.name}</p>
        </Row>
        <Row>
          <Col xs={4}/>
          <p>score {this.props.score} bid { this.props.bid}</p>
        </Row>
        <Row>
         <Col xs={4}/>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check onClick={this.handleChange.bind(this)} type="checkbox" label="Made Bid?" />
          </Form.Group>
        </Row>
      </Col>

    );
  }
};


export default class ScoreRound extends React.Component  {

  constructor(){
    super();
    this.handleMadeBidStatus = this.handleMadeBidStatus.bind(this);
    this.handleAlert = this.handleAlert.bind(this);
    this.state = {
      roundNum:'',
      cardsThisHand:0,
      totalBid:0,
      largestHand:0,
      showAlert: false,
      cardCountDirection:'',
      players:[],
      bids:[],
      scores:[],
      playersMadeBidStatus: []
    };
  }

  handleMadeBidStatus(playerId, flag){
    var playersBidStatus =  this.state.playersMadeBidStatus.slice();
    playersBidStatus[playerId] = flag;
    this.setState({playersMadeBidStatus: playersBidStatus});
    playersBidStatus = null;
  }
   calculateScores(){
     //total number of made bids
    var playersBidStatus = this.state.playersMadeBidStatus.slice();
    var totalMadeBids=0
    playersBidStatus.forEach((item, i) => {
      if(item){
        totalMadeBids++;
      }
    });
    //compare made bids to total of players. only score round if not every player made bid
    if(totalMadeBids!==this.state.players.length){
      var scoreArray =this.state.scores.slice();
      var playerBids = this.state.bids.slice();
      var encodedString="%5B";
      scoreArray.forEach(function(item, index, array) {
        if(playersBidStatus[index]){
          if (index===(scoreArray.length -1) ) {
            scoreArray[index]= scoreArray[index] + 10 + playerBids[index];
            encodedString=encodedString+encodeURI(scoreArray[index])+"%20";
          }
          else{
            scoreArray[index]= scoreArray[index] + 10 + playerBids[index]; //plus bid
            encodedString=encodedString+encodeURI(scoreArray[index])+"%2C%20";
          }
        }
        else{
          if (index===(scoreArray.length -1) ) {
            scoreArray[index]= scoreArray[index] - playerBids[index];
            encodedString=encodedString+encodeURI(scoreArray[index])+"%20";
          }
          else{
            scoreArray[index]= scoreArray[index] - playerBids[index];
            encodedString=encodedString+encodeURI(scoreArray[index])+"%2C%20";
          }
        }

      });
      encodedString=encodedString+"%5D";
      fetch('/api/score/'+this.state.roundNum+'/'+encodedString,{method: 'post'}).then(response => response.json()).then(data => {
        }).catch(err => {console.log(err);});
      encodedString=null;
      //decide to bid another round or go to final Scores
      if((this.state.cardCountDirection==="Up")&&(this.state.cardsThisHand===this.state.largestHand)){
        window.open("/finalscores","_self");
      }
      else{
        window.open("/bidround","_self");
      }
    }
    else {
      this.setState({showAlert: true});
    }
  }
  handleAlert(){
    this.setState({showAlert: false});
  }
  setScoreAndBidData(){
    var scoreArray =new Array(  this.state.players.length);
    var playersBidStatus =new Array(  this.state.players.length);
    var playerBids =new Array(  this.state.players.length);

    this.state.players.forEach(function(item, index, array) {
      scoreArray[index]= item.score;
      playerBids[index]= item.currentBid;
      playersBidStatus[index]=false;
    });
    this.setState({scores: scoreArray});
    this.setState({playersMadeBidStatus: playersBidStatus});
    this.setState({bids: playerBids});
    playerBids=null;
    scoreArray =null;
    playersBidStatus = null;
  }


  componentDidMount() {
    this.loadData();

  }

  loadData() {
    fetch('/api/scoreround').then(response => response.json()).then(data => {
    this.setState({
       roundNum:data.roundData[(data.roundData.length -1)].roundNum ,
       players: data.players,
       cardsThisHand: data.roundData[(data.roundData.length -1)].numOfCards,
       totalBid: data.roundData[(data.roundData.length -1)].totalBid,
       cardCountDirection: data.cardCountDirection,
       largestHand: data.largestHand
     });
     this.setScoreAndBidData();

   }).catch(err => {console.log(err);});
  }

  render(){

    var PlayerList = this.state.players.map(player =><Player key={player.id}
      id={player.id}
      name={player.name}
      bid={player.currentBid}
      score={player.score}
      handleMadeBidStatus = {this.handleMadeBidStatus}
      />);
    return (
      <main className ="App">
        <h1>Score Keeper</h1>
        <h2>Round {this.state.roundNum} Cards {this.state.cardsThisHand} Toatal Bid {this.state.totalBid}</h2>
        <Row>{PlayerList}</Row>
        <Row className="justify-content-center"><Button onClick={this.calculateScores.bind(this)}>Score Round</Button></Row>
        <FaultyGamePlayAlert isShown={this.state.showAlert}
        handleAlert={this.handleAlert}
        alertType="ScoringError"/>
      </main>
  );
 }
}
