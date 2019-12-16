import React, {Component} from 'react'
import { Row, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import Settingform from './setting_form';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import { trls } from '../../components/translate';
import 'datatables.net';
import * as authAction  from '../../actions/authAction';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
});

class Settingmanage extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            loading: true,
            settingData: [],
            updateData: [],
            updateFlag: false,
            activityId: ''
        };
    }

    componentDidMount() {
        this._isMounted=true
        this.getSettingData();
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getSettingData () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetInstellingen, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({settingData:result.data.Items})
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

    activityUpdate = (val) => {
        this.setState({updateData: val, updateFlag: true, modaladdShow: true})
    }

    render () {
        let settingData = this.state.settingData;
        return (
            <Container>
                <div className="content__header content__header--with-line">
                    <h3 className="title">{trls('Settings')}</h3>
                </div>
                <div className="orders">
                    <div className="orders__filters justify-content-between">
                        <Settingform
                            show={this.state.modaladdShow}
                            onHide={() => this.setState({modaladdShow: false})}
                            onGetSettingData={()=>this.getSettingData()}
                            updateData={this.state.updateData}
                        />  
                        <div className="page-table table-responsive">
                            <table id="setting_table" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                            <thead>
                                <tr>
                                    <th>{trls('Label')}</th>
                                    <th>{trls('Value')}</th>
                                    <th style={{width: 30}}>{trls('Action')}</th>
                                </tr>
                            </thead>
                            {settingData && !this.state.loading &&(<tbody >
                                {
                                    settingData.map((data,i) =>(
                                        <tr id={i} key={i}>
                                            <td>{data.Label}</td>
                                            <td>{data.Waarde}</td>
                                            <td>
                                                <Row style={{justifyContent:"space-around", paddingRight:"20px", paddingLeft:"20px"}}>
                                                    <i id={data.key} className="fas fa-edit action-icon" style={{color:'#0C84FF'}} onClick={()=>this.activityUpdate(data)}></i>
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
    
  export default connect(mapStateToProps, mapDispatchToProps)(Settingmanage);
