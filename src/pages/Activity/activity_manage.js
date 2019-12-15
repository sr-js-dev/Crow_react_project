import React, {Component} from 'react'
import { Row, Container } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Activityform from './activity_form';
// import Updatememberform from './updatemember_form';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import { trls } from '../../components/translate';
import 'datatables.net';
import * as authAction  from '../../actions/authAction';
import Sweetalert from 'sweetalert'

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
});
class Activitymanage extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            loading: true,
            activityData: [],
            updateActivityData: [],
            updateFlag: false,
            activityId: ''
        };
    }

    componentDidMount() {
        this._isMounted=true
        this.getActivityData();
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getActivityData () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetActiviteitenGrid, headers)
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
                        "aLengthMenu": [[5, 10, 15], [5, 10, 15]],
                        "searching": false,
                        "info": false,
                        "bLengthChange": false
                    }
                  );
            }
        });
    }

    activityUpdate = (val) => {
        this.setState({updateActivityData: val, updateFlag: true, modaladdShow: true})
    }

    deleteActivityData = (val) => {
        this.setState({activityId: val})
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
            id: this.state.activityId
        }
        Axios.post(API.DeleteActiviteiten, param, headers)
        .then(result => {
            if(this._isMounted){
                Sweetalert("Success!"+trls('The_norm_hour_has_been_deleted'), {
                    icon: "success",
                });
                this.getActivityData()
            }
        });
    }
    render () {
        let activityData = this.state.activityData;
        return (
            <Container>
                <div className="content__header content__header--with-line">
                    <h3 className="title">{trls('Activities')}</h3>
                </div>
                <div className="orders">
                    <div className="orders__filters justify-content-between">
                        <Button variant="success" style={{maginTop:20, maginBottome:20}} onClick={()=>this.setState({modaladdShow:true})}><i className="fas fa-plus" style={{paddingRight:5}}></i>{trls('Add_new_activity')}</Button> 
                        <Activityform
                            show={this.state.modaladdShow}
                            onHide={() => this.setState({modaladdShow: false})}
                            onGetActivityData={()=>this.getActivityData()}
                            updateActivityData={this.state.updateActivityData}
                            updateFlag={this.state.updateFlag}
                        />  
                        <div className="page-table table-responsive">
                            <table id="activity_table" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                            <thead>
                                <tr>
                                    <th>{trls('Value')}</th>
                                    <th style={{width: 100}}>{trls('Action')}</th>
                                </tr>
                            </thead>
                            {activityData && !this.state.loading &&(<tbody >
                                {
                                    activityData.map((data,i) =>(
                                        <tr id={i} key={i}>
                                            <td>{data.value}</td>
                                            <td>
                                                <Row style={{justifyContent:"space-around", paddingRight:"20px", paddingLeft:"20px"}}>
                                                    <i id={data.key} className="fas fa-edit action-icon" style={{color:'#0C84FF'}} onClick={()=>this.activityUpdate(data)}></i>
                                                    <i id={data.key} className="fas fa-trash-alt action-icon" style={{color:'#F06D80'}} onClick={()=>this.deleteActivityData(data.key)}></i>
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
    
  export default connect(mapStateToProps, mapDispatchToProps)(Activitymanage);
