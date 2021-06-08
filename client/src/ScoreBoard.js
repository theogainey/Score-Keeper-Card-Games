import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


function Player(props){
  return(
    <Col xs={4} >
      <Row>
        <Col xs={4}/>
        <p>{props.name} score {props.score}</p>
      </Row>
    </Col>
  );
};



export default class ScoreBoard extends React.Component  {
  constructor(){
    super();
    this.state = {
      roundNum:'',
      cardsThisHand:0,
      players:[]
    };
  }
  componentDidMount() {
    this.loadData();
  }

  loadData() {
    fetch('/api/scoreboard').then(response => response.json()).then(data => {
    this.setState({
      roundNum: data.roundData[(data.roundData.length -1)].roundNum ,
       players: data.players,
       cardsThisHand: data.roundData[(data.roundData.length -1)].numOfCards,
     });
   }).catch(err => {console.log(err);});
  }


  render(){
    var PlayerList = this.state.players.map(player =><Player key={player.id} name={player.name} score={player.score}/>);
    return (
      <main className ="App">
        <h1>Score Board</h1>
        <h2>Round {this.state.roundNum} Cards {this.state.cardsThisHand}</h2>

        <Row>{PlayerList}</Row>
      </main>
  );
 }
}
