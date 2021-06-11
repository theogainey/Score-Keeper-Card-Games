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


const useStyles = makeStyles((theme) => ({
  paper: {
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

function Player(props){
  var classes = useStyles();
  return(
    <Grid item xs={12} lg={4}>
      <Container component="section" maxWidth="xs" >
        <Paper className={classes.paper} variant="outlined">
          <Avatar className={classes.avatar}>
            <PersonIcon />
          </Avatar>
          <Typography component="h3" variant="h4">
            {props.name}
          </Typography>
          <Typography component="h4" variant="h4">
            score {props.score}
          </Typography>
        </Paper>
      </Container>
    </Grid>
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
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Typography className="bannerText" component="h1" variant="h2">
          Score Board
        </Typography>
        <Typography className="bannerText" component="h2" variant="h3">
          Round {this.state.roundNum} Cards {this.state.cardsThisHand}
        </Typography>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          spacing={3}>
          {PlayerList}
        </Grid>
      </Container>
  );
 }
}
