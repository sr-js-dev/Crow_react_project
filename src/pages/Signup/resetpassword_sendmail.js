import React from 'react';
import * as authAction  from '../../actions/authAction';
import { connect } from 'react-redux';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import ListErrors from '../../components/listerrors';
import { trls } from '../../components/translate';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import Header from '../../components/header'

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    blankdispatch: () =>
        dispatch(authAction.blankdispatch()),
    postUserError: (params) =>
        dispatch(authAction.dataServerFail(params)),
});

class Resetpasswordsendmail extends React.Component {
    constructor() {   
        super();
        this.state = {  
            emailSucessFlag: false
        };
      };

    handleSubmit = (event) => {
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        let queryString = 'email='+data.email+'&resetPasswordBaseUrl=http://localhost:3000/reset-password'
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.SendForgotPasswordEmail+queryString, headers)
        .then(result => {
            this.setState({emailSucessFlag: true})
            console.log('123123123')
            
        })
        .catch(err => {
        });
        // this.props.authLogin(data);
    }
    render() {
        return (
            <div>
                <Header/>
                {!this.state.emailSucessFlag?(
                    <Container>
                        <div className="page-header">
                            <h2>{trls('Enter_email')}</h2>
                            <Row style={{paddingTop: 20}}>
                                <Col md={4}>
                                    <Form onSubmit = { this.handleSubmit }>
                                        <Form.Group controlId="form">
                                            <Form.Control type="email" name="email" className="login-input-password" placeholder={trls("Email")}/>
                                            <span className="glyphicon-envelope"><i className="fas fa-envelope"></i></span>
                                        </Form.Group>
                                        <Button type="submit" variant="success"><i className="fas fa-save" style={{paddingRight:5}}></i>{trls('Save')}</Button>
                                    <ListErrors errors={this.props.error}/>
                                    </Form>
                                </Col>
                            </Row>
                        </div>
                    </Container>
                ):
                    <Container>
                        <div className="page-header">
                            <h2>{trls('Sucess_email')}</h2>
                        </div>
                    </Container>
                }
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Resetpasswordsendmail);
