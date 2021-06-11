import './App.css';
import { makeStyles } from '@material-ui/core/styles';

import React from 'react';
//import AppHeader from './AppHeader';
import HomePage from './HomePage';
import GameSetup from './GameSetup';
import BidRound from './BidRound';
import ScoreBoard from './ScoreBoard';
import ScoreRound from './ScoreRound';
import FinalScores from './FinalScores';
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
          <Route exact path="/oh-hell">
            <GameSetup />
          </Route>
          <Route exact path="/bidround">
            <BidRound/>
          </Route>
          <Route exact path="/scoreround">
            <ScoreRound />
          </Route>
          <Route exact path="/scoreboard">
            <ScoreBoard />
          </Route>
          <Route exact path="/finalscores">
            <FinalScores />
          </Route>
        </Switch>
        <AppFooter/>
        </div>
      </Router>
  );
}
