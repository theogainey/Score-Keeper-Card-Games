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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Switch from '@material-ui/core/Switch';
import FaultyGamePlayAlert from './FaultyGamePlayAlert';


const useStyles = makeStyles((theme) => ({
  scoreSection: {
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

function PlayerScore(props){
  var classes = useStyles();
  return(
    <Paper  variant="outlined">
      <Container component="section" maxWidth="xs" className={classes.scoreSection}>
        <Avatar className={classes.avatar}>
          <PersonIcon />
        </Avatar>
        <Typography component="h2" variant="h3">
          {props.name}
        </Typography>
        <Typography component="h3" variant="h3">
          score {props.score} bid {props.bid}
        </Typography>
        <FormControlLabel
          value="Made Bid?"
          control={<Switch
            checked={props.checkedB}
            onChange={props.handleChange}
            name="checkedB"
            color="primary"
          />}
          label="Made Bid"
          labelPlacement="start"
        />
      </Container>
    </Paper>
  );
}

function ScoreRoundButton(props){
  var classes = useStyles();
  return(
    <Container component="section" maxWidth="xs" className={classes.buttonContainer}>
    <Button
      variant="contained"
      color="primary"
      onClick={props.calculateScores}
      className={classes.submit}
      startIcon={<ArrowForwardIcon/>}>
      Score Round
    </Button>
    </Container>
  );
}


class Player extends React.Component{
  constructor(){
    super();
    this.handleChange=this.handleChange.bind(this);
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
      <Grid item xs={12} lg={4}>
        <PlayerScore
          name={this.props.name}
          score={this.props.score}
          bid={this.props.bid}
          checkedB={this.state.madebid}
          handleChange={this.handleChange}
        />
      </Grid>
    );
  }
};


export default class ScoreRound extends React.Component  {

  constructor(){
    super();
    this.handleMadeBidStatus = this.handleMadeBidStatus.bind(this);
    this.handleAlert = this.handleAlert.bind(this);
    this.calculateScores= this.calculateScores.bind(this);
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
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
          spacing={0}>
          <Grid item xs={12} lg={4}>
            <Typography className="bannerText" component="h1" variant="h2">Round {this.state.roundNum} </Typography>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Typography className="bannerText" component="h1" variant="h2"> Cards {this.state.cardsThisHand}</Typography>
          </Grid>
          <Grid item xs={12} lg={4}>
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
        <ScoreRoundButton calculateScores={this.calculateScores}/>
        <FaultyGamePlayAlert
          isShown={this.state.showAlert}
          handleAlert={this.handleAlert}
          alertType="ScoringError"
          />
      </Container>
  );
 }
}
