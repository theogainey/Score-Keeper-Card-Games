import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import GameSetup from './GameSetup';
import BidRound from './BidRound';
import ScoreRound from './ScoreRound';
import ScoreBoard from './ScoreBoard';
import FinalScores from './FinalScores';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";




export default class App extends React.Component  {


  render(){

    return (
      <Router>
      <AppHeader/>
      <Switch>
        <Route exact path="/">
              <GameSetup />
        </Route>
        <Route  exact path="/bidround">
              <BidRound/>
        </Route>
        <Route  exact path="/scoreround">
              <ScoreRound/>
        </Route>
        <Route  exact path="/scoreboard">
              <ScoreBoard/>
        </Route>
        <Route  exact path="/finalscores">
              <FinalScores/>
        </Route>

      </Switch>
      <AppFooter/>
      </Router>
  );
 }
}
