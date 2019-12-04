import React, {Component} from 'react'
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
// import Sidebar from '../components/sidebar'
import Login from '../pages/Signup/login.js'
import Header from '../components/header'
import { Switch,Router, Route } from 'react-router-dom';
import history from '../history';

window.localStorage.setItem('AWT', true);
class Layout extends Component {
  
    render () {
      return (
          <Row style={{height:"100%"}}>
            <Col style={{paddingLeft:0, paddingRight:0}}>
                <Header/>
                <Router history={history}>
                  <Switch>
                      <Route path="/login" component={Login} />
                  </Switch>
                </Router>
            </Col>
          </Row>
      )
    };
  }
  export default Layout;
