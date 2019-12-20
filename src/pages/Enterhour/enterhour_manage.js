import React, {Component} from 'react'
import { Row, Container, Col, Form} from 'react-bootstrap';
import { connect } from 'react-redux';
// import Taggroupform from './taggroup_form';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import { trls } from '../../components/translate';
import 'datatables.net';
import * as authAction  from '../../actions/authAction';
import * as Auth  from '../../components/auth';
import Select from 'react-select';
import moment from 'moment';
import DatePicker from "react-datepicker";

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
});

class Enterhourmanage extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            loading: true,
            userData: [],
            gropuId: '',
            employeeId: '',
            employee: '',
            workdate: new Date(),
            currentDate: new Date(),
            statuses: [],
            weekStatuses: [],
            currentWeek: [],
            lastWeek: [],
            thirdLastWeek: [],
            secondLastWeek: [],
            c_currentWeeks: []
        };
    }

    componentDidMount() {
        this._isMounted=true
        this.getLoggedInEmployee();
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getLoggedInEmployee () {
        this._isMounted = true;
        let employeeData = [];
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetLoggedInEmployee+Auth.getUserName(), headers)
        .then(result => {
            employeeData = result.data.Items;
            if(this._isMounted){
                this.setState({employee: employeeData[0].value, employeeId: employeeData[0].key})
                this.getUserData()
            }
        });
    }

    getUserData () {
        this._isMounted = true;
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetUser, headers)
        .then(result => {
            if(this._isMounted){    
                let userdata = result.data.Items.map( s => ({value:s.Id,label:s.UserName}));
                let userArray = result.data.Items;
                let defaultData = [];
                userArray.map((data, index)=>{
                    if(data.UserName===Auth.getUserName()){
                        defaultData = {"value":data.Id, "label":data.UserName}
                    }
                    return userArray;
                });
                this.setState({defaultUserData: defaultData})
                this.setState({userData: userdata})
                this.fillTable();
                
            }
        });
    }

    getNumberOfWeek = (date) => {
        if (date !== undefined) {
            var dateTemp = date.substr(date.length - 10);
            dateTemp = moment(dateTemp, "DD-MM-YYYY");

            return dateTemp.week();
        } else {
            return false;
        }
    };

    fillDate = (week, index, substract, weekStatus, key) => {
        // console.log('week', week);
        // console.log('index', index);
        // console.log('substract', substract);
        // console.log('weekStatus', weekStatus);
        // console.log('key', key);
        // this.setState({c_currentWeeks: this.state.currentWeek})
        var monday = moment(this.state.currentDate).startOf('isoweek');
        
        if (substract) {
            monday = monday.subtract(substract, 'days');
        }
        if (index) {
            monday = monday.add(index, 'days');
        }
        monday = monday.format("dd DD-MM-YYYY");
        var val = this.changeFormat(monday.substr(3));
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetSumUrenByEmployeeDate+'MedewerkerId='+this.state.employeeId+'&Datum='+val, headers)
        .then(response => {
            if (response.data.Items[0]) {
                var datesByWeeks = {};
                datesByWeeks[val] = key;
                this.setState({datesByWeeks: datesByWeeks})
                // console.log('22222222', this.state.datesByWeeks);
                var value = isNaN(parseFloat(response.data.Items[0].Uren)) ? 0 : parseFloat(response.data.Items[0].Uren);
                var alreadyUsedHoursByDay = {};
                alreadyUsedHoursByDay[val] = value
                this.setState({alreadyUsedHoursByDay: alreadyUsedHoursByDay})
                if (isNaN(this.state.alreadyUsedHoursByDay[val])) {
                    alreadyUsedHoursByDay[val] = 0
                    this.setState({alreadyUsedHoursByDay: alreadyUsedHoursByDay})
                }
                var alreadyUsedHoursByWeek = {}
                if (isNaN(this.state.alreadyUsedHoursByWeek[key])) {
                    alreadyUsedHoursByWeek[key] = 0;
                    this.setState({alreadyUsedHoursByWeek: alreadyUsedHoursByWeek})
                }
                alreadyUsedHoursByWeek[key] += value
                this.setState({alreadyUsedHoursByWeek: alreadyUsedHoursByWeek})
                var status = response.data.Items[0].Status == null ? 0 : response.data.Items[0].Status,
                    uren = response.data.Items[0].Uren == null ? 0 : (response.data.Items[0].Uren + '').replace('.', ',');

                Axios.get(API.GetUrenStatus+'statusId='+status, headers)
                .then(response => {
                    var statuses = {};
                    if (response.data.Items[0]) {
                        statuses[substract] = {
                            'color': response.data.Items[0].Color,
                            'name': response.data.Items[0].StatusDescription
                        };
                        this.setState({statuses: statuses})
                    }
                })
                var minStatus = 5;
                Axios.get(API.GetUrenByEmployeeDate+'MedewerkerId='+this.state.employeeId+'&Datum='+val, headers)
                .then(response => {
                    var dataArray = response.data.Items;
                    if (dataArray.length > 0) {
                        dataArray.map((valueData, index)=>{
                            var projectid = valueData.projectid;
                            var alreadyUsedHoursByProject = {}
                            if (isNaN(this.state.alreadyUsedHoursByProject[projectid])) {
                                alreadyUsedHoursByProject[projectid] =0;
                                this.setState({alreadyUsedHoursByProject: alreadyUsedHoursByProject})
                            }

                            var value = parseFloat(valueData['Aantal uren']);
                            if (isNaN(value)) {
                                value = 0;
                            }
                            alreadyUsedHoursByProject[projectid] += value
                            this.setState({alreadyUsedHoursByProject: alreadyUsedHoursByProject})

                            if (minStatus > valueData.StatusId) {
                                minStatus = valueData.StatusId;
                            }
                            if (weekStatus > valueData.StatusId) {
                                weekStatus = valueData.StatusId;
                            }
                            return dataArray;
                        });
                    }
                        
                    week.push({
                        'date': monday,
                        'value': uren,
                        'status': status,
                        'minStatus': minStatus
                    });
                    var weekStatuses = {};
                    if (index < 6) {
                        this.fillDate(week, index + 1, substract, weekStatus, key);
                    } else {
                        weekStatuses[key] = weekStatus
                        this.setState({weekStatuses: weekStatuses})
                    }
                })
            }
        });

    }
    changeFormat = (date) => {
        var array = date.split('-');
        return array[2] + '-' + array[1] + '-' + array[0];
    }

    fillTable = () => {
        this.setState({datesByWeeks: {}, alreadyUsedHoursByDay: {}, alreadyUsedHoursByProject: {}, alreadyUsedHoursByWeek: {}, currentWeek: [], lastWeek: [], secondLastWeek: [], thirdLastWeek: []})
        this.fillDate(this.state.currentWeek, 0, 0, 5, 'currentWeek')
        this.fillDate(this.state.lastWeek, 0, 7, 5, 'lastWeek')
        this.fillDate(this.state.secondLastWeek, 0, 14, 5, 'secondLastWeek')
        this.fillDate(this.state.thirdLastWeek, 0, 21, 5, 'thirdLastWeek')
    };

    render () {
        let currentWeek = [];
        let lastWeek = [];
        let secondLastWeek = [];
        let thirdLastWeek = [];
        currentWeek = this.state.currentWeek;
        lastWeek = this.state.lastWeek;
        secondLastWeek = this.state.secondLastWeek;
        thirdLastWeek = this.state.thirdLastWeek;
        return (
            <Container>
                <div className="content__header content__header--with-line">
                    <h3 className="title">{trls('EnterHours')}</h3>
                </div>
                <div className="orders">
                    <div className="orders__filters justify-content-between">
                        <Row>
                            <Col sm={6}>
                                <Form>
                                    <Form.Check type="checkbox" name="Direct" label={trls('Show_weeks_submitted')} style={{fontSize:"14px"}}  onChange={this.onChangeLink} />
                                </Form>
                            </Col>
                            <Col sm={4} >
                                <Form.Label>
                                    {trls('Staff_members')}   
                                </Form.Label>
                                {this.state.defaultUserData&&(
                                    <Select
                                        name="artikel"
                                        options={this.state.userData}
                                        placeholder={trls('Select')}
                                        onChange={val => this.setState({val1:val})}
                                        defaultValue={this.state.defaultUserData}
                                    />
                                )}
                                
                            </Col>
                            <Col sm={2} className="borderedDiv">
                                <span className="spanColor spanBlue"></span> - Opgeslagen<br/>
                                <span className="spanColor spanRed"></span> - Afgekeurd<br/>
                                <span className="spanColor spanOrange"></span> - Ingediend<br/>
                                <span className="spanColor spanGreen"></span> - Goedgekeurd<br/>
                            </Col>
                        </Row>
                        <div className="page-table table-responsive">
                            <table id="setting_table" width="100%">
                                <thead>
                                    <tr>
                                        {currentWeek.length===7&&(
                                            <th style={{width: 44, padding: 5}} rowSpan="2">{this.getNumberOfWeek(currentWeek.length>0?currentWeek[0].date:'')}</th>
                                        )}
                                        {currentWeek && currentWeek.length===7&&(
                                            currentWeek.map((data,i) =>(
                                                <th className="enter-hour-th" key={i}>{data.date}</th>
                                            ))
                                        )}
                                    </tr>
                                    <tr>
                                        {currentWeek && currentWeek.length===7&&(
                                            currentWeek.map((data,i) =>(
                                                <th className="enter-hour-th" key={i}>{data.value}</th>
                                            ))
                                        )}
                                    </tr>
                                    <tr>
                                        {lastWeek.length===7&&(
                                            <th style={{width: 44, padding: 5}} rowSpan="2">{this.getNumberOfWeek(lastWeek.length>0?lastWeek[0].date:'')}</th>
                                        )}
                                        {lastWeek && lastWeek.length===7&&(
                                            lastWeek.map((data,i) =>(
                                                <th className="enter-hour-th" key={i}>{data.date}</th>
                                            ))
                                        )}
                                    </tr>
                                    <tr>
                                        {lastWeek && lastWeek.length===7&&(
                                            lastWeek.map((data,i) =>(
                                                <th className="enter-hour-th" key={i}>{data.value}</th>
                                            ))
                                        )}
                                    </tr>
                                    <tr>
                                        {secondLastWeek.length===7&&(
                                            <th style={{width: 44, padding: 5}} rowSpan="2">{this.getNumberOfWeek(secondLastWeek.length>0?secondLastWeek[0].date:'')}</th>
                                        )} 
                                        {secondLastWeek && secondLastWeek.length===7&&(
                                            secondLastWeek.map((data,i) =>(
                                                <th className="enter-hour-th" key={i}>{data.date}</th>
                                            ))
                                        )}
                                    </tr>
                                    <tr>
                                        {secondLastWeek && secondLastWeek.length===7&&(
                                            secondLastWeek.map((data,i) =>(
                                                <th className="enter-hour-th" key={i}>{data.value}</th>
                                            ))
                                        )}
                                    </tr>
                                    <tr>
                                        {thirdLastWeek.length===7&&(
                                            <th style={{width: 44, padding: 5}} rowSpan="2">{this.getNumberOfWeek(thirdLastWeek.length>0?thirdLastWeek[0].date:'')}</th>
                                        )} 
                                        {thirdLastWeek && thirdLastWeek.length===7&&(
                                            thirdLastWeek.map((data,i) =>(
                                                <th className="enter-hour-th" key={i}>{data.date}</th>
                                            ))
                                        )}
                                    </tr>
                                    <tr>
                                        {thirdLastWeek && thirdLastWeek.length===7&&(
                                            thirdLastWeek.map((data,i) =>(
                                                <th className="enter-hour-th" key={i}>{data.value}</th>
                                            ))
                                        )}
                                    </tr>
                                </thead>
                            </table>
                        { this.state.loading&&currentWeek.length!==7&& (
                            <div className="col-md-4 offset-md-4 col-xs-12 loading" style={{textAlign:"center"}}>
                                <BallBeat
                                    color={'#222A42'}
                                    loading={this.state.loading}
                                />
                            </div>
                        )}
                        </div>  
                        <Row style={{padding:19, justifyContent: "space-between"}}>
                            <Col sm={2}>
                                {trls("Date")}
                                <DatePicker name="invoicedate" className="myDatePicker" selected={this.state.workdate} onChange={date =>this.setState({outServiceDate:date})} /> 
                            </Col>
                            <Col sm={3}>
                                {trls("Project")}
                                <Select
                                    name="artikel"
                                    // className="select-lang-class"
                                    options={this.state.userData}
                                    placeholder={trls('Select')}
                                    onChange={val => this.setState({val1:val})}
                                    defaultValue={this.state.defaultUserData}
                                />
                            </Col>
                            <Col sm={2}>
                                {trls("Activity")}
                                <Select
                                    name="artikel"
                                    // className="select-work-hour"
                                    options={this.state.userData}
                                    placeholder={trls('Select')}
                                    onChange={val => this.setState({val1:val})}
                                    defaultValue={this.state.defaultUserData}
                                />
                            </Col>
                            <Col sm={2}>
                                {trls('AmountHours')}
                                <Form.Control type="text" name="fisrtname" required placeholder={trls('AmountHours')}/>
                            </Col>
                            <Col sm={3}>
                                {trls("Note")}
                                <Form.Control type="text" name="fisrtname" required placeholder={trls("Note")}/>
                            </Col>
                        </Row>  
                    </div>
                </div>
            </Container>
        )
        };
  }
    
  export default connect(mapStateToProps, mapDispatchToProps)(Enterhourmanage);
