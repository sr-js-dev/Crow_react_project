import React, {Component} from 'react'
import * as authAction  from '../actions/authAction';
import { Dropdown, NavDropdown, Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
// import Select from 'react-select';
import { connect } from 'react-redux';
import history from '../history';
import { removeAuth } from '../components/auth';
// import $ from 'jquery';

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
            roles:[{"value":"en_US","label":"En"},{"value":"nl_BE","label":"Nl"}],
            selectrolvalue:window.localStorage.getItem('crow_lang'),
            selectrollabel:window.localStorage.getItem('crow_label'),
        };
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
        // <div>
        //     <header className="header">
        //         <div className="header__burger-btn">
        //             <span></span>
        //             <span></span>
        //             <span></span>
        //         </div>
        //         <a href="/" className="header__logo-mob">
        //             <img src={require("../assets/images/appmakerz.svg")} alt="logo"/>
        //         </a>
        //         <div className="header__controls">
        //             <Dropdown>
        //                 <Dropdown.Toggle variant="success" id="dropdown-basic" style={{color:"#000000"}}>
        //                     Johan Boerema<img src={require("../assets/images/avatar.jpg")} alt="User avatar" className="header__user-dropdown-img"/> 
        //                 </Dropdown.Toggle>
        //                 <Dropdown.Menu style={{marginLeft:15}}>
        //                     <Dropdown.Item onClick={this.logOut}>Logout</Dropdown.Item>
        //                 </Dropdown.Menu>
        //             </Dropdown>
        //         </div>
        //     </header>
        // </div>
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#link">Link</Nav.Link>
                <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown>
                </Nav>
                <Form inline>
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-success">Search</Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
      )
    };
  }
  export default connect(mapStateToProps, mapDispatchToProps)(Header);
