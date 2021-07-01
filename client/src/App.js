import './App.css';
import { makeStyles } from '@material-ui/core/styles';

import React from 'react';
//import AppHeader from './AppHeader';
import HomePage from './HomePage';
import GameSetupFunction from './GameSetup';
import BidRoundFunction from './BidRound';
import ScoreBoardFunction from './ScoreBoard';
import ScoreRoundFunction from './ScoreRound';
import FinalScoresFunction from './FinalScores';
import AppFooter from './AppFooter';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },

}));



export default function App() {
  const classes = useStyles();


    return (
      <Router>
      <div className={classes.root}>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route  path="/oh-hell/:id">
            <GameSetupFunction />
          </Route>
          <Route  path="/bidround/:id">
            <BidRoundFunction/>
          </Route>
          <Route  path="/scoreround/:id">
            <ScoreRoundFunction />
          </Route>
          <Route exact path="/scoreboard/:id">
            <ScoreBoardFunction />
          </Route>
          <Route exact path="/finalscores/:id">
            <FinalScoresFunction />
          </Route>
        </Switch>
        <AppFooter/>
        </div>
      </Router>
  );
}
