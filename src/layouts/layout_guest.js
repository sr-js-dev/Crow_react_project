import React, {Component} from 'react'
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
// import Sidebar from '../components/sidebar'
import Login from '../pages/Signup/login'
import User from '../pages/Users/user_manage'
import Role from '../pages/Role/role_manage'
import Purchase from '../pages/Purchase/purchase_manage'
import Exploitation from '../pages/Exploitation/exploitation_manage'
import Coverage from '../pages/Coverage/coverage_manage'
import Member from '../pages/Member/member_manage'
import Header from '../components/header'
import Footer from '../components/footer'
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
                      <Route path="/login" component={Login}/>
                      <Route path="/users" component={User}/>
                      <Route path="/role" component={Role}/>
                      <Route path="/purchase" component={Purchase}/>
                      <Route path="/exploitation" component={Exploitation}/>
                      <Route path="/coverage" component={Coverage}/>
                      <Route path="/member" component={Member}/>
                  </Switch>
                </Router>
                <Footer/>
            </Col>
          </Row>
      )
    };
  }
  export default Layout;
