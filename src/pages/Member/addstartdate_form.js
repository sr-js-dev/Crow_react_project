import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { trls } from '../../components/translate';
import * as authAction  from '../../actions/authAction';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as Common  from '../../components/common';
import * as Auth  from '../../components/auth';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
    postUserError: (params) =>
        dispatch(authAction.dataServerFail(params)),
});

class Addstartdateform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            startdate: new Date(),
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
        let updateData = this.props.startDateUpdateData;
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        var params = {
            id: updateData.id,
            achternaam: updateData.achternaam,
            voornaam: updateData.voornaam,
            email: updateData.email,
            urenperweek: updateData.urenperweek,
            personeelsnummer: updateData.personeelsnummer,
            uitdienst: updateData.uitdienst,
            indienst: updateData.indienst,
            Direct: updateData.Direct? true: '',
            startdate: Common.formatDate(this.state.startdate),
            username: Auth.getUserName()
        }
        Axios.post(API.PutMedewerkerStartdate, params, headers)
        .then(result => {
            this.props.onHide();
            this.props.onfinishSaveStaff();    
        })
        .catch(err => {
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
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {trls('Start_Date')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('Start_Date')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <DatePicker name="invoicedate" className="myDatePicker" selected={this.state.startdate} onChange={date =>this.setState({startdate:date})} />
                        </Col>
                    </Form.Group>
                    <Form.Group style={{textAlign:"center"}}>
                        <Button type="submit" variant="success" style={{width:"100px"}}><i className="fas fa-save" style={{paddingRight:5}}></i>{trls('Save')}</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Addstartdateform);