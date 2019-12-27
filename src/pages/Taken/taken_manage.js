import React, {Component} from 'react'
import { Container, Form, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import SessionManager from '../../components/session_manage';
import $ from 'jquery';
import API from '../../components/api'
import Axios from 'axios';
import { trls } from '../../components/translate';
import 'datatables.net';
import * as authAction  from '../../actions/authAction';
import Select from 'react-select';
import { BallBeat } from 'react-pure-loaders';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
});

class Takenmanage extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            data: [],
            defaultData: [],
            staffs: [{value: 'All', label: 'All'}],
            tasks : [
                {
                    value: 'Niet ingediende projecten',
                    label: 'Niet ingediende projecten',
                    function: 'getTakenNietIngediendeProjecten'
                }, {
                    label: 'Afgekeurde projecten',
                    value: 'Afgekeurde projecten',
                    function: 'getTakenAfgekeurdeProjecten'
                }, {
                    label: 'Goedkeuren projecten',
                    value: 'Goedkeuren projecten',
                    function: 'getTakenGoedkeurenProjecten'
                }, {
                    label: 'Niet ingediende uren',
                    value: 'Niet ingediende uren',
                    function: 'getTakenNietIngediendeUren'
                }
            ],
            task: {
                value: 'Niet ingediende projecten',
                label: 'Niet ingediende projecten',
                function: 'getTakenNietIngediendeProjecten'
            }
        };
    }

    componentDidMount() {
        this._isMounted=true;
        this.getEmployee();
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getData (val, type) {
        const userName = localStorage.getItem('crow_userName');
        this._isMounted = true;
        this.setState({loading:true});
        if (type === 1) this.setState({task: val});
        if (!this.state.staff || !this.state.task) return;
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.BASEURL+this.state.task.function+ '?username=' + userName, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({defaultData: result.data.Items, data: result.data.Items, loading: false});
                $('#task_table').dataTable().fnDestroy();
                $('#task_table').DataTable(
                    {
                        "bPaginate": false,
                        "bFilter": false,
                        "bInfo": false,
                        "language": {
                            "paginate": {
                                "previous": trls('Previous'),
                                "next": trls('Next')
                            }
                        }
                    }
                );
                this.filterTable();
            }
        });
    }

    getEmployee = () => {
        this._isMounted = true;
        this.setState({loading:true});
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetEmployee, headers)
        .then(result => {
            if(this._isMounted){
                const staffs = this.state.staffs;
                const data = result.data.Items.map(item => ({value: item.key, label: item.value}));
                staffs.push(...data);
                this.setState({staffs}, () => {
                    this.getDefaultEmployee();
                });
            }
        });
    }

    getDefaultEmployee = () => {
        const userName = localStorage.getItem('crow_userName');
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetDefaultEmployee + 'username=' + userName, headers)
        .then(result => {
            const employee = result.data.Items[0];
            const findIndex = this.state.staffs.findIndex(item => item.value === employee.id);
            this.setState({loading:false, staff: this.state.staffs[findIndex]});
            if (findIndex > -1) this.getData("", 0);
        });
    }

    setStaff = (val) => {
        this.setState({ staff: val}, () => {
            this.filterTable();
        });
    }

    filterTable = () => {
        const filterData = this.state.staff.value === 'All' ?
            this.state.defaultData:
            this.state.defaultData.filter(item => item.MedewerkerId === this.state.staff.value)
        ;
        this.setState({ data: filterData });
    }

    render () {
        return (
            <Container>
                <div className="content__header content__header--with-line">
                    <h3 className="title">{trls('Taken')}</h3>
                </div>
                <div className="orders">
                    <div className="orders__filters justify-content-between">
                        <Form>
                            <Form.Group as={Row} controlId="email">
                                
                                <Col className="product-text input-div">
                                    <Form.Label>
                                        {trls('Staff_members')}   
                                    </Form.Label>
                                    <Select
                                        name="staff"
                                        options={this.state.staffs}
                                        placeholder={trls('Select')}
                                        value = {this.state.staff}
                                        onChange={val => this.setStaff(val)}
                                    />
                                </Col>
                                <Col className="product-text input-div">
                                    <Form.Label>
                                        {trls('Task')}   
                                    </Form.Label>
                                    <Select
                                        name="task"
                                        options={this.state.tasks}
                                        placeholder={trls('Select')}
                                        value = {this.state.task}
                                        defaultValue = {this.state.tasks[0]}
                                        onChange={val => this.getData(val, 1)}
                                    />
                                </Col>
                            </Form.Group>
                        </Form>
                        {this.state.data && !this.state.loading &&(
                            <div className="page-table table-responsive">
                            <table id="task_table" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                            <thead>
                                <tr>
                                    <th>{trls('Projectcode')}</th>
                                    <th>{trls('Project_name')}</th>
                                    <th>Team</th>
                                    <th>{trls('Made_by')}</th>
                                </tr>
                            </thead>
                            {this.state.data && !this.state.loading &&(<tbody >
                                {
                                    this.state.data.map((data,i) =>(
                                        <tr id={i} key={i}>
                                            <td>{data.Projectcode}</td>
                                            <td>{data.Projectnaam}</td>
                                            <td>{data.Team}</td>
                                            <td>{data['Aangemaakt door']}</td>
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
                        )}
                    </div>
                </div>
            </Container>
        )
        };
  }
    
  export default connect(mapStateToProps, mapDispatchToProps)(Takenmanage);
