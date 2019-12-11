import React, {Component} from 'react'
import { Row, Container } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Adduserform from './adduser_form';
import Updateuserform from './update_form';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
// import { getUserToken } from '../../components/auth';
import { trls } from '../../components/translate';
// import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import 'datatables.net';
import * as authAction  from '../../actions/authAction';
import Switch from 'react-ios-switch';
import Select from 'react-select';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
});
class Usermanage extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            userData:[],
            flag:'',
            userUpdateData:[],
            loading:true,
            viewUser:true,
            roleData: [],
            selectUserEmail: ''
        };
      }
    componentDidMount() {
        this._isMounted=true
        this.getRoleData();
        this.getUserData();
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    getUserData () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetUser, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({userData:result.data.Items})
                this.setState({loading:false})
                $('#user_table').dataTable().fnDestroy();
                $('#user_table').DataTable(
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
    
    getRoleData = () => {
        this._isMounted = true;
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetRoles, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({roleData:result.data.Items})
            }
        });
    }

    onAddformHide = () => {
        this.setState({modalShow: false})
        this.props.blankdispatch()
    }

    onChangeViewUser = (val) =>{
        this.setState({viewUser: val})
        this.getUserData();
    }

    selectRole = (val) => {
        let rolArray = this.state.roleData;
        let returnData = [];
        rolArray.map((data, index)=> {
            if(data.key===val){
                returnData = {"value":data.key, "label":data.value}
            }
            return rolArray;
        });
        return returnData;
    }

    setRole = (val, userId) => {
        var headers = SessionManager.shared().getAuthorizationHeader();
        var params = {
            "roleid": val.value,
            "userid": userId
        }
        Axios.post(API.PutRoleToUser, params, headers)
        .then(result => {
        })
        .catch(err => {
        });
    }

    userUpdate = (e) => {
        this.setState({selectUserEmail: e.currentTarget.id, modalpdateShow: true})
    }

    userActive = (e) => {
        var headers = SessionManager.shared().getAuthorizationHeader();
        var params = {
        }
        var userId = e.currentTarget.id;
        Axios.post(API.PostActiveuser+userId, params, headers)
        .then(result => {
            this.props.onHide();
            this.getUserData();
        })
        .catch(err => {
        });
    }

    userInActive = (e) => {
        var headers = SessionManager.shared().getAuthorizationHeader();
        var params = {
            userid: e.currentTarget.id
        }
        Axios.post(API.PutInactiveUser, params, headers)
        .then(result => {
            this.getUserData();
        })
        .catch(err => {
        });
    }

    render () {
        let roleData = [];
        if(this.state.roleData){
            roleData = this.state.roleData.map( s => ({value:s.key,label:s.value}) );
        }
        let userData = this.state.userData;
        let optionarray = [];
        if(this.state.viewUser){
            if(userData){
                userData.map((data, index) => {
                    if(data.IsActive){
                        optionarray.push(data);
                    }
                  return userData;
                })
            }
        }else{
            optionarray = this.state.userData;
        }
        
        return (
            <Container>
                <div className="content__header content__header--with-line">
                    <h3 className="title">{trls('Users')}</h3>
                </div>
                <div className="orders">
                    <div className="orders__filters justify-content-between">
                        <Button variant="success" style={{maginTop:20}} onClick={()=>this.setState({modaladdShow:true})}><i className="fas fa-user-plus" style={{paddingRight:5}}></i>{trls('New_user')}</Button> 
                        <div style={{marginTop:20, paddingBottom:20}}>   
                            <Switch
                                checked={this.state.viewUser}
                                className={undefined}
                                disabled={undefined}
                                handleColor="white"
                                name={undefined}
                                offColor="white"
                                onChange={(val) => {this.onChangeViewUser(val)}}
                                onColor="#28a745"
                                pendingOffColor={undefined}
                                pendingOnColor={undefined}
                                readOnly={undefined}
                                style={undefined}
                            />
                        </div>
                        <Adduserform
                            show={this.state.modaladdShow}
                            onHide={() => this.setState({modaladdShow:false})}
                            onGetUserData={() => this.getUserData()}
                        />  
                        <Updateuserform
                            show={this.state.modalpdateShow}
                            onHide={() => this.setState({modalpdateShow:false})}
                            onGetUserData={() => this.getUserData()}
                            userEmail={this.state.selectUserEmail}
                        />
                        <div className="table-responsive">
                            <table id="user_table" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                            <thead>
                                <tr>
                                    <th style={{width:"20%"}}>{trls('Email')}</th>
                                    <th>{trls('UserName')}</th>
                                    <th style={{width:"70px"}}>{trls('Active')}</th>
                                    <th style={{width:"300px"}}>{trls('Role')}</th>
                                    <th style={{width:100}}>{trls('Action')}</th>
                                </tr>
                            </thead>
                            {optionarray && !this.state.loading &&(<tbody >
                                {
                                    optionarray.map((data,i) =>(
                                        <tr id={i} key={i}>
                                            <td>{data.Email}</td>
                                            <td>{data.UserName}</td>
                                            {data.IsActive?(
                                                <td>
                                                    <Row style={{justifyContent:"center"}}>
                                                    <i className="fas fa-circle active-icon"></i><div>Active</div>
                                                    </Row>
                                                </td>
                                            ):
                                                <td >
                                                    <Row style={{justifyContent:"center"}}>
                                                    <i className="fas fa-circle inactive-icon"></i><div>Inactive</div>
                                                    </Row>
                                                </td>
                                            }
                                            <td>
                                                <Select
                                                    name="roles"
                                                    options={roleData}
                                                    // value={{"value":roledata,"label": roledata}}
                                                    placeholder={trls('Select')}
                                                    onChange={val => this.setRole(val, data.Id)}
                                                    defaultValue={this.selectRole(data.RoleId)}
                                                />
                                            </td>
                                            <td>
                                                 <Row style={{justifyContent:"space-around", padding:10}}>
                                                    <i id={data.Email} className="fas fa-user-edit action-icon" style={{color: '#0C84FF'}} onClick={this.userUpdate}></i>
                                                    <i id={data.Id} className="fas fa-toggle-on action-icon" style={{color: 'rgb(249, 161, 58)'}} onClick={this.userActive}></i>
                                                    <i id={data.Id} className="fas fa-toggle-off action-icon" onClick={this.userInActive}></i>
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
    
  export default connect(mapStateToProps, mapDispatchToProps)(Usermanage);
