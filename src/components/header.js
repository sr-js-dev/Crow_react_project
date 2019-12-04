import React, {Component} from 'react'
import * as authAction  from '../actions/authAction';
import { NavDropdown, Navbar, Nav, Form, Container, Image } from 'react-bootstrap';
import { connect } from 'react-redux';
import history from '../history';
import { removeAuth } from '../components/auth';
import { trls } from '../components/translate';
import * as Auth from './auth'
import $ from 'jquery';

const mapStateToProps = state => ({ 
    ...state.auth,
});
const mapDispatchToProps = (dispatch) => ({
    changeLan: (params) =>
        dispatch(authAction.changeLan(params)),
});
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {  
        };
    }

    componentDidMount () {
        $('#basic-nav-dropdown').css("display","contents")
    }

    logOut = () => {
        var removeFlag = removeAuth();
        if(removeFlag){
            history.push('/login')
        }
    }
    changeLangauge = (val) => {
        this.setState({selectrolvalue:val.value, selectrollabel: val.label});
        this.props.changeLan(val)
    }
    render () {
      return (
        <Navbar bg="light" className="navbar-header" expand="md">
            <Container>
                <Navbar.Brand href="#home"><Image src={require("../assets/images/appmakerz.svg")} height={30}/></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {window.location.pathname!=='/login'?(
                        <Nav className="mr-auto">
                            <Nav.Link href="#home">{trls('Dashboard')}</Nav.Link>
                            <Nav.Link href="#link">{trls('Projects')}</Nav.Link>
                            <Nav.Link href="#link2">{trls('Taken')}</Nav.Link>
                            <NavDropdown title={trls('Hours')} id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title={trls('Management')} id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    ):<Nav className="mr-auto"></Nav>}
                    <Form className="" inline>
                        {window.location.pathname!=='/login'?(
                            <NavDropdown title={Auth.getUserName()} id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown>
                        ):<Nav.Link href="#deets">{trls('Login')}</Nav.Link>}
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
      )
    };
  }
  export default connect(mapStateToProps, mapDispatchToProps)(Header);
