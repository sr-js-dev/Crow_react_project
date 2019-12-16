import React, {Component} from 'react'
import { Row, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import Updatecoverageform from './updatecoverage_form';
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

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
});
class Coveragemanage extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            coverageData:[],
            loading:true,
        };
    }

    componentDidMount() {
        this._isMounted=true
        this.getCoverageData();
        this.getArtikelenData();
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getArtikelenData = () =>{
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetArtikelenFromDWH, headers)
        .then(result => {
            this.setState({artikelenData: result.data.Items})  
        })
    }

    getCoverageData () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetDekking, headers)
        .then(result => {
            if(this._isMounted){
                // console.log('123', result)
                this.setState({coverageData:result.data.Items})
                this.setState({loading:false})
                $('#coverage_table').dataTable().fnDestroy();
                $('#coverage_table').DataTable(
                    {
                        "bPaginate": false,
                        "bFilter": false,
                        "bInfo": false,
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

    updatePurchase = (val) =>{
        let updateData = val;
        let artikelenArray = this.state.artikelenData
        artikelenArray.map((data, index)=>{
            if(data.key===val.Artikel){
                updateData.artikel = {"value":data.key, "label":data.value};
            }
            return artikelenArray;
        });
        this.setState({updateData: updateData})
        this.setState({modalupdateShow: true})
    }

    render () {
        let coverageData=this.state.coverageData;
        return (
            <Container>
                <div className="content__header content__header--with-line">
                    <h3 className="title">{trls('Coverage')}</h3>
                </div>
                <div className="orders">
                    <div className="orders__filters justify-content-between">
                        <Updatecoverageform
                            show={this.state.modalupdateShow}
                            onHide={() => this.setState({modalupdateShow: false})}
                            artikelenData={this.state.artikelenData}
                            onGetCoverageData={()=>this.getCoverageData()}
                            updateData={this.state.updateData}
                        />  
                        <div className="table-responsive">
                            <table id="coverage_table" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                            <thead>
                                <tr>
                                    <th style={{width:"60%"}}>{trls('Description')}</th>
                                    <th>{trls('Items')}</th>
                                    <th>{trls('Percentage')}</th>
                                    <th style={{width:"100px"}}>{trls('Action')}</th>
                                </tr>
                            </thead>
                            {coverageData && !this.state.loading &&(<tbody >
                                {
                                    coverageData.map((data,i) =>(
                                        <tr id={i} key={i}>
                                            <td>{data.Omschrijving}</td>
                                            <td>{data.Artikel}</td>
                                            <td>{data.percentage}</td>
                                            <td>
                                                 <Row style={{justifyContent:"center"}}>
                                                    <i id={data.id} className="fas fa-edit action-icon" style={{color: '#0C84FF'}} onClick={()=>this.updatePurchase(data)}></i>
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
    
  export default connect(mapStateToProps, mapDispatchToProps)(Coveragemanage);
