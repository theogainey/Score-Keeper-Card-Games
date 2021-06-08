import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import FaultyGamePlayAlert from './FaultyGamePlayAlert';

class Player extends React.Component{
  constructor(){
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state={
      playerBid: 0,
    };
  }
  handleChange(e) {
    var b = parseInt(e.target.value);
    if((!(Number.isInteger(b))) || (Math.sign(b)===-1)){
      b=0;
    }
    this.props.handleBidChange(this.props.id,this.props.roundid, b);
    this.setState({playerBid: b})
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
          <p>score {this.props.score} bid { this.state.playerBid}</p>
        </Row>
        <Row>
          <Col xs={2}/>
          <Col xs={8}>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text >Bid</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl placeholder=" " value={this.state.playerBid} onChange={this.handleChange} aria-describedby="basic-addon1" />
          </InputGroup>
          </Col>
          <Col xs={2}/>

        </Row>
      </Col>

    );
  }
};


export default class BidRound extends React.Component  {

  constructor(){
    super();
    this.handleBidChange = this.handleBidChange.bind(this);
    this.handleAlert = this.handleAlert.bind(this);
    this.state = {
      showAlert: false,
      roundNum:'',
      cardsThisHand:0,
      totalBid:0,
      players:[]
    };
  }
  handleAlert(){
    this.setState({showAlert: false});
  }
  handleBidChange(id, roundid, bid){
    fetch('/api/bid/'+id+'/'+roundid+'/'+bid,{method: 'post'}).then(response => response.json()).then(data => {
    this.setState({ players: data.players, totalBid: data.totalBid});
   }).catch(err => {console.log(err);});
  }
  componentDidMount() {
    this.loadData();
  }

  loadData() {
    fetch('/api/bidround').then(response => response.json()).then(data => {
    this.setState({
       roundNum:data.roundData[(data.roundData.length -1)].roundNum ,
       players: data.players,
       totalBid: 0,
       cardsThisHand: data.roundData[(data.roundData.length -1)].numOfCards,
     });
   }).catch(err => {console.log(err);});


  }


  goToScoreRound(){
    if(this.state.totalBid!==this.state.cardsThisHand){
      window.open("/scoreround","_self");
    }
    else {
      this.setState({showAlert: true});
    }
  }
  render(){
    var roundid = this.state.roundNum-1;
    var PlayerList = this.state.players.map(player =><Player key={player.id}
      id={player.id}
      name={player.name}
      bid={player.currentBid}
      roundid={roundid}
      score={player.score}
      handleBidChange={this.handleBidChange}
      />);

    return (
      <>
      <Container  as="main" className ="App">
        <Container as="section">
          <h1>Bid Round</h1>
          <h2>Round {this.state.roundNum} Cards {this.state.cardsThisHand} Toatal Bid {this.state.totalBid}</h2>
        </Container>
        <Container as="section">
          <Row>{PlayerList}</Row>
        </Container>
        <Button className="align-self-center" varient="primary" onClick={this.goToScoreRound.bind(this)}>Submit Bids</Button>
      </Container>
      <FaultyGamePlayAlert isShown={this.state.showAlert}
      handleAlert={this.handleAlert}
      alertType="BiddingError"/>
      </>
  );
 }
}
