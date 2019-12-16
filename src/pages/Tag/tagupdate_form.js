import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { trls } from '../../components/translate';
import * as authAction  from '../../actions/authAction';
import Select from 'react-select';
import { BallBeat } from 'react-pure-loaders';
import 'datatables.net';
import $ from 'jquery';
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

class Tagupdateform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            val1: '',
            tagUpdateData: [],
            loading: true
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidUpdate() {
        if(this.props.updateFlag){
            this.tagUpdate();
        }
    }

    tagUpdate = (data) => {
        this._isMounted = true
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetProjectsByTag+this.props.tagId, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({tagUpdateData: result.data.Items})
                this.props.onRemoveUpdateFlag();
                this.setState({loading: false})
                $('#project_table').dataTable().fnDestroy();
                $('#project_table').DataTable(
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
        let params = [];
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        params = {
            projectId: data.projectId,
            tagid: this.props.tagId
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.PostTagProject, params, headers)
        .then(result => {
            this.setState({loading: true})
            this.tagUpdate();
        })
        .catch(err => {
        });
    }

    onHide = () => {
        this.props.onHide();
        this.setState({tagUpdateData: []})
    }

    getProject = (val) => {
        let projectArray = this.props.projectDropdownData;
        let value = '';
        projectArray.map((data, index)=>{
            if(data.key===val){
                value = data.value
            }
            return projectArray;
        });
        return value;
    }

    deleteProjectById = (projectId) => {
        var headers = SessionManager.shared().getAuthorizationHeader();
        var params = {
            tagid: this.props.tagId,
            projectid: this.state.projectId
        }
        Axios.post(API.DeleteTagProject, params, headers)
        .then(result => {
            this.setState({loading: true})
            this.tagUpdate();
        })
        .catch(err => {
        });
    }

    deleteProject = (val) => {
        this.setState({projectId: val})
        Sweetalert({
            title: "Are you sure?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.deleteProjectById();
                
            } else {
            }
          });
    }
    
    render(){
        let tagUpdateData=this.state.tagUpdateData;
        let projectDropdownData = [];
        if(this.props.projectDropdownData){
            projectDropdownData = this.props.projectDropdownData.map( s => ({value:s.key,label:s.value}) );
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
                    {trls('Edit_tag')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                            {trls('Project')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Select
                                name="projectId"
                                options={projectDropdownData}
                                placeholder={trls('Select')}
                                onChange={val => this.setState({val1:val})}
                            />
                            {!this.props.disabled && (
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
                    <Form.Group style={{textAlign:"center"}}>
                        <Button type="submit" variant="success" style={{width:"100px"}}><i className="fas fa-save" style={{paddingRight:5}}></i>{trls('Save')}</Button>
                    </Form.Group>
                    <Container className="role-rate">
                        {tagUpdateData.length>0&&(
                            <div className="table-responsive" style={{paddingTop: 0}}>
                                <table id="project_table" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                                    <thead>
                                        <tr>
                                            <th>{trls('Project')}</th>
                                            <th style={{width:50}}>{trls('Action')}</th>
                                        </tr>
                                    </thead>
                                    {tagUpdateData && !this.state.loading &&(<tbody >
                                        {
                                            tagUpdateData.map((data,i) =>(
                                                <tr id={i} key={i}>
                                                    <td>{this.getProject(data.ProjectId)}</td>
                                                    <td>
                                                        <Row style={{justifyContent:"space-around", paddingRight:"20px", paddingLeft:"20px"}}>
                                                            <i id={data.ProjectId} className="fas fa-trash-alt action-icon" style={{color:'#F06D80'}} onClick={()=>this.deleteProject(data.ProjectId)}></i>
                                                        </Row>
                                                    </td>
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
                </Form>
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Tagupdateform);