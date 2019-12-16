import React, {Component} from 'react'
import { Container, Form } from 'react-bootstrap';
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

class Zenomanage extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            loading: true,
            zenoData: [],
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

    getNietGekoppeldeZeno () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetNietGekoppeldeZenoArtikelen, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({zenoData:result.data.Items})
                this.setState({loading:false})
                $('#zeno_table').dataTable().fnDestroy();
                $('#zeno_table').DataTable(
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

    getGekoppeldeZeno () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetGekoppeldeZenoArtikelen, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({zenoData:result.data.Items})
                this.setState({loading:false})
                if(!this.state.dataFlag){
                    $('#zeno_table thead tr').clone(true).appendTo( '#zeno_table thead' );
                    $('#zeno_table thead tr:eq(1) th').each( function (i) {
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
                }
                $('#zeno_table').dataTable().fnDestroy();
                var table = $('#zeno_table').DataTable(
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

    onChangeLink = (event) => {
        this.setState({dataFlag: true})
        if(event.target.checked){
            this.getNietGekoppeldeZeno();
        }else{
            this.getGekoppeldeZeno();
        }
    }

    render () {
        let zenoData = this.state.zenoData;
        return (
            <Container>
                <div className="content__header content__header--with-line">
                    <h3 className="title">{trls('Zeno')}</h3>
                </div>
                <div className="orders">
                    <div className="orders__filters justify-content-between">
                        <Form>
                            <Form.Check type="checkbox" name="Direct" label={trls('Unlinked_articles')} style={{fontSize:"14px"}}  onChange={this.onChangeLink} />
                        </Form>
                        <div className="page-table table-responsive">
                            <table id="zeno_table" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                            <thead>
                                <tr>
                                    <th>{trls('Exploitation')}</th>
                                    <th>{trls('ArticleGroup')}</th>
                                    <th>{trls('ZenoArticle')}</th>
                                </tr>
                            </thead>
                            {zenoData && !this.state.loading &&(<tbody >
                                {
                                    zenoData.map((data,i) =>(
                                        <tr id={i} key={i}>
                                            <td>{data.Exploitatie}</td>
                                            <td>{data.artikelGroep}</td>
                                            <td>{data.ZenoArtikel}</td>
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
    
  export default connect(mapStateToProps, mapDispatchToProps)(Zenomanage);
