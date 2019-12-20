import React, {Component} from 'react'
import { Container, Button} from 'react-bootstrap';
import { connect } from 'react-redux';
// import Taggroupform from './taggroup_form';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import { trls } from '../../components/translate';
import 'datatables.net';
import * as authAction  from '../../actions/authAction';
import * as common  from '../../components/common';
import Sweetalert from 'sweetalert'
import DatePicker from "react-datepicker";

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
});

class Allhourmanage extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            loading: true,
            hourData: [],
            gropuId: '',
            startDate: new Date("01-01-2017"),
            endDate: new Date(),
            // hourData:[
            //     {Id:12, medewerker: 'Marjolein Leezer', Projectcode: "1219", Datum: "2019-01-02T00:00:00", Week: 1, jaar: 2018, Uren: 1, status: "Goedgekeurd"},
            //     {Id:13, medewerker: 'Marjolein Leezer', Projectcode: "1219", Datum: "2019-02-02T00:00:00", Week: 1, jaar: 2018, Uren: 1, status: "Goedgekeurd"},
            //     {Id:14, medewerker: 'Marjolein Leezer', Projectcode: "1219", Datum: "2017-07-02T00:00:00", Week: 1, jaar: 2018, Uren: 1, status: "Goedgekeurd"},
            //     {Id:15, medewerker: 'Marjolein Leezer', Projectcode: "1219", Datum: "2017-01-02T00:00:00", Week: 1, jaar: 2018, Uren: 1, status: "Goedgekeurd"},
            //     {Id:19, medewerker: 'Marjolein Leezer', Projectcode: "1219", Datum: "2018-11-12T00:00:00", Week: 1, jaar: 2018, Uren: 1, status: "Goedgekeurd"},
            //     {Id:21, medewerker: 'Marjolein Leezer', Projectcode: "1219", Datum: "2018-03-08T00:00:00", Week: 1, jaar: 2018, Uren: 1, status: "Goedgekeurd"},
            //     {Id:22, medewerker: 'Marjolein Leezer', Projectcode: "1219", Datum: "2018-12-14T00:00:00", Week: 1, jaar: 2018, Uren: 1, status: "Goedgekeurd"},
            //     {Id:24, medewerker: 'Marjolein Leezer', Projectcode: "1219", Datum: "2017-09-02T00:00:00", Week: 1, jaar: 2018, Uren: 1, status: "Goedgekeurd"},
            //     {Id:25, medewerker: 'Marjolein Leezer', Projectcode: "1219", Datum: "2019-10-02T00:00:00", Week: 1, jaar: 2018, Uren: 1, status: "Goedgekeurd"},
            //     {Id:27, medewerker: 'Marjolein Leezer', Projectcode: "1219", Datum: "2019-08-02T00:00:00", Week: 1, jaar: 2018, Uren: 1, status: "Goedgekeurd"},
            //     {Id:28, medewerker: 'Marjolein Leezer', Projectcode: "1219", Datum: "2018-12-02T00:00:00", Week: 1, jaar: 2018, Uren: 1, status: "Goedgekeurd"},
            //     {Id:29, medewerker: 'Marjolein Leezer', Projectcode: "1219", Datum: "2017-12-02T00:00:00", Week: 1, jaar: 2018, Uren: 1, status: "Goedgekeurd"},  
            //     {Id:30, medewerker: 'Marjolein Leezer', Projectcode: "1219", Datum: "2018-12-14T00:00:00", Week: 1, jaar: 2018, Uren: 1, status: "Goedgekeurd"},
            //     {Id:31, medewerker: 'Marjolein Leezer', Projectcode: "1219", Datum: "2017-09-02T00:00:00", Week: 1, jaar: 2018, Uren: 1, status: "Goedgekeurd"},
            //     {Id:32, medewerker: 'Marjolein Leezer', Projectcode: "1219", Datum: "2019-10-02T00:00:00", Week: 1, jaar: 2018, Uren: 1, status: "Goedgekeurd"},
            //     {Id:33, medewerker: 'Marjolein Leezer', Projectcode: "1219", Datum: "2019-08-02T00:00:00", Week: 1, jaar: 2018, Uren: 1, status: "Goedgekeurd"},
            //     {Id:38, medewerker: 'Marjolein Leezer', Projectcode: "1219", Datum: "2018-12-02T00:00:00", Week: 1, jaar: 2018, Uren: 1, status: "Goedgekeurd"},
            //     {Id:39, medewerker: 'Marjolein Leezer', Projectcode: "1219", Datum: "2017-12-02T00:00:00", Week: 1, jaar: 2018, Uren: 1, status: "Goedgekeurd"},                              
            // ],
            listOfId: [],
            hourDataArry: []
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
        // this.filterDateRange(null, null)
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetHoursList, headers)
        .then(result => {
            if(this._isMounted){
                console.log('3333333333', result)
                this.setState({hourData:result.data.Items})
                this.filterDateRange(null, null)
            }
        });
    }

    getTag = () => {
        console.log('555555555555')
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetDashboardUrl, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({loading:false})
                $('#allhour_table').dataTable().fnDestroy();
                $('#allhour_table').DataTable(
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

    filterDateRange = (start, end) => {
        var from = Date.parse(start ? start : this.state.startDate);
        var to   = Date.parse(end ? end : this.state.endDate);
        var hourData = this.state.hourData;
        let date, rangeDate;
        let hourDataArry = [];
        hourData.map(function (item, key) {
            date = new Date(item.Datum)
            rangeDate = Date.parse(date);
            if(from <= rangeDate && rangeDate <= to){
                hourDataArry.push(item);
            }
            return item;
        });
        this.setState({hourDataArry: hourDataArry})
        this.getTag();      
        console.log('2222222222222222');  
    }

    removeHourData = () => {
        var hourData = this.state.hourData;
        let hourDataArry = [];
        let listOfId = this.state.listOfId
        hourData.map(function (item, key) {
            if(listOfId.indexOf(item.Id)<0){
                hourDataArry.push(item);
            }
            return item;
        });
        this.setState({loading: true})
        this.setState({hourDataArry: hourDataArry})
        this.getTag();        
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
    
    changeStartDate = (date) => {
        this.setState({loading: true})
        this.setState({startDate: date});
        this.filterDateRange(date, null);
    }

    changeEndDate = (date) => {
        this.setState({loading: true})
        this.setState({endDate: date});
        this.filterDateRange(null, date);
    }

    handleChange = (event) => {
        let listId = parseInt(event.target.id);
        let listOfId = this.state.listOfId;
        if (listOfId.indexOf(listId) < 0) {
            listOfId.push(listId);
        } else {
            var index = listOfId.indexOf(listId);
            listOfId.splice(index, 1);
        }
        this.setState({listOfId: listOfId});
    }

    rejectAll = () => {
        this.state.listOfId.forEach(function (id) {
            var headers = SessionManager.shared().getAuthorizationHeader();
            Axios.post(API.BulkAfkeurenUren+id, headers)
            .then(result => {
            });
        });
        setTimeout(() => {
           this.getTaggroupData();
        }, 1000)
    }

    render () {
        let hourDataArry = this.state.hourDataArry;
        return (
            <Container>
                <div className="content__header content__header--with-line">
                    <h3 className="title">{trls('All_hours')}</h3>
                </div>
                <div className="orders">
                    <div className="orders__filters justify-content-between">
                    <div className="hour-date">
                        <p>{trls('End_date')}</p>
                        <DatePicker name="" className="myDatePicker hour-end-date" selected={this.state.startDate} onChange={date =>this.changeStartDate(date)} /> 
                        <DatePicker name="" className="myDatePicker hour-end-date" selected={this.state.endDate} onChange={date =>this.changeEndDate(date)} /> 
                    </div>
                    <Button variant="success" style={{maginTop:20, maginBottome:20}} onClick={()=>this.rejectAll()}>{trls('Reject')}</Button> 
                        <div className="page-table table-responsive">
                            <table id="allhour_table" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Id</th>
                                    <th>{trls('Staff_members')}</th>
                                    <th>{trls('Projectcode')}</th>
                                    <th>{trls('Date')}</th>
                                    <th>{trls('Week')}</th>
                                    <th>{trls('Year')}</th>
                                    <th>{trls('Hours')}</th>
                                    <th>{trls('Status')}</th>
                                </tr>
                            </thead>
                            {hourDataArry && !this.state.loading &&(<tbody >
                                {
                                    hourDataArry.map((data,i) =>(
                                        <tr id={i} key={i}>
                                            <td style={{textAlign: "center"}}>
                                                <input id={data.Id} type="checkbox" onChange={this.onChangeHourId} />
                                                {/* <Checkbox
                                                    // checked={checked}
                                                    onChange={this.handleChange}
                                                    // value="primary"
                                                    // inputProps={{ 'aria-label': 'primary checkbox' }}
                                                /> */}
                                            </td>
                                            <td>{data.Id}</td>
                                            <td>{data.medewerker}</td>
                                            <td>{data.Projectcode}</td>
                                            <td>{common.formatDate(data.Datum)}</td>
                                            <td>{data.Week}</td>
                                            <td>{data.jaar}</td>
                                            <td>{data.Uren}</td>
                                            <td>{data.status}</td>
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
    
  export default connect(mapStateToProps, mapDispatchToProps)(Allhourmanage);
