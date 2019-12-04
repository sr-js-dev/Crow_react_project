// import { Link } from 'react-router-dom';
import React from 'react';
import * as authAction  from '../../actions/authAction';
import { connect } from 'react-redux';
// import { Row, Col } from 'react-bootstrap';
// import ListErrors from '../../components/listerrors';
// import { trls } from '../../components/translate';
const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    authLogin: (params) =>
              dispatch(authAction.fetchLoginData(params)),
});

class Login extends React.Component {
//   constructor() {   
//     super();
//     };
  handleSubmit = (event) => {
    event.preventDefault();
    const clientFormData = new FormData(event.target);
    const data = {};
    for (let key of clientFormData.keys()) {
        data[key] = clientFormData.get(key);
    }
    this.props.authLogin(data);
  }
  render() {
    
    return (
      <div>
          123      
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
