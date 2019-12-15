import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
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

class Activityform extends Component {
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
        let params = [];
        let url = '';
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        if(!this.props.updateFlag){
            params = {
                omschrijving: data.omschrijving
            }
            url = API.PostActiviteit
        }else{
            params = {
                omschrijving: data.omschrijving,
                id: this.props.updateActivityData.key
            }
            url = API.PutActiviteit
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(url, params, headers)
        .then(result => {
            this.props.onHide();
            this.props.onGetActivityData();
        })
        .catch(err => {
        });
    }

    onHide = () => {
        this.props.onHide()
    }
    
    render(){
        let updateData=this.props.updateActivityData;
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
                    {trls('New_activity')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('Description')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="text" name="omschrijving" className="input-text" defaultValue={updateData.value} required placeholder={trls('Description')} />
                        </Col>
                    </Form.Group>
                    <Form.Group style={{textAlign:"center"}}>
                        <Button type="submit" variant="success" style={{width:"100px"}}><i className="fas fa-save" style={{paddingRight:5}}></i>{trls('Save')}</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Activityform);