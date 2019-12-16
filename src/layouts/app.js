import React, {Component} from 'react'
import { Route, Switch,Router } from 'react-router-dom';
import GuestLayout from './layout_guest'
import Login from '../pages/Signup/login.js'
import Resetpasswordsendmail from '../pages/Signup/resetpassword_sendmail'
import Resetpassword from '../pages/Signup/resetpassword'
import history from '../history';
import PrivateRoute from '../components/privateroute';
class App extends Component {
  render () {
    return (
      <Router history={history}>
         <Switch >
          <Route path="/login" component={Login} />
          <Route path="/reset-password-email" component={Resetpasswordsendmail}/>
          <Route path="/reset-password" component={Resetpassword}/>
          <PrivateRoute path="/" component={GuestLayout} />
        </Switch>
      </Router>
     
    )
  };
}

export default App