import React, {Component} from 'react'
import { Row, Container } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Addmemberform from './addmember_form';
import Updatememberform from './updatemember_form';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import { trls } from '../../components/translate';
import 'datatables.net';
import * as authAction  from '../../actions/authAction';
import * as Common from '../../components/common'
import Sweetalert from 'sweetalert'

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
            updateStaffData: [],
            loading:true,
            updateFlag: false,
            mainRoleData: [],
        };
    }

    componentDidMount() {
        this._isMounted=true
        this.getStaffData();
        this.getMainRoleData();
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getMainRoleData () {
        this._isMounted = true;
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetFuncties, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({mainRoleData: result.data.Items})
            }
        });
    }

    getStaffData () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetMedewerkerGrid, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({memberData:result.data.Items})
                this.setState({loading:false})
                // $('#member_table thead tr').clone(true).appendTo( '#member_table thead' );
                // $('#member_table thead tr:eq(1) th').each( function (i) {
                //     var title = $(this).text();
                //     $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
                //     $(this).addClass("sort-style");
                //     $( 'input', this ).on( 'keyup change', function () {
                //         if ( table.column(i).search() !== this.value ) {
                //             table
                //                 .column(i)
                //                 .search( this.value )
                //                 .draw();
                //         }
                //     } );
                // } );
                $('#member_table').dataTable().fnDestroy();
                var table = $('#member_table').DataTable(
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
                      orderCellsTop: true,
                      fixedHeader: true
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

    staffUpdate = (val) =>{
        this.setState({updateStaffData: val, modalupdateShow: true});
        this.setState({updateFlag: true});

    }

    removeFlag = () => {
        this.setState({updateFlag: false})
    }

    removeState = () => {
        this.setState({updateStaffData: []})
    }

    staffDelete = (val) => {
        this.setState({medewerkerid: val})
        Sweetalert({
            title: "Are you sure?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.staffDataDelete();
                
            } else {
                
            }
          });
    }

    staffDataDelete = () => {
        this._isMounted = true;
        var headers = SessionManager.shared().getAuthorizationHeader();
        let param = {
            medewerkerid: this.state.medewerkerid
        }
        Axios.post(API.DeleteMedewerker, param, headers)
        .then(result => {
            if(this._isMounted){
                Sweetalert("Success!"+trls('The_staff_has_been_deleted'), {
                    icon: "success",
                });
                this.getStaffData()
            }
        });
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
                        <Button variant="success" style={{maginTop:20, maginBottome:20}} onClick={()=>this.setState({modaladdShow:true})}><i className="fas fa-plus" style={{paddingRight:5}}></i>{trls('Add_new_staffmember')}</Button> 
                        <Addmemberform
                            show={this.state.modaladdShow}
                            onHide={() => this.setState({modaladdShow: false})}
                            onGetStaffData={()=>this.getStaffData()}
                        />   
                        <Updatememberform
                            show={this.state.modalupdateShow}
                            onHide={() => this.setState({modalupdateShow: false})}
                            onGetStaffData={()=>this.getStaffData()}
                            updateStaffData={this.state.updateStaffData}
                            updateFlag={this.state.updateFlag}
                            onRemoveUpdateFalg={()=>this.removeFlag()}
                            mainRoleData={this.state.mainRoleData}
                            removeState={()=>this.removeState()}
                        /> 
                        <div className="page-table table-responsive">
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
                                            {data.Direct?(
                                                <td>
                                                    <Row style={{justifyContent:"center"}}>
                                                    <i className="fas fa-circle active-icon"></i><div>True</div>
                                                    </Row>
                                                </td>
                                            ):
                                                <td >
                                                    <Row style={{justifyContent:"center"}}>
                                                    <i className="fas fa-circle inactive-icon"></i><div>False</div>
                                                    </Row>
                                                </td>
                                            }
                                            <td>
                                                <Row style={{justifyContent:"space-around", paddingRight:"20px", paddingLeft:"20px"}}>
                                                    <i id={data.id} className="fas fa-edit action-icon" style={{color:'#0C84FF'}} onClick={()=>this.staffUpdate(data)}></i>
                                                    <i id={data.id} className="fas fa-trash-alt action-icon" style={{color:'#F06D80'}} onClick={()=>this.staffDelete(data.id)}></i>
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
