import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
// import Select from 'react-select';
import { connect } from 'react-redux';
// import * as Auth from '../../components/auth'
// import DatePicker from "react-datepicker";
// import DateTimePicker from "react-datetime-picker";
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { trls } from '../../components/translate';
import * as authAction  from '../../actions/authAction';
import ListErrors from '../../components/listerrors';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
    postUserError: (params) =>
        dispatch(authAction.dataServerFail(params)),
});
class Adduserform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidMount() {
        this.props.blankdispatch();
    }

    handleSubmit = (event) => {
        this._isMounted = true;
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.Postusers, data, headers)
        .then(result => {
            this.props.onHide();
            this.props.onGetUserData();    
        })
        .catch(err => {
            if(err.response.data.ModelState[""]){
                this.props.postUserError(err.response.data.ModelState[""])
            }else if(err.response.data.ModelState["model.Password"] && !err.response.data.ModelState["model.ConfirmPassword"]){
                this.props.postUserError(err.response.data.ModelState["model.Password"])
            }else if(err.response.data.ModelState["model.ConfirmPassword"])
                this.props.postUserError(err.response.data.ModelState["model.ConfirmPassword"])
        });
    }

    onHide = () => {
        this.props.onHide()
        this.props.blankdispatch();
    }
    
    render(){
        return (
            <Modal
                show={this.props.show}
                onHide={this.onHide}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {trls('New_user')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('Email_address')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div" style={{height:"auto"}}>
                            <Form.Control type="email" name="email" className="input-text" required placeholder={trls('Email')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="password">
                        <Form.Label column sm="3">
                        {trls('Password')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div" style={{height:"auto"}}>
                            <Form.Control type="password" name="password" className="input-text" required placeholder={trls('Password')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="confirmpassword">
                        <Form.Label column sm="3">
                        {trls('Confirm_password')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div" style={{height:"auto"}}>
                            <Form.Control type="password" name="confirmpassword" className="input-text" required placeholder={trls('Confirm_password')} />
                        </Col>
                    </Form.Group>
                    <ListErrors errors={this.props.error}/>
                    <Form.Group style={{textAlign:"center"}}>
                        <Button type="submit" variant="success"><i className="fas fa-save" style={{paddingRight:5}}></i>{trls('Save')}</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Adduserform);