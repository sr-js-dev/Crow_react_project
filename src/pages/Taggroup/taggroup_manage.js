import React, {Component} from 'react'
import { Row, Container, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Taggroupform from './taggroup_form';
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

class Taggroupmanage extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            loading: true,
            taggrupData: [],
            gropuId: ''
        };
    }

    componentDidMount() {
        this._isMounted=true
        this.getTaggroupData();
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getTaggroupData () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetTagGroups, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({taggrupData:result.data.Items})
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
                        "aLengthMenu": [[5, 10, 15], [5, 10, 15]],
                        "searching": false,
                        "info": false,
                        "bLengthChange": false
                    }
                  );
            }
        });
    }

    deleteGroupConfirm = (val) => {
        this.setState({gropuId: val})
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
            id: this.state.gropuId
        }
        Axios.post(API.DeleteTagGroup, param, headers)
        .then(result => {
            if(this._isMounted){
                Sweetalert("Success!"+trls('The_norm_hour_has_been_deleted'), {
                    icon: "success",
                });
                this.getTaggroupData()
            }
        });
    }

    activityUpdate = (val) => {
        this.setState({updateData: val, updateFlag: true, modaladdShow: true})
    }

    render () {
        let taggrupData = this.state.taggrupData;
        return (
            <Container>
                <div className="content__header content__header--with-line">
                    <h3 className="title">{trls('Tag_groups')}</h3>
                </div>
                <div className="orders">
                    <div className="orders__filters justify-content-between">
                        <Button variant="success" style={{maginTop:20, maginBottome:20}} onClick={()=>this.setState({modaladdShow:true})}><i className="fas fa-plus" style={{paddingRight:5}}></i>{trls('Add_new_taggroup')}</Button> 
                        <Taggroupform
                            show={this.state.modaladdShow}
                            onHide={() => this.setState({modaladdShow: false})}
                            onGetTaggroupData={()=>this.getTaggroupData()}
                        />  
                        <div className="page-table table-responsive">
                            <table id="setting_table" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                            <thead>
                                <tr>
                                    <th>{trls('Group')}</th>
                                    <th style={{width: 30}}>{trls('Action')}</th>
                                </tr>
                            </thead>
                            {taggrupData && !this.state.loading &&(<tbody >
                                {
                                    taggrupData.map((data,i) =>(
                                        <tr id={i} key={i}>
                                            <td>{data.Groep}</td>
                                            <td>
                                                <Row style={{justifyContent:"space-around", paddingRight:"20px", paddingLeft:"20px"}}>
                                                    <i id={data.Id} className="fas fa-trash-alt action-icon" style={{color:'#F06D80'}} onClick={()=>this.deleteGroupConfirm(data.Id)}></i>
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
    
  export default connect(mapStateToProps, mapDispatchToProps)(Taggroupmanage);
