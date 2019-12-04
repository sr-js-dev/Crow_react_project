import React, {Component} from 'react'
import * as authAction  from '../actions/authAction';
import {Container } from 'react-bootstrap';
import { connect } from 'react-redux';

const mapStateToProps = state => ({ 
    ...state.auth,
});
const mapDispatchToProps = (dispatch) => ({

});
class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {  
        };
    }
    render () {
      return (
          <Container>
            <footer className="footer">
              <p>
                <span>© {new Date().getFullYear()} - PID</span>
                <span className="pull-right">
                    Version 1.20180305.0
                    <label className="label" style={{backgroundColor: "rgb(0, 128, 0)", display: "block", textAlign:"center", borderRadius:4}}>
                        MASTER
                    </label>
                </span>
              </p>
            </footer>
          </Container>
      )
    };
  }
  export default connect(mapStateToProps, mapDispatchToProps)(Footer);

