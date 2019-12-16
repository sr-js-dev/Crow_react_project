import React, {Component} from 'react'
import * as authAction  from '../actions/authAction';
import { NavDropdown, Navbar, Nav, Container, Image } from 'react-bootstrap';
import { connect } from 'react-redux';
import history from '../history';
import { removeAuth } from '../components/auth';
import { trls } from '../components/translate';
import * as Auth from './auth'

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

    goRoute = (val) => {
        history.push('/'+val)
    }

    render () {
      return (
        <Navbar bg="light" className="navbar-header" expand="md">
            <Container>
                <Navbar.Brand href="#home"><Image src={require("../assets/images/CROW-hoofdlogo.png")} height={30}/></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {window.location.pathname!=='/login' && window.location.pathname!=='/reset-password-email' && window.location.pathname!=='/reset-password/'?(
                        <Nav className="mr-auto">
                            <Nav.Link href="#home">{trls('Dashboard')}</Nav.Link>
                            <Nav.Link href="#link">{trls('Projects')}</Nav.Link>
                            <Nav.Link href="#link2">{trls('Taken')}</Nav.Link>
                            <NavDropdown title={trls('Hours')} id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">{trls('Hours_off')}</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">{trls('Enter_hours')}</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">{trls('Approve_hours')}</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title={trls('Management')} id="basic-nav-dropdown" className="magage-nav">
                                <NavDropdown.Item onSelect={() => this.goRoute('users')}>{trls('Users')}</NavDropdown.Item>
                                <NavDropdown.Item onSelect={() => this.goRoute('role')}>{trls('Role')}</NavDropdown.Item>
                                <NavDropdown.Item onSelect={() => this.goRoute('purchase')}>{trls('Purchase')}</NavDropdown.Item>
                                <NavDropdown.Item onSelect={() => this.goRoute('exploitation')}>{trls('Exploitation')}</NavDropdown.Item>
                                <NavDropdown.Item onSelect={() => this.goRoute('coverage')}>{trls('Coverage')}</NavDropdown.Item>
                                <NavDropdown.Item onSelect={() => this.goRoute('member')}>{trls('Staff_members')}</NavDropdown.Item>
                                <NavDropdown.Item onSelect={() => this.goRoute('activities')}>{trls('Activities')}</NavDropdown.Item>
                                <NavDropdown.Item onSelect={() => this.goRoute('zeno')}>{trls('Zeno')}</NavDropdown.Item>
                                <NavDropdown.Item onSelect={() => this.goRoute('audit')}>{trls('Audit')}</NavDropdown.Item>
                                <NavDropdown.Item onSelect={() => this.goRoute('consistency')}>{trls('Consistency_control')}</NavDropdown.Item>
                                <NavDropdown.Item onSelect={() => this.goRoute('settings')}>{trls('Settings')}</NavDropdown.Item>
                                <NavDropdown.Item onSelect={() => this.goRoute('tag')}>{trls('Tags')}</NavDropdown.Item>
                                <NavDropdown.Item onSelect={() => this.goRoute('tag-group')}>{trls('Tag_groups')}</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.13">{trls('Documents')}</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title={Auth.getUserName()} id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1"><i className="fas fa-user icon-padding"></i>{trls('Role')} : Administrator</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.2"><i className="fas fa-user icon-padding"></i>{trls('Profile')}</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onSelect={() => this.goRoute('changepassword')}><i className="fas fa-key icon-padding"></i>Change password</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onSelect={() => this.logOut()}><i className="fas fa-key icon-padding"></i>LogOut</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    ):<Nav className="mr-auto">
                        <Nav.Link onClick={() => this.goRoute('login')} className="login-nav-link">{trls('Login')}</Nav.Link>
                    </Nav>}
                </Navbar.Collapse>
            </Container>
        </Navbar>
      )
    };
  }
  export default connect(mapStateToProps, mapDispatchToProps)(Header);
