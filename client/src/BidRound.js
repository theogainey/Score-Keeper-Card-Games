import './App.css';
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import PersonIcon from '@material-ui/icons/Person';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import FaultyGamePlayAlert from './FaultyGamePlayAlert';
import {useParams} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  bidSection: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


function PlayerBidSection(props){
  var classes = useStyles();
  return(
    <Paper  variant="outlined">
    <Container component="section" maxWidth="xs" className={classes.bidSection}>
    <Avatar className={classes.avatar}>
      <PersonIcon />
    </Avatar>
      <Typography component="h2" variant="h3">
          {props.name}
      </Typography>
      <Typography component="h3" variant="h3">
        score {props.score}
      </Typography>
      <TextField id="cardNumTextField"
        value={props.playerBid}
        label="Bid" variant="outlined"
        onChange={props.handleChange}
        fullWidth/>
    </Container>
    </Paper>
  );
}

function SubmitBidsButton(props){
  var classes = useStyles();
  return(
    <Container component="section" maxWidth="xs" className={classes.buttonContainer}>
    <Button
      variant="contained"
      color="primary"
      onClick={props.goToScoreRound}
      className={classes.submit}
      startIcon={<ArrowForwardIcon/>}>
      Submit Bids
    </Button>
    </Container>
  );
}
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
      <Grid item xs={12} lg={4}>
        <PlayerBidSection
          name={this.props.name}
          playerBid={  this.state.playerBid}
          score={this.props.score}
          handleChange={this.handleChange}
        />
      </Grid>
    );
  }
};
export default function BidRoundFunction(){
  var {id} = useParams();
  return(
    <BidRound gameID={id}/>
  )
}


 class BidRound extends React.Component  {

  constructor(){
    super();
    this.handleBidChange = this.handleBidChange.bind(this);
    this.handleAlert = this.handleAlert.bind(this);
    this.goToScoreRound = this.goToScoreRound.bind(this);
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
    var gameID= this.props.gameID;
    fetch('/api/bid/'+gameID+'/'+id+'/'+roundid+'/'+bid,{method: 'put'}).then(response => response.json()).then(data => {
    this.setState({ players: data.players, totalBid: data.totalBid});
   }).catch(err => {console.log(err);});
  }
  componentDidMount() {
    var id = this.props.gameID;
    this.loadData(id);
  }
  loadData(id) {
    fetch('/api/bidround/'+id).then(response => response.json()).then(data => {
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
      let gameID=this.props.gameID;
      window.open("/scoreround/"+gameID,"_self");
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
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
          spacing={0}>
          <Grid item xs={12} md={4}>
            <Typography className="bannerText" component="h1" variant="h2">Round {this.state.roundNum} </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography className="bannerText" component="h1" variant="h2"> Cards {this.state.cardsThisHand}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography className="bannerText" component="h1" variant="h2">Total Bid {this.state.totalBid}</Typography>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          spacing={3}>
          {PlayerList}
        </Grid>
        <SubmitBidsButton goToScoreRound={this.goToScoreRound}/>
        <FaultyGamePlayAlert
          isShown={this.state.showAlert}
          handleAlert={this.handleAlert}
          alertType="BiddingError"
          />
      </Container>
  );
 }
}
