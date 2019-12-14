import React, {Component} from 'react'
import { Row, Container } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Addroleform from './addrole_form';
import Updaterleform from './updaterole_form';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import { trls } from '../../components/translate';
// import { confirmAlert } from 'react-confirm-alert'; // Import
// import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import 'datatables.net';
import * as authAction  from '../../actions/authAction';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
});
class Rolemanage extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            roleData:[],
            loading:true,
            hourTypeData:[],
            articleData: [],
            updateData: [],
            updateFlag: false
        };
      }
    componentDidMount() {
        this._isMounted=true
        this.getRoleData();
        this.getHourTypeData();
        this.getArticleData();
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getHourTypeData = () =>{
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetUursoortenFromDWH, headers)
        .then(result => {
            this.setState({hourTypeData: result.data.Items})  
        })
    }

    getArticleData = () =>{
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetArtikelenFromDWH, headers)
        .then(result => {
            this.setState({articleData: result.data.Items})  
        })
    }

    getRoleData () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetRollen, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({roleData:result.data.Items})
                this.setState({loading:false})
                $('#role_table').dataTable().fnDestroy();
                $('#role_table').DataTable(
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
                      }
                    }
                  );
            }
        });
    }
    
    onAddformHide = () => {
        this.setState({modalShow: false})
        this.props.blankdispatch()
    }

    onChangeViewUser = (val) =>{
        this.setState({viewUser: val})
    }

    updateRole = (val) =>{
        let hourTypeArray = this.state.hourTypeData;
        let articleData = this.state.articleData;
        let updateData = [];
        let selectHourType = [];
        let selectArticle = [];
        hourTypeArray.map((data, index)=>{
            if(data.key===val.Uursoort){
                selectHourType = {"value":data.key, "label":data.value}
            }
            return hourTypeArray;
        });
        articleData.map((data, index)=>{
            if(data.key===val.Dekkingsartikel){
                selectArticle = {"value":data.key, "label":data.value}
            }
            return articleData;
        });
        updateData.description = val.Omschrijving;
        updateData.hourtype = selectHourType;
        updateData.article = selectArticle;
        updateData.roleId = val.Id;
        this.setState({updateData: updateData})
        this.setState({modalUpdateShow: true})
        this.setState({updateFlag: true})
    }

    removeFlag = () => {
        this.setState({updateFlag: false})
    }

    getCoverItem = (val)=>{
        let articleData = this.state.articleData;
        let returnValue = ''
        articleData.map((data, index)=>{
            if(data.key===val){
                returnValue = data.value
            }
            return articleData;
        });
        return returnValue;
    }

    render () {
        let roleData=this.state.roleData;
        return (
            <Container>
                <div className="content__header content__header--with-line">
                    <h3 className="title">{trls('Role')}</h3>
                </div>
                <div className="orders">
                    <div className="orders__filters justify-content-between">
                        <Button variant="success" style={{maginTop:20, maginBottome:20}} onClick={()=>this.setState({modaladdShow:true})}><i className="fas fa-plus" style={{paddingRight:5}}></i>{trls('Add_new_role')}</Button> 
                            <Addroleform
                                show={this.state.modaladdShow}
                                onHide={() => this.setState({modaladdShow:false})}
                                hourTypeData={this.state.hourTypeData}
                                articleData={this.state.articleData}
                                onGetRoleData={()=>this.getRoleData()}
                            />  
                            <Updaterleform
                                show={this.state.modalUpdateShow}
                                onHide={() => this.setState({modalUpdateShow:false})}
                                hourTypeData={this.state.hourTypeData}
                                articleData={this.state.articleData}
                                updateData={this.state.updateData}
                                updateFlag={this.state.updateFlag}
                                removeFlag={()=>this.removeFlag()}
                            />
                        <div className="table-responsive">
                            <table id="role_table" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                            <thead>
                                <tr>
                                    <th style={{width:"20%"}}>{trls('Description')}</th>
                                    <th>{trls('HourType')}</th>
                                    <th style={{width:"40%"}}>{trls('CoverItem')}</th>
                                    <th style={{width:"100px"}}>{trls('Action')}</th>
                                </tr>
                            </thead>
                            {roleData && !this.state.loading &&(<tbody >
                                {
                                    roleData.map((data,i) =>(
                                        <tr id={i} key={i}>
                                            <td>{data.Omschrijving}</td>
                                            <td>{data.Uursoort}</td>
                                            <td>{this.getCoverItem(data.Dekkingsartikel)}</td>
                                            <td>
                                                 <Row style={{justifyContent:"center"}}>
                                                    <i id={data.Id} className="fas fa-edit action-icon" style={{color: '#0C84FF'}} onClick={()=>this.updateRole(data)}></i>
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
    
  export default connect(mapStateToProps, mapDispatchToProps)(Rolemanage);
