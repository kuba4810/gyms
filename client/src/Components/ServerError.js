import React, { Component } from 'react';

const styles={
  root:{
    textAlign:'center'
  },
  alert:{
    fontSize:80,
    fontWeight: 'bold',
    color:'#e9ab2d'
  }
};

class ServerError extends Component {
  render() {
    return (
      <div style={styles.root}>
        <div style={styles.alert}>&#9888;</div> {{/* &#9888; to encja HTML reprezentująca znak ostrzeżenia ⚠ */}}
        <h1>Ups, mamy problem.</h1>
        <p>Brak dostępu do repozytoriów. Spróbuj ponownie za kilka minut.</p>
      </div>
    );
  }
}

export default ServerError;
