import React, {Component} from 'react'
import { Modal, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { trls } from '../../components/translate';
import * as authAction  from '../../actions/authAction';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
    postUserError: (params) =>
        dispatch(authAction.dataServerFail(params)),
});

class Enterhourform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidMount() {
        this.props.blankdispatch();
    }

    componentDidUpdate(prevProps) {
        if (this.props.show && (prevProps.day !== this.props.day || prevProps.date !== this.props.date)) {
            this.getTableData();
        }
      }

    changeFormat = (date) => {
        const array = date.split('-');
        return array[2] + '-' + array[1] + '-' + array[0];
    }

    getTableData = () => {
        this._isMounted = true;
        this.setState({loading:true});
        const val = this.props.day ? this.changeFormat(this.props.date.substr(3)) : this.props.date;
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetUrenByEmployeeDate + "MedewerkerId=" + this.props.employeeId + '&Datum=' + val, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({loading:false, data: result.data.Items});
                $('#user_table').dataTable().fnDestroy();
                $('#user_table').DataTable(
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
            }
        });
    }

    onHide = () => {
        this.props.onHide()
    }
    
    render(){
        const { data } = this.state;
        console.log(data)
        return (
            <Modal
                dialogClassName="custom-dialog"
                show={this.props.show}
                onHide={this.onHide}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                centered
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                <div className="table-responsive">
                    <table id="user_table" style={{fontSize: 12}} className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th style={{width:"10%"}}>{trls('Staff_members')}</th>
                                <th style={{width:"20%"}}>{trls('Project')}</th>
                                <th style={{width:"5%"}}>{trls('AmountHours')}</th>
                                <th style={{width:"5%"}}>{trls('Status')}</th>
                                <th style={{width:"5%"}}>{trls('Note')}</th>
                                <th style={{width:"5%"}}>{trls('Role')}</th>
                                <th style={{width:"15%"}}>{trls('Phase')}</th>
                            </tr>
                        </thead>
                        {data && !this.state.loading &&(<tbody >
                            {
                                data.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td>{data.Medewerker}</td>
                                        <td>{data.Project}</td>
                                        <td>{data["Aantal uren"]}</td>
                                        <td>{data.Status}</td>
                                        <td>{data.Opmerking}</td>
                                        <td>{data.RolId}</td>
                                        <td>{data.FaseId}</td>
                                    </tr>
                                ))
                                }
                            </tbody>)}
                        </table>
                        <br />
                        <br />
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Enterhourform);