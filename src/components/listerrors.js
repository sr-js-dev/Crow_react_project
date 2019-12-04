import React from 'react';

class ListErrors extends React.Component {
  
  render() {
    const errors = this.props.errors;
    if (errors) {
      return (
        <div className="alert alert-danger" style={{marginTop:10}}>
            <strong>{errors}</strong>
        </div>
      );
    } else {
      return null;
    }
  }
}
export default ListErrors;
