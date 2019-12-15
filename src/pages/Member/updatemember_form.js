import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { trls } from '../../components/translate';
import * as authAction  from '../../actions/authAction';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as Common  from '../../components/common';
import 'datatables.net';
import $ from 'jquery';
import Normhourform from './normhour_form';
import Addstartdateform from './addstartdate_form';
import { BallBeat } from 'react-pure-loaders';
import Sweetalert from 'sweetalert'

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
    postUserError: (params) =>
        dispatch(authAction.dataServerFail(params)),
});

class Updatememberform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            serviceDate: new Date(),
            outServiceDate: new Date(),
            direct: false,
            updateStaffDataSup: [],
            functiesData: [],
            loading: true,
            updateNormHourData: [],
            outServiceDateFlag: false,
            serviceDateFlag: false,
            updateFlag: false
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidMount() {
        this.props.blankdispatch();
        
    }

    componentDidUpdate() {
        if(this.props.updateFlag){
            this.getUpdateStaffSubData();
        }
    }
    
    getUpdateStaffSubData = () => {
        this._isMounted = true;
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetMedewerkerNormen+this.props.updateStaffData.id, headers)
        .then(result => {
            if(this._isMounted){
                this.props.onRemoveUpdateFalg();
                this.setState({updateStaffDataSup: result.data.Items})
                this.setState({direct: this.props.updateStaffData.Direct})
                this.setState({loading: false})
                $('#normhour_table').dataTable().fnDestroy();
                $('#normhour_table').DataTable(
                    {
                        "language": {
                            "lengthMenu": trls("Show")+" _MENU_ "+trls("Entries"),
                            "zeroRecords": "Nothing found - sorry",
                            "info": trls("Show_page")+" _PAGE_ of _PAGES_",
                            "infoEmpty": "No records available",
                            "infoFiltered": "(filtered from _MAX_ total records)",
                            "search": trls('Search'),
                            "paginate": {
                            "previous": trls('Previous'),
                            "next": trls('Next')
                            }
                        },
                        "aLengthMenu": [[5, 10, 15], [5, 10, 15]],
                        "searching": false,
                        "info": false,
                        "bLengthChange": false
                    }
                );
            }
        });
    }

    handleSubmit = (event) => {
        this._isMounted = true;
        let updateData = this.props.updateStaffData;
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        var params = {
            id: updateData.id,
            achternaam: data.lastname,
            voornaam: data.fisrtname,
            email: data.email,
            urenperweek: data.hoursperweek,
            personeelsnummer: data.staffnumber,
            uitdienst: Common.formatDate(this.state.outServiceDate),
            indienst: Common.formatDate(this.state.serviceDate),
            Direct: this.state.direct? true: '',
        }
        if( updateData.Achternaam!==data.lastname || updateData.Voornaam!==data.fisrtname || updateData.Email!==data.email || String(updateData['Uren per week'])!==data.hoursperweek || updateData['Personeelsnummer']!==data.staffnumber || updateData.Direct!==this.state.direct){
            this.setState({ startDateUpdateData: params, modaladdstartShow: true})
        }else{
            var headers = SessionManager.shared().getAuthorizationHeader();
            Axios.post(API.PutMedewerker, params, headers)
            .then(result => {
                this.onHide();
                this.props.onGetStaffData();
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

    addNormHourData = () => {
        this.setState({functiesData: this.props.mainRoleData, modaladdHourShow: true, updateFlag: false})
    }

    updateNormHour = (val) =>{
        this.setState({functiesData: this.props.mainRoleData, updateNormHourData: val, modaladdHourShow: true, updateFlag: true})
    }

    removeStateValue = () => {
        this.setState({ functiesData: [], updateNormHourData: []})
    }

    setMainRole = (roleId) =>{
        let roleData = this.props.mainRoleData;
        let selectValue = [];
        roleData.map((data, index)=>{
            if(data.key===roleId){
                selectValue = data.value;
            }
            return roleData;
        });
        return selectValue;
    }
    onHide = () =>{
        this.props.onHide();
        this.props.removeState();
        this.setState({updateStaffDataSup: []});
    }

    finishStartDate = () => {
        this.props.onHide();
        this.props.removeState();
        this.props.onGetStaffData();
        this.setState({updateStaffDataSup: []});
    }

    hourDeleteConfirm = (val) => {
        this.setState({hourId: val})
        Sweetalert({
            title: "Are you sure?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.hourDelete();
            } else {
            }
        });
    }

    hourDelete = () => {
        this._isMounted = true;
        var headers = SessionManager.shared().getAuthorizationHeader();
        let param = {
            id: this.state.hourId
        }
        Axios.post(API.DeleteMedewerkerNormen, param, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({loading: true})
                Sweetalert("Success!"+trls('The_norm_hour_has_been_deleted'), {
                    icon: "success",
                });
                this.getUpdateStaffSubData()
            }
        });
    }
    
    render(){
        let updateStaffData = [];
        let updateStaffDataSup = [];
        
        if(this.props.updateStaffData){
            updateStaffData = this.props.updateStaffData;
        }
        if(this.state.updateStaffDataSup){
            updateStaffDataSup = this.state.updateStaffDataSup;
        }

        return (
            <Modal
                show={this.props.show}
                onHide={()=>this.onHide()}
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
                            <Form.Control type="text" name="fisrtname" className="input-text" defaultValue={updateStaffData.Voornaam} required placeholder={trls('FirstName')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('LastName')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="text" name="lastname" className="input-text" defaultValue={updateStaffData.Achternaam} required placeholder={trls('LastName')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('Email')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="email" name="email" className="input-text" defaultValue={updateStaffData.Email} required placeholder={trls('Email')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('Staff_number')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="text" name="staffnumber" className="input-text" defaultValue={updateStaffData.Personeelsnummer} required placeholder={trls('Staff_number')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('Hours_per_week')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="number" name="hoursperweek" className="input-text" defaultValue={updateStaffData['Uren per week']} required placeholder={trls('Hours_per_week')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('Date_out_of_service')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            {!updateStaffData['Datum uit dienst'] || this.state.outServiceDateFlag?(
                                <DatePicker name="invoicedate" className="myDatePicker" selected={this.state.outServiceDate} onChange={date =>this.setState({outServiceDate:date, outServiceDateFlag: true})} /> 
                            ):
                                <DatePicker name="invoicedate" className="myDatePicker" selected={new Date(updateStaffData['Datum uit dienst'])} onChange={date =>this.setState({outServiceDate:date, outServiceDateFlag: true})} /> 
                            }
                            
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                            {trls('DateService')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            {!updateStaffData['Datum in dienst'] || this.state.serviceDateFlag?(
                                <DatePicker name="invoicedate" className="myDatePicker" selected={this.state.serviceDate} onChange={date =>this.setState({serviceDate:date, serviceDateFlag: true})} />
                            ):
                                <DatePicker name="invoicedate" className="myDatePicker" selected={new Date(updateStaffData['Datum in dienst'])} onChange={date =>this.setState({serviceDate:date, serviceDateFlag: true})} />
                            }
                           
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Col>
                            {updateStaffData?(
                                <Form.Check type="checkbox" name="Direct" label={trls('Direct')} style={{fontSize:"14px"}} defaultChecked={updateStaffData.Direct} onChange={this.onChangeDirect} />
                            ):
                                <Form.Check type="checkbox" name="Direct" label={trls('Direct')} style={{fontSize:"14px"}}  onChange={this.onChangeDirect} />
                            }
                            
                        </Col>
                    </Form.Group>
                    <Form.Group style={{textAlign:"center"}}>
                        <Button type="submit" variant="success" style={{width:"100px"}}><i className="fas fa-save" style={{paddingRight:5}}></i>{trls('Save')}</Button>
                    </Form.Group>
                </Form>
                <Container className="role-rate">
                    <Button variant="success" style={{maginTop:20, maginBottome:20}} onClick={()=>this.addNormHourData()}><i className="fas fa-file-alt" style={{paddingRight:5}}></i>{trls('New_norm_hours')}</Button> 
                    <Normhourform
                        show={this.state.modaladdHourShow}
                        onHide={() => this.setState({modaladdHourShow: false})}
                        onGetUpdateStaffSubData={()=>this.getUpdateStaffSubData()}
                        functiesData={this.state.functiesData}
                        staffId={this.props.updateStaffData.id}
                        onSetLoading={()=>this.setState({loading:true})}
                        normHourData={this.state.updateNormHourData}
                        removeStateValue={()=>this.removeStateValue()}
                        updateFlag={this.state.updateFlag}
                    /> 
                    <Addstartdateform
                        show={this.state.modaladdstartShow}
                        onHide={() => this.setState({modaladdstartShow: false})}
                        startDateUpdateData={this.state.startDateUpdateData}
                        onfinishSaveStaff={()=>this.finishStartDate()}
                    />
                    {updateStaffDataSup.length>0&&(
                        <div className="table-responsive">
                            <table id="normhour_table" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                                <thead>
                                    <tr>
                                        <th>{trls('Year')}</th>
                                        <th>{trls('NormHours')}</th>
                                        <th>{trls('Productivity')}</th>
                                        <th>{trls('Revenue')}</th>
                                        <th>{trls('Main_Role')}</th>
                                        <th>{trls('Starting_date')}</th>
                                        <th>{trls('EndDate')}</th>
                                        <th>{trls('Action')}</th>
                                    </tr>
                                </thead>
                                {updateStaffDataSup && !this.state.loading &&(<tbody >
                                    {
                                        updateStaffDataSup.map((data,i) =>(
                                            <tr id={i} key={i}>
                                                <td>{data.Jaar}</td>
                                                <td>{data.Normuren}</td>
                                                <td>{data.Productiviteit}</td>
                                                <td>{data.Omzet}</td>
                                                <td>{this.setMainRole(data.Hoofdrol)}</td>
                                                <td>{Common.formatDate(data.Begindatum)}</td>
                                                <td>{Common.formatDate(data.Einddatum)}</td>
                                                {data.aangepast==null?(
                                                    <td>
                                                        <Row style={{justifyContent:"space-around", paddingRight:"20px", paddingLeft:"20px"}}>
                                                            <i id={data.Id} className="fas fa-edit action-icon" style={{color: '#0C84FF'}} onClick={()=>this.updateNormHour(data)}></i>
                                                            <i id={data.id} className="fas fa-trash-alt action-icon" style={{color:'#F06D80'}} onClick={()=>this.hourDeleteConfirm(data.id)}></i>
                                                        </Row>
                                                    </td>
                                                ):<td></td>}
                                            </tr>
                                    ))
                                    }
                                </tbody>)}
                            </table>
                            { this.state.loading && (
                                <div className="col-md-4 offset-md-4 col-xs-12 loading" style={{textAlign:"center"}}>
                                    <BallBeat
                                        color={'#222A42'}
                                        loading={this.state.loading}
                                    />
                                </div>
                            )}
                        </div>  
                    )}
                    
                </Container>
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Updatememberform);