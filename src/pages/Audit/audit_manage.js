import React, {Component} from 'react'
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
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

class Auditmanage extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            loading: true,
            auditData: [],
            dataFlag: false
        };
    }

    componentDidMount() {
        this._isMounted=true
        this.getGekoppeldeZeno();
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getGekoppeldeZeno () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetAudit, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({auditData:result.data.Items})
                this.setState({loading:false})
                $('#audit_table thead tr').clone(true).appendTo( '#audit_table thead' );
                $('#audit_table thead tr:eq(1) th').each( function (i) {
                    var title = $(this).text();
                    $(this).html( '<input type="text" class="search-table-input" placeholder="Search '+title+'" />' );
                    $(this).addClass("sort-style");
                    $( 'input', this ).on( 'keyup change', function () {
                        if ( table.column(i).search() !== this.value ) {
                            table
                                .column(i)
                                .search( this.value )
                                .draw();
                        }
                    } );
                } );
                $('#audit_table').dataTable().fnDestroy();
                var table = $('#audit_table').DataTable(
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

    render () {
        let auditData = this.state.auditData;
        return (
            <Container>
                <div className="content__header content__header--with-line">
                    <h3 className="title">{trls('Audit')}</h3>
                </div>
                <div className="orders">
                    <div className="orders__filters justify-content-between">
                        <div className="page-table table-responsive">
                            <table id="audit_table" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                            <thead>
                                <tr>
                                    <th>{trls('Table')}</th>
                                    <th>{trls('Field')}</th>
                                    <th>{trls('OldValue')}</th>
                                    <th>{trls('NewValue')}</th>
                                    <th>{trls('ChangedBy')}</th>
                                    <th style={{width:150}}>{trls('ModifiedOn')}</th>
                                </tr>
                            </thead>
                            {auditData && !this.state.loading &&(<tbody >
                                {
                                    auditData.map((data,i) =>(
                                        <tr id={i} key={i}>
                                            <td>{data.Tabel}</td>
                                            <td>{data.Veld}</td>
                                            <td>{data['Oude waarde']}</td>
                                            <td>{data['Nieuwe waarde']}</td>
                                            <td>{data['Gewijzigd door']}</td>
                                            <td>{data['Gewijzigd op']}</td>
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
    
  export default connect(mapStateToProps, mapDispatchToProps)(Auditmanage);
