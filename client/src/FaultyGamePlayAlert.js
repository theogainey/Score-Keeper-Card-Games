import React from "react";
import './App.css';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CancelIcon from '@material-ui/icons/Cancel';
import CssBaseline from '@material-ui/core/CssBaseline';


const useStyles = makeStyles((theme) => ({
  alertStyles: {
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
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function AlertModal(props){
  var classes = useStyles();
  const handleClose = () => props.handleAlert();
  return(
    <Modal open={props.show} onClose={handleClose}>
      <Container component="main" maxWidth="sm">
      <Paper  variant="outlined" className={classes.alertStyles}>
        <Container className="bannerText" component="header" maxWidth="lg">
          <Typography  component="h1" variant="h2">
            Warning!
          </Typography>
        </Container>
        <Container component="section" maxWidth="xs">
          <Typography  variant="body1" >
            {props.alertMessage}
          </Typography>
        </Container>
        <Container className={classes.buttonContainer} component="footer" maxWidth="lg">
          <Button
            className={classes.submit}
            variant="contained"
            color="primary"
            startIcon={<CancelIcon/>}
            onClick={handleClose}>
              Close
          </Button>
        </Container>
      </Paper>
     </Container>
    </Modal>

  );
}

//needs isShown handleAlert and alertType Props

export default class FaultyGamePlayAlert extends React.Component {
  constructor(){
    super();
    this.state = {
      show:false,
      alertMessage:'Message'
    };
  }

  componentDidUpdate(prevProps) {
  if (this.props.isShown !== prevProps.isShown) {
    this.setState({show:this.props.isShown});
    }
  }
  componentDidMount(){
    this.setAlertMessage(this.props);
  }
  setAlertMessage(props){
    switch (props.alertType) {
      case "ScoringError":
        this.setState({alertMessage: "When a round is bid properly it is not possible for every player to make their bid. Please double check to make sure no errors were made when deciding what players made their bid."});
        break;
      case "BiddingError":
        this.setState({alertMessage: "In each round the total number of tricks bid CANNOT be equal to the number of tricks possible for that round. It is the dealer’s responsibility to place a bid that ensures that rule is followed. If the current bids are entered correctly, the dealer must change his bid so that this rule is followed. See rules for more details."});
        break;
      case "GameSetupError":
        this.setState({alertMessage:"Inorder to start a game at least two player names must be entered and a number other than 0 must be entered for number of cards in largest hand ."});
        break;

      default:
      this.setState({alertMessage: "default message"});
    }
  }
  render() {
  return (
    <>
      <CssBaseline />
      <AlertModal
        handleAlert={this.props.handleAlert}
        show = {this.state.show}
        alertMessage = {this.state.alertMessage}
        />
    </>
  );
}
}
