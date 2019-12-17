import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as Auth from '../../components/auth'
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
class Updaterolerateform extends Component {
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
        let updateData = this.props.roleRateEditData;
        this._isMounted = true;
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        var params = {
            id: String(updateData.id),
            functieid: String(updateData.functieid),
            kostprijs: data.pricecost,
            prijs: data.coverage,
            dekking: data.pricecost,
            boekjaar: data.financialyear,
            aangepast: String(updateData.aangepast),
            rolid: this.props.roleId,
            username: Auth.getUserName()
        }
        Axios.post(API.PutFunctietarief, params, headers)
        .then(result => {
            this.props.onHide();
            this.props.onSetLoading();
            this.props.onGetRoleRateData();
        })
        .catch(err => {
        });
    }

    onHide = () => {
        this.props.onHide()
        this.props.blankdispatch();
    }
    
    render(){
        let updateData = [];
        if(this.props.roleRateEditData){
            updateData = this.props.roleRateEditData;
        }
        return (
            <Modal
                show={this.props.show}
                onHide={this.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {trls('Edit_rate')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('PriceCost')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="number" name="pricecost" className="input-text" defaultValue={updateData.kostprijs} required placeholder={trls('PriceCost')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('Price')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="number" name="price" className="input-text" defaultValue={updateData.prijs} required placeholder={trls('Price')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('Coverage')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="number" name="coverage" className="input-text" defaultValue={updateData.dekking} required placeholder={trls('Coverage')} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="email">
                        <Form.Label column sm="3">
                        {trls('FinancialYear')}   
                        </Form.Label>
                        <Col sm="9" className="product-text input-div">
                            <Form.Control type="number" name="financialyear" className="input-text" defaultValue={updateData.boekjaar} required placeholder={trls('FinancialYear')} />
                        </Col>
                    </Form.Group>
                    <Form.Group style={{textAlign:"center"}}>
                        <Button type="submit" variant="success"><i className="fas fa-save" style={{paddingRight:5}}></i>{trls('Save')}</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Updaterolerateform);