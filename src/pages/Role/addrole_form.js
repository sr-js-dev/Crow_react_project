import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { connect } from 'react-redux';
// import * as Auth from '../../components/auth'
// import DatePicker from "react-datepicker";
// import DateTimePicker from "react-datetime-picker";
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { trls } from '../../components/translate';
import * as authAction  from '../../actions/authAction';
import ListErrors from '../../components/listerrors';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    blankdispatch: () =>
              dispatch(authAction.blankdispatch()),
    postUserError: (params) =>
        dispatch(authAction.dataServerFail(params)),
});
class Addroleform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidMount() {
        this.props.blankdispatch();
    }

    handleSubmit = (event) => {
        this._isMounted = true;
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        var params = {
            Kostprijs: this.state.Kostprijs,
            Prijs: this.state.Prijs,
            Omschrijving: data.description,
            Uursoort: data.hourtype,
            dekkingsartikel: data.article
        }
        Axios.post(API.PostRol, params, headers)
        .then(result => {
            this.props.onHide();
            this.props.onGetRoleData();    
        })
        .catch(err => {
        });
    }

    onHide = () => {
        this.props.onHide()
        this.props.blankdispatch();
        this.setState({val1: ''})
        this.setState({val2: ''})
    }

    changeHourType = (val) => {
        let hourTypeArray = this.props.hourTypeData;
        hourTypeArray.map((data, index)=>{
            if(data.key===val.value){
                this.setState({Kostprijs: data.KOSTPRIJS})
                this.setState({Prijs: data.PRIJS})
            }
            return hourTypeArray;
        });
        this.setState({val1:val})
    }

    changeArticle = (val) => {
        this.setState({val2: val})
    }
    
    render(){
        let hourType = [];
        let articleData = [];
        if(this.props.hourTypeData){
            hourType = this.props.hourTypeData.map( s => ({value:s.key,label:s.value}) );
        }
        if(this.props.articleData){
            articleData = this.props.articleData.map( s => ({value:s.key,label:s.value}) );
        }
        return (
            <Modal
                show={this.props.show}
                onHide={this.onHide}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {trls('New_role')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="email" style={{paddingBottom:20}}>
                        <Form.Label column sm="3">
                        {trls('Description')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="text" name="description" className="input-text" required placeholder={trls('Description')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="password">
                        <Form.Label column sm="3">
                        {trls('HourType')}   
                        </Form.Label>
                        <Col sm="9" className="product-text" style={{height:"auto"}}>
                            <Select
                                name="hourtype"
                                options={hourType}
                                // value={{"value":roledata,"label": roledata}}
                                placeholder={trls('Select')}
                                onChange={val => this.changeHourType(val)}
                            />
                            {!this.props.disabled && (
                                <input
                                    onChange={val=>console.log()}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity:0, height: 0, marginTop:"-10px", width: "100%"}}
                                    value={this.state.val1}
                                    required
                                />
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="confirmpassword">
                        <Form.Label column sm="3">
                            {trls('CoverArticle')}   
                        </Form.Label>
                        <Col sm="9" className="product-text" style={{height:"auto"}}>
                            <Select
                                name="article"
                                options={articleData}
                                // value={{"value":roledata,"label": roledata}}
                                placeholder={trls('Select')}
                                onChange={val => this.changeArticle(val)}
                            />
                            {!this.props.disabled && (
                                <input
                                    onChange={val=>console.log()}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity:0, height: 0, marginTop:"-10px", width: "100%"}}
                                    value={this.state.val2}
                                    required
                                />
                            )}
                        </Col>
                    </Form.Group>
                    <ListErrors errors={this.props.error}/>
                    <Form.Group style={{textAlign:"center"}}>
                        <Button type="submit" variant="success"><i className="fas fa-save" style={{paddingRight:5}}></i>{trls('Save')}</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Addroleform);