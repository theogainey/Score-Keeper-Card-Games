import './App.css';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import SettingsIcon from '@material-ui/icons/Settings';
import Avatar from '@material-ui/core/Avatar';
import GroupIcon from '@material-ui/icons/Group';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import TextField from '@material-ui/core/TextField';
import FaultyGamePlayAlert from './FaultyGamePlayAlert';
import {useParams} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  setupSection: {
    minHeight: '60vh',
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginButtom: theme.spacing(2),
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

function AddPlayers(props){
  var classes = useStyles();

  return(
    <Paper  variant="outlined">
      <Container component="section" maxWidth="xs" className={classes.setupSection}>
        <Avatar className={classes.avatar}>
          <GroupAddIcon />
        </Avatar>
        <Typography component="h2" variant="h3">
          Add Players
        </Typography>
        <p/>

        <TextField id="newPlayerTextField"
          value={props.textFieldValue}
          label="New Player Name" variant="outlined"
          onChange={props.handleChange}
          placeholder="New Player Name" fullWidth/>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={props.addPlayer}
          className={classes.submit}
          startIcon={<PersonAddIcon />}>
          Add New Player
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={props.resetPlayers}
          className={classes.submit}
          startIcon={<SettingsBackupRestoreIcon />}>
          Reset Player List
        </Button>
      </Container>
    </Paper>

  );
}


function PlayerList(props) {
  function Player(props){
    return(
      <div>
      <Typography component="h3" variant="h4">
        {props.name}
      </Typography>
      <p/>
      </div>
    );
  };
  var classes = useStyles();
  var Players = props.players.map(player =><Player key={player.id} name={player.name} score={player.score}/>);
  return(
    <Paper  variant="outlined">
    <Container component="section" maxWidth="xs" className={classes.setupSection}>
      <Avatar className={classes.avatar}>
        <GroupIcon />
      </Avatar>
        <Typography component="h2" variant="h3">
          Players
        </Typography>
          <p/>
          {Players}
    </Container>
    </Paper>
  );
}

function GamePlaySetting(props){
  var classes = useStyles();

  return(
    <Paper variant="outlined">
    <Container component="section" maxWidth="xs" className={classes.setupSection}>
      <Avatar className={classes.avatar}>
        <SettingsIcon />
      </Avatar>
      <Typography component="h2" variant="h3">
         Settings
      </Typography>
      <p/>
        <TextField id="cardNumTextField"
          value={props.largestHand}
          label="Number of Cards In Largest Hand" variant="outlined"
          onChange={props.handleChange}
          fullWidth/>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={props.startGame}
          className={classes.submit}
          startIcon={<PlayCircleFilledWhiteIcon />}>
        Start Game</Button>
    </Container>
    </Paper>
  );
}
export default function GameSetupFunction(){
  var {id} = useParams();
  return(
    <GameSetup gameID={id}/>
  )
}
 class GameSetup extends React.Component  {
 constructor(){
   super();
   this.handleChange = this.handleChange.bind(this);
   this.handleChange2 = this.handleChange2.bind(this);
   this.startGame = this.startGame.bind(this);
   this.addPlayer = this.addPlayer.bind(this);
   this.resetPlayers= this.resetPlayers.bind(this);
   this.handleAlert=this.handleAlert.bind(this);
   this.state = {
     largestHand:0,
     showAlert: false,
     alertType:"GameSetupError",
     newPlayerField:'',
     numPlayers:0,
     players:[]
   };
 }
 handleAlert(){
   this.setState({showAlert: false});
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
   var id = this.props.gameID;
   this.loadData(id);
 }

 loadData(id) {
   fetch('/api/data/'+id).then(response => response.json()).then(data => {
   this.setState({ players: data.players });
  }).catch(err => {console.log(err);});
 }
 addPlayer(){
   var id =this.props.gameID;
    if(this.state.newPlayerField!==""){
    var name = this.state.newPlayerField;
    fetch('/api/newplayer/'+id+'/'+ name,{method: 'post'}).then(response => response.json()).then(data => {
    this.setState({ players: data.players,
      numPlayers: this.state.numPlayers+1,
      newPlayerField:"" });
   }).catch(err => {console.log(err);});
    }
  }

 resetPlayers(){
   var id =this.props.gameID;

   fetch('/api/resetgamedata/' +id,{method: 'put'}).then(response => response.json()).then(data => {
   this.setState({ players: data.players });
  }).catch(err => {console.log(err);});
 }
 startGame(props){
   var id =this.props.gameID;

   if(!(this.state.largestHand===0)&&(this.state.players.length>=2)){
     fetch('/api/startgame/'+id +'/'+ this.state.largestHand,{method: 'put'}).then(() => {
       window.open("/bidround/"+id,"_self");
      }).catch(err => {console.log(err);});
   }
   else if (!(this.state.players.length>=2)) {
     this.setState({showAlert: true });
   }
   else if (this.state.largestHand===0) {
     this.setState({alertType: "ZeroCards", showAlert: true });
   }
 }
  render(){

    return (
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Typography className="bannerText" component="h1" variant="h2">Game Setup</Typography>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
          spacing={3}>
          <Grid item xs={12} md={4}>
            <AddPlayers addPlayer={this.addPlayer} resetPlayers={this.resetPlayers} handleChange={this.handleChange} textFieldValue={this.state.newPlayerField}/>
          </Grid>
          <Grid item xs={12} md={4}>
            <PlayerList players={this.state.players}/>
          </Grid>
          <Grid item xs={12} md={4}>
            <GamePlaySetting largestHand={this.state.largestHand} handleChange={this.handleChange2} startGame={this.startGame}/>
          </Grid>
        </Grid>
        <FaultyGamePlayAlert
          isShown={this.state.showAlert}
          handleAlert={this.handleAlert}
          alertType={this.state.alertType}
          />
        <Box mt={8}/>
      </Container>
  );
 }
}
