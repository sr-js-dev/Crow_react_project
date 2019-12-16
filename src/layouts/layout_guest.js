import React, {Component} from 'react'
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import Changepassword from '../pages/Signup/changepassword'
import Activity from '../pages/Activity/activity_manage'
import User from '../pages/Users/user_manage'
import Role from '../pages/Role/role_manage'
import Purchase from '../pages/Purchase/purchase_manage'
import Exploitation from '../pages/Exploitation/exploitation_manage'
import Coverage from '../pages/Coverage/coverage_manage'
import Zenomanage from '../pages/Zeno/zeno_manage'
import Consistency from '../pages/Consistency/consistency_check'
import Auditmanage from '../pages/Audit/audit_manage'
import Member from '../pages/Member/member_manage'
import Setting from '../pages/Setting/setting_manage'
import Taggroup from '../pages/Taggroup/taggroup_manage'
import Tag from '../pages/Tag/tag_manage'
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
                      <Route path="/users" component={User}/>
                      <Route path="/role" component={Role}/>
                      <Route path="/purchase" component={Purchase}/>
                      <Route path="/exploitation" component={Exploitation}/>
                      <Route path="/coverage" component={Coverage}/>
                      <Route path="/member" component={Member}/>
                      <Route path="/changepasword" component={Changepassword}/>
                      <Route path="/activities" component={Activity}/>
                      <Route path="/zeno" component={Zenomanage}/>
                      <Route path="/audit" component={Auditmanage}/>
                      <Route path="/consistency" component={Consistency}/>
                      <Route path="/settings" component={Setting}/>
                      <Route path="/tag-group" component={Taggroup}/>
                      <Route path="/tag" component={Tag}/>
                  </Switch>
                </Router>
                <Footer/>
            </Col>
          </Row>
      )
    };
  }
  export default Layout;
  