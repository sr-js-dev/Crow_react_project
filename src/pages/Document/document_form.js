import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { trls } from '../../components/translate';
import * as authAction  from '../../actions/authAction';
import $ from 'jquery';
import * as Auth   from '../../components/auth';
import Select from 'react-select';
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

class Documentform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            filename: '',
            uploadFlag: false,
            project: [],
            val2: '',
            year: [],
            relation: [],
            medwerker: [],
            fileId: ''
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
            var params = {
                filestorageid: this.state.fileId,
                documenttypeid: data.documenttype,
                relatieid: '',
                naam: data.name
            };
            var headers = SessionManager.shared().getAuthorizationHeader();
            Axios.post(API.PostDocuments, params, headers)
            .then(result => {
                this.state.project.map((item) => {
                    params = {
                        documentid: result.data.NewId,
                        projectid: item.value,
                    };
                    Axios.post(API.PostDocumentProjects, params, headers)
                    .then(result=>{
                    })
                    return this.state.project;
                });
                this.state.year.map((item) => {
                    params = {
                        documentid: result.data.NewId,
                        boekjaar: item.value,
                    };
                    Axios.post(API.PostDocumentBoekjaren, params, headers)
                    .then(result=>{
                    })
                    return this.state.year;
                });
                this.state.medwerker.map((item) => {
                    params = {
                        documentid: result.data.NewId,
                        medewerkerid: item.value,
                    };
                    Axios.post(API.PostDocumentMedewerkers, params, headers)
                    .then(result=>{
                    })
                    return this.state.medwerker;
                });
                this.state.relation.map((item) => {
                    params = {
                        documentid: result.data.NewId,
                        relatieid: item.value,
                    };
                    Axios.post(API.PostDocumentRelaties, params, headers)
                    .then(result=>{
                    })
                    return this.state.relation;
                });
                this.props.onGetDocumentData();
                this.onHide()
                
            })
            .catch(err => {
            });
    }

    onHide = () => {
        this.props.onHide();
        this.setState({filename: '', file: '', uploadFlag: false, fileId: ''})
        this.props.blankdispatch();
    }

    openUploadFile = () =>{
        $('#inputFile').show();
        $('#inputFile').focus();
        $('#inputFile').click();
        $('#inputFile').hide();
    }
    
    onChange = (e) => {
        this.setState({filename: e.target.files[0].name})
        this.setState({file:e.target.files[0]})
        this.fileUpload(e.target.files[0])

    }

    fileUpload(file){
        var formData = new FormData();
        formData.append('file', file);// file from input
        var headers = {
            "headers": {
                "Authorization": "bearer "+Auth.getUserToken(),
                'Content-Type': undefined,
            }
        }
        Axios.post(API.DocumentFileUpload, formData, headers)
        .then(result => {
            this.setState({uploadFlag: true, fileId: result.data.Id})
        })
        .catch(err => {
        });
    }

    render(){
        let projectData = this.props.projectData.map( s => ({value:s.key,label:s.value}));
        let year = this.props.year
        let documentTypeData = this.props.documentTypeData.map( s => ({value:s.key,label:s.value}));
        let relationData = this.props.relationData.map( s => ({value:s.key,label:s.value}));
        let medewerkerData = this.props.medewerkerData.map( s => ({value:s.key,label:s.value}));
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
                    {trls('New_Document')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3" >
                            {trls('File')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Button type="button" variant="success"  style={{width:"auto", height:"35px", fontSize:"14px"}} onClick={this.openUploadFile}><i className="fas fa-file" style={{paddingRight:5}}/>{trls('Choose_File')}</Button>
                            <Form.Label style={{color:"#0903FB", paddingLeft:"10px"}}>
                                <u>{this.state.filename}</u>
                            </Form.Label>
                            <input id="inputFile" name="file" type="file" accept="*.*"  onChange={this.onChange} style={{display: "none"}} />
                            {!this.props.disabled && (
                                <input
                                    onChange={val=>console.log()}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity:0, height: 0, width: "100%"}}
                                    value={this.state.fileId}
                                    required
                                />
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email" className="document-name">
                        <Form.Label column sm="3">
                        {trls('Name')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="text" name="name" className="input-text" required placeholder={trls('Name')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                            {trls('Projectcode')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Select
                                name="project"
                                placeholder={trls('Select')}
                                options={projectData}
                                onChange={val => this.setState({project: val})}
                                isMulti={true}
                            />
                             {!this.props.disabled && (
                                <input
                                    onChange={val=>console.log()}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity:0, height: 0, width: "100%"}}
                                    value={this.state.project}
                                    required
                                />
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                            {trls('Documenttype')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Select
                                name="documenttype"
                                placeholder={trls('Select')}
                                options={documentTypeData}
                                onChange={val => this.setState({val2: val})}
                            />
                            {!this.props.disabled && (
                                <input
                                    onChange={val=>console.log()}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity:0, height: 0, width: "100%"}}
                                    value={this.state.val2}
                                    required
                                />
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                            {trls('Financial_year')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Select
                                name="year"
                                placeholder={trls('Select')}
                                options={year}
                                onChange={val => this.setState({year: val})}
                                isMulti={true}
                            />
                            {!this.props.disabled && (
                                <input
                                    onChange={val=>console.log()}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity:0, height: 0, width: "100%"}}
                                    value={this.state.year}
                                    required
                                />
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                            {trls('Relationship')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Select
                                name="relation"
                                placeholder={trls('Select')}
                                options={relationData}
                                onChange={val => this.setState({relation: val})}
                                isMulti={true}
                            />
                            {/* {!this.props.disabled && (
                                <input
                                    onChange={val=>console.log()}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity:0, height: 0, width: "100%"}}
                                    value={this.state.relation}
                                    required
                                />
                            )} */}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                            {trls('Project_led')}   
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            <Select
                                name="Project_led"
                                placeholder={trls('Select')}
                                options={medewerkerData}
                                onChange={val => this.setState({medwerker: val})}
                                isMulti={true}
                            />
                            {!this.props.disabled && (
                                <input
                                    onChange={val=>console.log()}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity:0, height: 0, width: "100%"}}
                                    value={this.state.medwerker}
                                    required
                                />
                            )}
                        </Col>
                    </Form.Group>
                    <ListErrors errors={this.props.error}/>
                    <Form.Group style={{textAlign:"center"}}>
                        <Button type="submit" variant="success" style={{width:"100px"}}><i className="fas fa-save" style={{paddingRight:5}}></i>{trls('Save')}</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Documentform);