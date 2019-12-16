import React, {Component} from 'react'
import { Container, Form, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import SessionManager from '../../components/session_manage';
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

class Zenomanage extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            data: [],
            types : [
                {
                    key: 'Kostenuren zonder organisatie',
                    value: 'Kostenuren zonder organisatie',
                    getFunction: 'getInconsistentieKuOrg',
                    count: 0
                },
                {
                    key: 'Kostenuren met niet bestaande fase',
                    value: 'Kostenuren met niet bestaande fase',
                    getFunction: 'getInconsistentieKUNoFase',
                    count: 0
                },
                {
                    key: 'getInconsistentieKUNoFunc',
                    value: 'getInconsistentieKUNoFunc',
                    getFunction: 'getInconsistentieKUNoFunc',
                    count: 0
                },
                {
                    key: 'getInconsistentieKUNoMed',
                    value: 'getInconsistentieKUNoMed',
                    getFunction: 'getInconsistentieKUNoMed',
                    count: 0
                },
                {
                    key: 'getExplOpbrOOP',
                    value: 'getExplOpbrOOP',
                    getFunction: 'getExplOpbrOOP',
                    count: 0
                },
                {
                    key: 'getOpbrUrenNOKstUren',
                    value: 'getOpbrUrenNOKstUren',
                    getFunction: 'getOpbrUrenNOKstUren',
                    count: 0
                }
            ]
        };
    }

    componentDidMount() {
        this._isMounted=true
        let value = {};
        value.value = 'getInconsistentieKuOrg'
        this.getData(value);
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getData (val) {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.BASEURL+val.value, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({data:result.data.Items})
                this.setState({loading:false})
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

    getCount = (val) => {
        let typeArray = this.state.types;
        let value = '';
        typeArray.map((data, index)=>{
            if(data.key===val){
                value = String(data.count);
            }
            return typeArray;
        });
        return value;
    }

    render () {
        let type =  this.state.types;
        let defaluttype = {'value': type[0].getFunction, 'label': type[0].key+'('+this.getCount(type[0].key)+')'};
        let typeOption = [];
        if(this.state.types){
            typeOption = this.state.types.map( s => ({value:s.getFunction,label:s.key+'('+this.getCount(s.key)+')'}) );
        }
        return (
            <Container>
                <div className="content__header content__header--with-line">
                    <h3 className="title">{trls('Consistency_control')}</h3>
                </div>
                <div className="orders">
                    <div className="orders__filters justify-content-between">
                        <Form>
                            <Form.Group as={Row} controlId="email">
                                <Form.Label column sm="3">
                                    {trls('Type')}   
                                </Form.Label>
                                <Col sm="9" className="product-text input-div">
                                    <Select
                                        name="tyle"
                                        options={typeOption}
                                        placeholder={trls('Select')}
                                        onChange={val => this.getData(val)}
                                        defaultValue={defaluttype}
                                    />
                                </Col>
                            </Form.Group>
                        </Form>
                        {this.state.data.length>0 &&(
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
                            {/* {auditData && !this.state.loading &&(<tbody >
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
                            </tbody>)} */}
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
    
  export default connect(mapStateToProps, mapDispatchToProps)(Zenomanage);
