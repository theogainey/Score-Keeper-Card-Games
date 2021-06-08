import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';


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



export default class FinalScores extends React.Component  {
  constructor(){
    super();
    this.state = {
      players:[]
    };
  }
  componentDidMount() {
    this.loadData();
  }

  loadData() {
    fetch('/api/finalscores').then(response => response.json()).then(data => {
    this.setState({
       players: data.players,
     });
   }).catch(err => {console.log(err);});
  }
  startNewGame(){
    fetch('/api/resetgamedata',{method: 'post'}).then( window.open("/","_self"));

  }

  render(){
    var PlayerList = this.state.players.map(player =><Player key={player.id} name={player.name} score={player.score}/>);
    return (
      <main className ="App">
        <h1>Final Scores</h1>
        <Row>{PlayerList}</Row>
        <Button onClick={this.startNewGame.bind(this)}>Start New Game</Button>
      </main>
  );
 }
}
