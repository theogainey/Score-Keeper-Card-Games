import './App.css';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import PersonIcon from '@material-ui/icons/Person';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import {useParams} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
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

function StartNewGameButton(props){
  var classes = useStyles();
  return(
    <Container component="section" maxWidth="xs" className={classes.buttonContainer}>
    <Button
      variant="contained"
      color="primary"
      onClick={props.startNewGame}
      className={classes.submit}
      startIcon={<PlayCircleFilledWhiteIcon />}>
      Start New Game
    </Button>
    </Container>
  );
}

function Player(props){
  var classes=useStyles();
  return(
    <Grid item xs={12} lg={4}>
      <Container component="section" maxWidth="xs" >
        <Paper className={classes.paper} variant="outlined">
          <Avatar className={classes.avatar}>
            <PersonIcon />
          </Avatar>
          <Typography component="h2" variant="h3">
            {props.name}
          </Typography>
          <Typography component="h3" variant="h3">
            score {props.score}
          </Typography>
        </Paper>
      </Container>
    </Grid>
   );
};

export default function FinalScoresFunction(){
  let {id} = useParams();
  return(
    <FinalScores gameID={id}/>
  )
}


class FinalScores extends React.Component  {
  constructor(){
    super();
    this.startNewGame= this.startNewGame.bind(this);
    this.state = {
      players:[]
    };
  }
  componentDidMount() {
    var id = this.props.gameID;
    this.loadData(id);
  }

  loadData(id) {
    fetch('/api/finalscores/'+id).then(response => response.json()).then(data => {
    this.setState({
       players: data.players,
     });
   }).catch(err => {console.log(err);});
  }
  startNewGame(){
    var id = this.props.gameID;
    fetch('/api/cleargame/'+id,{method: 'delete'}).then( window.open("/","_self"));
  }
  render(){
    var PlayerList = this.state.players.map(player =><Player key={player.id} name={player.name} score={player.score}/>);
    return (
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Typography className="bannerText" component="h1" variant="h2">
          Final Scores
        </Typography>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          spacing={3}>
          {PlayerList}
        </Grid>
        <StartNewGameButton startNewGame={this.startNewGame}/>
      </Container>  );
 }
}
