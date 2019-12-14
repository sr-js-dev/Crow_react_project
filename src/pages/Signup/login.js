import { Link } from 'react-router-dom';
import React from 'react';
import * as authAction  from '../../actions/authAction';
import { connect } from 'react-redux';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import ListErrors from '../../components/listerrors';
import { trls } from '../../components/translate';
import Select from 'react-select';
import Pageloadspiiner from '../../components/page_load_spinner';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    authLogin: (params) =>
              dispatch(authAction.fetchLoginData(params)),
    changeLan: (params) =>
              dispatch(authAction.changeLan(params)),
});

class Login extends React.Component {
  constructor() {   
    super();
    this.state = {  
      languages:[{"value":"en_US","label":"English"},{"value":"nl_BE","label":"Dutch"}],
      selectrolvalue:window.localStorage.getItem('crow_lang'),
      selectrollabel:window.localStorage.getItem('crow_label'),
    };
  };

  changeLangauge = (val) => {
    this.setState({selectrolvalue:val.value, selectrollabel: val.label});
    this.props.changeLan(val)
  }

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
      <Container>
          <div className="page-header">
              <h2>{trls('Login')+'.'}</h2>
              <Row>
                <Col md={4}>
                    <Form onSubmit = { this.handleSubmit }>
                        {/* <ListErrors errors={this.props.error} /> */}
                        <Form.Group controlId="form">
                            <Form.Control type="text" name="username" className="login-input-email" placeholder={trls("Login")}/>
                            <span className="glyphicon-envelope"><i className="fas fa-envelope"></i></span>
                        </Form.Group>
                        <Form.Group controlId="form">
                            <Form.Control type="password" name="password" className="login-input-password" placeholder={trls("Password")}/>
                            <span className="glyphicon-lock"><i className="fas fa-lock"></i></span>
                        </Form.Group>
                        <Form.Group controlId="form" style={{textAlign:'left'}}>
                            <Select
                                name="lan"
                                options={this.state.languages}
                                className="login-select-lang-class"
                                value={{"label":this.state.selectrollabel,"value":this.state.selectrolvalue}}
                                onChange={val => this.changeLangauge(val)}
                            />
                        </Form.Group>
                        <p className="text-xs-center">
                            <Link to="/register" style={{color:"#158cba"}}>
                              {trls("Forgot_password")}
                            </Link>
                        </p>
                    <Button type="submit" variant="info" style={{textTransform:"uppercase"}}><i className="fas fa-sign-in-alt" style={{paddingRight:5}}></i>{trls('Login')}</Button>
                    <ListErrors errors={this.props.error}/>
                    </Form>
                </Col>
              </Row>
          </div>
          <Pageloadspiiner/>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
