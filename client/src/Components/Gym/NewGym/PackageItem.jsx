import React from 'react'

class PackageItem extends React.Component{
    render(){
        let packageData = this.props.packageData;

        return(
        <li key={this.props.key} className="animated fadeInDown" >
           {/*  {packageData.name}, */} {packageData.period} ,{packageData.price}zł 
            <div className="btn btn-danger deleteOffer" onClick={this.props.deletePackage.bind(null)}>Usuń</div>
             
         </li>
         );
    }
}

export default PackageItem;