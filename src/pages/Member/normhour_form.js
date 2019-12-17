import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
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
class Normhourform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            startdate: new Date(),
            enddate: new Date(),
            functiesData: [],
            val1: [],
            startDateFlag: false,
            endDateFlag: false
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
        var params = [];
        var headers = SessionManager.shared().getAuthorizationHeader();
        if(!this.props.updateFlag){
            params = {
                medewerkerid: this.props.staffId,
                jaar: data.year,
                omzet: data.revenue,
                normuren: data.normhour,
                productiviteit: data.productivity,
                hoofdrol: data.mainrole,
                Begindatum: Common.formatDate(this.state.startdate),
                Einddatum: Common.formatDate(this.state.enddate),
            }
            Axios.post(API.PostMedewerkerNormen, params, headers)
            .then(result => {
                this.onHide();
                this.props.onSetLoading();
                this.props.onGetUpdateStaffSubData();    
            })
            .catch(err => {
            });
        }else{
            params = {
                medewerkerid: this.props.staffId,
                jaar: data.year,
                omzet: data.revenue,
                normuren: data.normhour,
                productiviteit: data.productivity,
                hoofdrol: data.mainrole,
                Begindatum: Common.formatDate(this.state.startdate),
                Einddatum: Common.formatDate(this.state.enddate),
                id: this.props.normHourData.id
            }
            Axios.post(API.PutMedewerkerNormen, params, headers)
            .then(result => {
                this.onHide();
                this.props.onSetLoading();
                this.props.onGetUpdateStaffSubData();    
            })
            .catch(err => {
            });
        }
        
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
    
    setMainRole = (roleId) =>{
        let roleData = this.props.functiesData;
        let selectValue = [];
        roleData.map((data, index)=>{
            if(data.key===roleId){
                selectValue = {"value":data.key, "label":data.value};
            }
            return roleData;
        });
        return selectValue;
    }

    onHide = () => {
        this.props.onHide();
        this.props.blankdispatch();
        this.props.removeStateValue();
        this.setState({startDateFlag: false, endDateFlag: false})
    }

    render(){
        let functiesData = [];
        let normHourData = [];
        if(this.props.functiesData){
            functiesData = this.props.functiesData.map( s => ({value:s.key,label:s.value}) );
        }
        if(this.props.normHourData){
            normHourData = this.props.normHourData;
        }
        return (
            <Modal
                show={this.props.show}
                onHide={()=>this.onHide()}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {!this.props.updateFlag?(
                        trls('New_norm_hours')
                    ):trls('Edit_norm_hours')}
                    
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('Year')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="number" name="year" className="input-text" defaultValue={normHourData.Jaar} required placeholder={trls('Year')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('NormHours')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="number" name="normhour" className="input-text" defaultValue={normHourData.Normuren} required placeholder={trls('NormHours')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('Productivity')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="number" name="productivity" className="input-text" defaultValue={normHourData.Productiviteit} required placeholder={trls('Productivity')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('Revenue')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="number" name="revenue" className="input-text" defaultValue={normHourData.Omzet} required placeholder={trls('Revenue')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('Main_Role')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Select
                                name="mainrole"
                                options={functiesData}
                                placeholder={trls('Select')}
                                onChange={val => this.setState({val1:val})}
                                defaultValue = {this.setMainRole(normHourData.Hoofdrol)}
                            />
                            {!this.props.disabled && !this.props.normHourData && (
                                <input
                                    onChange={val=>console.log()}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity:0, height: 0, width: "100%"}}
                                    value={this.state.val1}
                                    required
                                />
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('Starting_date')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            {!normHourData.Begindatum || this.state.startDateFlag?(
                                <DatePicker name="invoicedate" className="myDatePicker" selected={this.state.startdate} onChange={date =>this.setState({startdate:date, startDateFlag: true})}/> 
                            ):
                                <DatePicker name="invoicedate" className="myDatePicker" selected={new Date(normHourData.Begindatum)} onChange={date =>this.setState({startdate:date, startDateFlag: true})}/> 
                            }
                            
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                            {trls('EndDate')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            {!normHourData.Einddatum || this.state.endDateFlag?(
                                <DatePicker name="invoicedate" className="myDatePicker" selected={this.state.enddate} onChange={date =>this.setState({enddate:date, endDateFlag: true})} />
                            ):
                                <DatePicker name="invoicedate" className="myDatePicker" selected={new Date(normHourData.Einddatum)} onChange={date =>this.setState({enddate:date, endDateFlag: true})} />
                            }
                           
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
export default connect(mapStateToProps, mapDispatchToProps)(Normhourform);