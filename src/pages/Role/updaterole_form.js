import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col, Container } from 'react-bootstrap';
import Select from 'react-select';
import { connect } from 'react-redux';
// import * as Auth from '../../components/auth'
// import DatePicker from "react-datepicker";
// import DateTimePicker from "react-datetime-picker";
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { trls } from '../../components/translate';
import * as authAction  from '../../actions/authAction';
import * as Common  from '../../components/common';
import ListErrors from '../../components/listerrors';
import Addrateform from './addrate_form';
import Updaterolerateform from './updaterolerate_form';
import { BallBeat } from 'react-pure-loaders';
import 'datatables.net';
import $ from 'jquery';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
    postUserError: (params) =>
        dispatch(authAction.dataServerFail(params)),
});
class Updateroleform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            roleRateData: [],
            loading: true,
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
            this.getRoleRateData();
        }
    }

    getRoleRateData = () =>{
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetFunctieTarieven+this.props.updateData.roleId, headers)
        .then(result => {
            this.setState({roleRateData: result.data.Items})
            this.setState({loading: false})
            this.props.removeFlag();
            $('#rolerate_table').dataTable().fnDestroy();
            $('#rolerate_table').DataTable(
                {
                    "aLengthMenu": [[5, 10, 15], [5, 10, 15]],
                    "searching": false,
                    "info": false,
                    "bLengthChange": false,
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
                    }
                }
                );
        })
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
            Kostprijs: this.state.Kostprijs,
            Prijs: this.state.Prijs,
            Omschrijving: data.description,
            Uursoort: data.hourtype,
            dekkingsartikel: data.article
        }
        Axios.post(API.PostRol, params, headers)
        .then(result => {
            this.props.onHide();
            this.props.onGetRoleData();    
        })
        .catch(err => {
        });
    }

    onHide = () => {
        this.setState({roleRateData:[]})
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

    changeArticle = (val) => {

    }

    updateRoleRate = (val) => {
        console.log('123123', val);
        this.setState({roleRateEditData:val})
        this.setState({modalRateEditShow: true})
    }

    render(){
        let hourType = [];
        let articleData = [];
        let roleRate = [];
        let updateData = this.props.updateData;
        roleRate = this.state.roleRateData;
        if(this.props.hourTypeData){
            hourType = this.props.hourTypeData.map( s => ({value:s.key,label:s.value}) );
        }
        if(this.props.articleData){
            articleData = this.props.articleData.map( s => ({value:s.key,label:s.value}) );
        }
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
                    {trls('Edit_role')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('Description')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="text" name="description" className="input-text" defaultValue={updateData.description} required placeholder={trls('Description')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="password">
                        <Form.Label column sm="3">
                        {trls('HourType')}   
                        </Form.Label>
                        <Col sm="9" className="product-text" style={{height:"auto"}}>
                            <Select
                                name="hourtype"
                                options={hourType}
                                placeholder={trls('Select')}
                                onChange={val => this.changeHourType(val)}
                                defaultValue={updateData.hourtype}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="confirmpassword">
                        <Form.Label column sm="3">
                            {trls('CoverArticle')}   
                        </Form.Label>
                        <Col sm="9" className="product-text" style={{height:"auto"}}>
                            <Select
                                name="article"
                                options={articleData}
                                placeholder={trls('Select')}
                                onChange={val => this.changeArticle(val)}
                                defaultValue={updateData.article}
                            />
                        </Col>
                    </Form.Group>
                    <ListErrors errors={this.props.error}/>
                    <Form.Group style={{textAlign:"center"}}>
                        <Button type="submit" variant="success" style={{width:"100px"}}><i className="fas fa-save" style={{paddingRight:5}}></i>{trls('Save')}</Button>
                    </Form.Group>
                </Form>
                <Container className="role-rate">
                    <Button variant="success" style={{maginTop:20, maginBottome:20}} onClick={()=>this.setState({modalRateShow:true})}><i className="fas fa-file-alt" style={{paddingRight:5}}></i>{trls('New_rate')}</Button> 
                    {roleRate.length>0&&(
                        <div className="table-responsive">
                            <table id="rolerate_table" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                                <thead>
                                    <tr>
                                        <th>{trls('PriceCost')}</th>
                                        <th>{trls('Price')}</th>
                                        <th>{trls('Coverage')}</th>
                                        <th>{trls('FinancialYear')}</th>
                                        <th>{trls('Adjust')}</th>
                                        <th>{trls('Action')}</th>
                                    </tr>
                                </thead>
                                {roleRate && !this.state.loading &&(<tbody >
                                    {
                                        roleRate.map((data,i) =>(
                                            <tr id={i} key={i}>
                                                <td>{Common.formatMoney(data.kostprijs)}</td>
                                                <td>{Common.formatMoney(data.prijs)}</td>
                                                <td>{Common.formatPercent(data.dekking)}</td>
                                                <td>{data.boekjaar}</td>
                                                <td>{data.aangepast}</td>
                                                {data.aangepast==null?(
                                                    <td>
                                                        <Row style={{justifyContent:"center"}}>
                                                            <i id={data.Id} className="fas fa-edit action-icon" style={{color: '#0C84FF'}} onClick={()=>this.updateRoleRate(data)}></i>
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
                <Addrateform
                    show={this.state.modalRateShow}
                    onHide={() => this.setState({modalRateShow:false})}
                    roleId={updateData.roleId}
                    onGetRoleRateData={()=>this.getRoleRateData()}
                    onSetLoading={()=>this.setState({loading: true})}
                />
                <Updaterolerateform
                    show={this.state.modalRateEditShow}
                    onHide={() => this.setState({modalRateEditShow:false})}
                    roleId={updateData.roleId}
                    roleRateEditData={this.state.roleRateEditData}
                    onSetLoading={()=>this.setState({loading: true})}
                    onGetRoleRateData={()=>this.getRoleRateData()}
                />
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Updateroleform);