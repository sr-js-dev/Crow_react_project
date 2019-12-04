import React from 'react';

class ListErrors extends React.Component {
  
  render() {
    const errors = this.props.errors;
    if (errors) {
      return (
        <ul className="error-messages" style={{marginTop:"-17px",textAlign:"center"}}>
          {
            errors
            }
        </ul>
      );
    } else {
      return null;
    }
  }
}
export default ListErrors;
