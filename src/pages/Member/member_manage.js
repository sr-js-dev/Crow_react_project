import React, {Component} from 'react'
import { Row, Container } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
// import Adduserform from './adduserform';
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
import * as Common from '../../components/common'
import Select from 'react-select';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
});
class Membermanage extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            memberData:[],
            loading:true,
        };
    }

    componentDidMount() {
        this._isMounted=true
        
        this.getPurchaseData()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getPurchaseData () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetMedewerkerGrid, headers)
        .then(result => {
            if(this._isMounted){
                // console.log('123', result)
                this.setState({memberData:result.data.Items})
                this.setState({loading:false})
                $('#member_table').dataTable().fnDestroy();
                $('#member_table').DataTable(
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
    
    onAddformHide = () => {
        this.setState({modalShow: false})
        this.props.blankdispatch()
    }

    onChangeViewUser = (val) =>{
        this.setState({viewUser: val})
    }

    render () {
        let memberData=this.state.memberData;
        return (
            <Container>
                <div className="content__header content__header--with-line">
                    <h3 className="title">{trls('Staff_members')}</h3>
                </div>
                <div className="orders">
                    <div className="orders__filters justify-content-between">
                        <Button variant="success" style={{maginTop:20, maginBottome:20}} onClick={()=>this.setState({modalShow:true, mode:"add", flag:false})}><i className="fas fa-plus" style={{paddingRight:5}}></i>{trls('Add_new_staffmember')}</Button> 
                            {/* <Adduserform
                                show={this.state.modalShow}
                                mode={this.state.mode}
                                onHide={() => this.onAddformHide()}
                                onGetUser={() => this.getUserData()}
                                userUpdateData={this.state.userUpdateData}
                                userID={this.state.userID}
                                updateflag={this.state.updateflag}
                                removeDetail={this.removeDetail}
                            />   */}
                        <div className="table-responsive">
                            <table id="member_table" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                            <thead>
                                <tr>
                                    <th>{trls('LastName')}</th>
                                    <th>{trls('FirstName')}</th>
                                    <th>{trls('Email')}</th>
                                    <th>{trls('Hours')}</th>
                                    <th>{trls('Employee_number')}</th>
                                    <th>{trls('Date_out_of_service')}</th>
                                    <th>{trls('DateService')}</th>
                                    <th>{trls('Direct')}</th>
                                    <th>{trls('Action')}</th>
                                </tr>
                            </thead>
                            {memberData && !this.state.loading &&(<tbody >
                                {
                                    memberData.map((data,i) =>(
                                        <tr id={i} key={i}>
                                            <td>{data.Achternaam}</td>
                                            <td>{data.Voornaam}</td>
                                            <td>{data.Email}</td>
                                            <td>{data['Uren per week']}</td>
                                            <td>{data.Personeelsnummer}</td>
                                            <td>{Common.formatDate(data['Datum uit dienst'])}</td>
                                            <td>{Common.formatDate(data['Datum in dienst'])}</td>
                                            <td>{data.Direct}</td>
                                            <td>
                                                 <Row style={{justifyContent:"space-around", paddingRight:"20px", paddingLeft:"20px"}}>
                                                    <i id={data.id} className="fas fa-edit action-icon" style={{color:'#0C84FF'}} onClick={this.userDeleteConfirm}></i>
                                                    <i id={data.id} className="fas fa-trash-alt action-icon" style={{color:'#F06D80'}} onClick={this.userDeleteConfirm}></i>
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
    
  export default connect(mapStateToProps, mapDispatchToProps)(Membermanage);
