import React, {Component} from 'react'
import { Row, Container } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Tagform from './tag_form';
import Tagupdateform from './tagupdate_form';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import { trls } from '../../components/translate';
import 'datatables.net';
import * as authAction  from '../../actions/authAction';
import * as auth  from '../../components/auth';
import Sweetalert from 'sweetalert'

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
});
class Tagmanage extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            loading: true,
            activityData: [],
            tagUpdateData: [],
            taggroupData: [],
            projectDropdownData: [],
            updateFlag: false,
            tagId: '',
            tag: ''
        };
    }

    componentDidMount() {
        this._isMounted=true
        this.getTagData();
        this.getTagGraops();
        this.getProjectDropdown();
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getTagData () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetTags, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({activityData:result.data.Items})
                this.setState({loading:false})
                $('#activity_table').dataTable().fnDestroy();
                $('#activity_table').DataTable(
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

    getTagGraops = () => {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetTagGroups, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({taggroupData:result.data.Items})
            }
        });
    }

    

    tagUpdate = (data) => {
        this.setState({updateFlag: true, tagId: data.Id,  modalupdateShow: true})
    }

    getProjectDropdown = () => {
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetProjectDropdown+auth.getUserName(), headers)
        .then(result => {
            if(this._isMounted){
                this.setState({projectDropdownData:result.data.Items})
            }
        });
    }

    deleteTagData = (val) => {
        this.setState({tag: val})
        Sweetalert({
            title: "Are you sure?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.deleteData();
            } else {
            }
        });
    }

    deleteData = () => {
        this._isMounted = true;
        var headers = SessionManager.shared().getAuthorizationHeader();
        let param = {
            tag: this.state.tag
        }
        Axios.post(API.DeleteTag, param, headers)
        .then(result => {
            if(this._isMounted){
                this.getTagData()
            }
        });
    }

    RemoveFlag = () => {
        this.setState({updateFlag: false});
    } 

    render () {
        let activityData = this.state.activityData;
        return (
            <Container>
                <div className="content__header content__header--with-line">
                    <h3 className="title">{trls('Tags')}</h3>
                </div>
                <div className="orders">
                    <div className="orders__filters justify-content-between">
                        <Button variant="success" style={{maginTop:20, maginBottome:20}} onClick={()=>this.setState({modaladdShow:true})}><i className="fas fa-plus" style={{paddingRight:5}}></i>{trls('Add_new_tag')}</Button> 
                        <Tagform
                            show={this.state.modaladdShow}
                            onHide={() => this.setState({modaladdShow: false})}
                            onGetTagData={()=>this.getTagData()}
                            updateActivityData={this.state.updateActivityData}
                            updateFlag={this.state.updateFlag}
                            taggroupData={this.state.taggroupData}
                        />  
                        <Tagupdateform
                             show={this.state.modalupdateShow}
                             onHide={() => this.setState({modalupdateShow: false})}
                             updateFlag={this.state.updateFlag}
                             projectDropdownData={this.state.projectDropdownData}
                             onRemoveUpdateFlag={()=>this.RemoveFlag()}
                             tagId={this.state.tagId}
                        />
                        <div className="page-table table-responsive">
                            <table id="activity_table" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                            <thead>
                                <tr>
                                    <th>Tag</th>
                                    <th>{trls('TagGroup')}</th>
                                    <th style={{width: 100}}>{trls('Action')}</th>
                                </tr>
                            </thead>
                            {activityData && !this.state.loading &&(<tbody >
                                {
                                    activityData.map((data,i) =>(
                                        <tr id={i} key={i}>
                                            <td>{data.Tag}</td>
                                            <td>{data.TagGroup}</td>
                                            <td>
                                                <Row style={{justifyContent:"space-around", paddingRight:"20px", paddingLeft:"20px"}}>
                                                    <i id={data.Id} className="fas fa-edit action-icon" style={{color:'#0C84FF'}} onClick={()=>this.tagUpdate(data)}></i>
                                                    <i id={data.Id} className="fas fa-trash-alt action-icon" style={{color:'#F06D80'}} onClick={()=>this.deleteTagData(data.Tag)}></i>
                                                </Row>
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
    
  export default connect(mapStateToProps, mapDispatchToProps)(Tagmanage);
