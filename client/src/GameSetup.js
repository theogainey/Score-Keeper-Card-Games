import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';


//need to make it so game wont start without proper conditions
export default class GameSetup extends React.Component  {
 constructor(){
   super();
   this.handleChange = this.handleChange.bind(this);
   this.handleChange2 = this.handleChange2.bind(this);
   this.state = {
     largestHand:0,
     newPlayerField:'',
     numPlayers:0,
     players:[]
   };
 }
 handleChange(e) {
  this.setState({newPlayerField: e.target.value});
 }
 handleChange2(e) {
   var a = parseInt(e.target.value);
   if(!(Math.sign(a)===1)){
     a=0;
   }
   this.setState({largestHand: a});
 }
 componentDidMount() {
   this.loadData();
 }

 loadData() {
   fetch('/api/data').then(response => response.json()).then(data => {
   this.setState({ players: data.players });
  }).catch(err => {console.log(err);});
 }
 addPlayer(name){
    fetch('/api/newplayer/'+ name,{method: 'post'}).then(response => response.json()).then(data => {
    this.setState({ players: data.players, numPlayers: this.state.numPlayers+1 });
   }).catch(err => {console.log(err);});
  }

 resetPlayers(){
   fetch('/api/resetgamedata',{method: 'post'}).then(response => response.json()).then(data => {
   this.setState({ players: data.players });
  }).catch(err => {console.log(err);});
 }
 startGame(props){
   if(!(props===0)&&(this.state.players.length>=2)){
     fetch('/api/startgame/' + props,{method: 'post'}).then(response => response.json()).then(data => {
       window.open("/bidround","_self");
      }).catch(err => {console.log(err);});
   }
 }
  render(){
    function Player(props){
      return(
        <p>{props.name}</p>
      );
    };
    var PlayerList = this.state.players.map(player =><Player key={player.id} name={player.name} score={player.score}/>);
    return (
      <Container  as="main" className="App">
        <h1>   Game Setup     </h1>
        <Container as="section" className="Gameplay-Settings">
          <h2>Gameplay Settings</h2>
          <InputGroup >
            <InputGroup.Prepend>
              Number Of Cards In Largest Hand
            </InputGroup.Prepend>
            <FormControl  value={this.state.largestHand} onChange={this.handleChange2} aria-describedby="basic-addon1" />
          </InputGroup>
        </Container>
        <Container as="section" className="Gameplay-AddPlayers">
          <h2>Add Players</h2>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <Button varient="primary" onClick={this.addPlayer.bind(this,this.state.newPlayerField)}>Add New Player</Button>
            </InputGroup.Prepend>
            <FormControl placeholder="New Player Name" value={this.state.newPlayerField} onChange={this.handleChange} aria-describedby="basic-addon1" />
          </InputGroup>
          <Button varient="primary" onClick={this.resetPlayers.bind(this)}>Reset Player List</Button>
          <h2>Players</h2>
          {PlayerList}
        </Container>
        <Button varient="primary"  onClick={this.startGame.bind(this, this.state.largestHand)}>Start Game</Button>
      </Container>
  );
 }
}
