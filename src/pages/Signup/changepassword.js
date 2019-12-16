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

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    blankdispatch: () =>
        dispatch(authAction.blankdispatch()),
    postUserError: (params) =>
        dispatch(authAction.dataServerFail(params)),
});

class Changepassword extends React.Component {

  handleSubmit = (event) => {
    event.preventDefault();
    const clientFormData = new FormData(event.target);
    const data = {};
    for (let key of clientFormData.keys()) {
        data[key] = clientFormData.get(key);
    }
    var headers = SessionManager.shared().getAuthorizationHeader();
    Axios.post(API.ChangePassword, data, headers)
    .then(result => {
        Sweetalert("Success!", {
            icon: "success",
        });
    })
    .catch(err => {
        if(err.response.data.ModelState[""]){
            this.props.postUserError(err.response.data.ModelState[""])
        }else if(err.response.data.ModelState["model.NewPassword"] && !err.response.data.ModelState["model.ConfirmPassword"]){
            this.props.postUserError(err.response.data.ModelState["model.NewPassword"])
        }else if(err.response.data.ModelState["model.ConfirmPassword"])
            this.props.postUserError(err.response.data.ModelState["model.ConfirmPassword"])
    });
    // this.props.authLogin(data);
  }
  render() {
    return (
        <div>
            <Container>
                <div className="page-header">
                    <h2>{trls('Password_change')}</h2>
                    <Row style={{paddingTop: 20}}>
                        <Col md={4}>
                            <Form onSubmit = { this.handleSubmit }>
                                <Form.Group controlId="form">
                                    <Form.Control type="password" name="OldPassword" className="login-input-password" placeholder={trls("Old_password")}/>
                                    <span className="glyphicon-old-lock"><i className="fas fa-lock"></i></span>
                                </Form.Group>
                                <Form.Group controlId="form">
                                    <Form.Control type="password" name="NewPassword" className="login-input-password" placeholder={trls("New_password")}/>
                                    <span className="glyphicon-lock"><i className="fas fa-lock"></i></span>
                                </Form.Group>
                                <Form.Group controlId="form">
                                    <Form.Control type="password" name="ConfirmPassword" className="login-input-password" placeholder={trls("Confirm_newpassword")}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Changepassword);
