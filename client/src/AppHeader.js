import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

export default class AppHeader extends React.Component  {
  render(){
    //Navs
    //Rules in Nav
    return(
      <Container fluid as="header" className= "App-Header">
        <Row className="justify-content-center">
          <Col>
            <h1>Oh Hell</h1>
          </Col>
        </Row>
      </Container>
    )
  }
}
