import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


//Look at Compoent did update
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
        this.setState({alertMessage: "Scorring Error Message"});
        break;
      case "BiddingError":
        this.setState({alertMessage: "Bidding Error Message"});
        break;
      default:
      this.setState({alertMessage: "default message"});
    }
  }
  render() {

  const handleClose = () => this.props.handleAlert();
  return (
    <>
      <Modal show={this.state.show} onHide={handleClose} size="sm" centered animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body className="align-self-center">
          <p>{this.state.alertMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button  variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
}
