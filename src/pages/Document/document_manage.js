import React, {Component} from 'react'
import { Container, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Documentform from './document_form';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import { trls } from '../../components/translate';
import 'datatables.net';
import * as authAction  from '../../actions/authAction';
import * as auth  from '../../components/auth';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
});

class Documentmanage extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            loading: true,
            documentData: [],
            projectData: [],
            documentTypeData: [],
            relationData: [],
            medewerkerData: [],
            year:[
                {value:'2008', label: '2008'},
                {value:'2009', label: '2009'},
                {value:'2010', label: '2010'},
                {value:'2011', label: '2011'},
                {value:'2012', label: '2012'},
                {value:'2013', label: '2013'},
                {value:'2014', label: '2014'},
                {value:'2015', label: '2015'},
                {value:'2016', label: '2016'},
                {value:'2017', label: '2017'},
                {value:'2018', label: '2018'},
                {value:'2019', label: '2019'},
                {value:'2020', label: '2020'},
                {value:'2021', label: '2021'},
                {value:'2022', label: '2022'},
                {value:'2023', label: '2023'},
                {value:'2024', label: '2024'},
                {value:'2025', label: '2025'},
            ]
        };
    }

    componentDidMount() {
        this._isMounted=true
        this.getDocumentData();
        this.getProjectData();
        this.getDocumentTypeDropdown();
        this.getDebiteurenDropdown();
        this.getMedewerkerDropdown();
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getDocumentData () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetDocuments, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({documentData:result.data.Items})
                this.setState({loading:false})
                $('#setting_table').dataTable().fnDestroy();
                $('#setting_table').DataTable(
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
                    }
                  );
            }
        });
    }

    getProjectData () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetProjectDropdown+auth.getUserName(), headers)
        .then(result => {
            if(this._isMounted){
                this.setState({projectData: result.data.Items})
            }
        });
    }

    getDocumentTypeDropdown () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetDocumentTypeDropdown, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({documentTypeData: result.data.Items})
            }
        });
    }

    getDebiteurenDropdown () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetDebiteurenDropdown, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({relationData: result.data.Items})
            }
        });
    }

    getMedewerkerDropdown () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetMedewerkerDropdown, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({medewerkerData: result.data.Items})
            }
        });
    }

    getDocumentFile = (documentId) => {
        this._isMounted = true;
        let documentUrl = API.GetDocumentFile+documentId;
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetDocumentFile+documentId, headers)
        .then(result => {
            if(this._isMounted){
                window.open(documentUrl, '_blank');
            }
        });
    }

    render () {
        let documentData = this.state.documentData;
        return (
            <Container>
                <div className="content__header content__header--with-line">
                    <h3 className="title">{trls('Documents')}</h3>
                </div>
                <div className="orders">
                    <div className="orders__filters justify-content-between">
                    <Button variant="success" style={{maginTop:20, maginBottome:20}} onClick={()=>this.setState({modaladdShow:true})}><i className="fas fa-plus" style={{paddingRight:5}}></i>{trls('Add_new_document')}</Button> 
                        <Documentform
                            show={this.state.modaladdShow}
                            onHide={() => this.setState({modaladdShow: false})}
                            projectData={this.state.projectData}
                            documentTypeData={this.state.documentTypeData}
                            relationData={this.state.relationData}
                            medewerkerData={this.state.medewerkerData}
                            year={this.state.year}
                            onGetDocumentData={()=>this.getDocumentData()}
                        />  
                        <div className="page-table table-responsive">
                            <table id="setting_table" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                            <thead>
                                <tr>
                                    <th>{trls('Documenttype')}</th>
                                    <th>{trls('Document')}</th>
                                </tr>
                            </thead>
                            {documentData && !this.state.loading &&(<tbody >
                                {
                                    documentData.map((data,i) =>(
                                        <tr id={i} key={i}>
                                            <td>{data.DocumentType}</td>
                                            <td>
                                                <div style={{cursor: "pointer", color:'#004388', fontSize:"13px", fontWeight:'bold', textDecoration:"underline"}} onClick={()=>this.getDocumentFile(data.FileStorageId)}>{data.Document}</div>
                                            </td>
                                        </tr>
                                ))
                                }
                            </tbody>)}
                        </table>
                            { this.state.loading&& (
                                <div className="col-md-4 offset-md-4 col-xs-12 loading" style={{textAlign:"center"}}>
                                    <BallBeat
                                        color={'#222A42'}
                                        loading={this.state.loading}
                                    />
                                </div>
                            )}
                        </div>    
                        </div>
                    </div>
            </Container>
        )
        };
  }
    
  export default connect(mapStateToProps, mapDispatchToProps)(Documentmanage);
