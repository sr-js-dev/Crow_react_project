import React from 'react';
import * as authAction  from '../../actions/authAction';
import { connect } from 'react-redux';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import ListErrors from '../../components/listerrors';
import { trls } from '../../components/translate';
import Pageloadspiiner from '../../components/page_load_spinner';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import Sweetalert from 'sweetalert'
import Header from '../../components/header'

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    blankdispatch: () =>
        dispatch(authAction.blankdispatch()),
    postUserError: (params) =>
        dispatch(authAction.dataServerFail(params)),
});

class Resetpassword extends React.Component {

    handleSubmit = (event) => {
        var code = this.getUrlParameter('code',window.location.href);
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        let params = {
            Email: data.email,
            Password: data.Password,
            ConfirmPassword: data.ConfirmPassword,
            Code: code
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.ResetPassword, params, headers)
        .then(result => {
            Sweetalert("Success!", {
                icon: "success",
            });
            this.props.blankdispatch();
        })
        .catch(err => {
            if(err.response.data.Message){
                this.props.postUserError(err.response.data.Message)
            }
            else if(err.response.data.ModelState[""]){
                this.props.postUserError(err.response.data.ModelState[""])
            }else if(err.response.data.ModelState["model.Password"] && !err.response.data.ModelState["model.ConfirmPassword"]){
                this.props.postUserError(err.response.data.ModelState["model.Password"])
            }else if(err.response.data.ModelState["model.ConfirmPassword"]){
                this.props.postUserError(err.response.data.ModelState["model.ConfirmPassword"])
            }
        });
        // this.props.authLogin(data);
    }
    getUrlParameter = (name, url) => {
        name = name.replace(/\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&]*)');
        var results = regex.exec(url);
        return results === null ? '' : decodeURIComponent(results[1]);
    }
    render() {
        return (
            <div>
                <Header/>
                <Container>
                    <div className="page-header">
                        <h2>{trls('Reset_password')}</h2>
                        <Row style={{paddingTop: 20}}>
                            <Col md={4}>
                                <Form onSubmit = { this.handleSubmit }>
                                    <Form.Group controlId="form">
                                        <Form.Control type="email" name="email" className="login-input-password" placeholder={trls("Email")}/>
                                        <span className="glyphicon-old-lock"><i className="fas fa-envelope"></i></span>
                                    </Form.Group>
                                    <Form.Group controlId="form">
                                        <Form.Control type="password" name="Password" className="login-input-password" placeholder={trls("Password")}/>
                                        <span className="glyphicon-lock"><i className="fas fa-lock"></i></span>
                                    </Form.Group>
                                    <Form.Group controlId="form">
                                        <Form.Control type="password" name="ConfirmPassword" className="login-input-password" placeholder={trls("Confirm_password")}/>
                                        <span className="glyphicon-confirm-lock"><i className="fas fa-lock"></i></span>
                                    </Form.Group>
                                    <Button type="submit" variant="success" style={{width:"100px"}}><i className="fas fa-save" style={{paddingRight:5}}></i>{trls('Save')}</Button>
                                <ListErrors errors={this.props.error}/>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                    <Pageloadspiiner/>
                </Container>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Resetpassword);
