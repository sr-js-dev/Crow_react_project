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

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
    postUserError: (params) =>
        dispatch(authAction.dataServerFail(params)),
});
class Addmemberform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            serviceDate: new Date(),
            outServiceDate: new Date(),
            direct: false
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
        var params = {
            achternaam: data.lastname,
            voornaam: data.fisrtname,
            email: data.email,
            urenperweek: data.hoursperweek,
            personeelsnummer: data.staffnumber,
            uitdienst: Common.formatDate(this.state.outServiceDate),
            indienst: Common.formatDate(this.state.serviceDate),
            Direct: this.state.direct,

        }
        Axios.post(API.PostMedewerker, params, headers)
        .then(result => {
            this.props.onHide();
            this.props.onGetStaffData();    
        })
        .catch(err => {
        });
    }

    onHide = () => {
        this.props.onHide()
        this.props.blankdispatch();
    }

    changeHourType = (val) => {
        let hourTypeArray = this.props.hourTypeData;
        hourTypeArray.map((data, index)=>{
            if(data.key===val.value){
                this.setState({Kostprijs: data.KOSTPRIJS})
                this.setState({Prijs: data.PRIJS})
            }
            return hourTypeArray;
        });
    }

    onChangeDirect = (event) => {
        this.setState({direct: event.target.checked})
    }

    changeArticle = (val) => {

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
                    {trls('New_Staff_member')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('FirstName')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="text" name="fisrtname" className="input-text" required placeholder={trls('FirstName')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('LastName')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="text" name="lastname" className="input-text" required placeholder={trls('LastName')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('Email')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="email" name="email" className="input-text" required placeholder={trls('Email')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('Staff_number')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="text" name="staffnumber" className="input-text" required placeholder={trls('Staff_number')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('Hours_per_week')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="number" name="hoursperweek" className="input-text" required placeholder={trls('Hours_per_week')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('Date_out_of_service')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <DatePicker name="invoicedate" className="myDatePicker" selected={this.state.outServiceDate} onChange={date =>this.setState({outServiceDate:date})} /> 
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                            {trls('DateService')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                           <DatePicker name="invoicedate" className="myDatePicker" selected={this.state.serviceDate} onChange={date =>this.setState({serviceDate:date})} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Col>
                            <Form.Check type="checkbox" name="Direct" label={trls('Direct')} style={{fontSize:"14px"}}  onChange={this.onChangeDirect} />
                        </Col>
                    </Form.Group>
                    <Form.Group style={{textAlign:"center"}}>
                        <Button type="submit" variant="success"><i className="fas fa-save" style={{paddingRight:5}}></i>{trls('Save')}</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Addmemberform);