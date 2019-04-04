import React from 'react'

class PackageItem extends React.Component{
    render(){
        let packageData = this.props.packageData;

        return(
        <li key={this.props.key} className="animated fadeInDown text-left pl-5" >
           {/*  {packageData.name}, */}<b>{packageData.name}</b>, {packageData.period} ,{packageData.price}zł 
           <i className="fas fa-trash text-danger" onClick={this.props.deletePackage.bind(null)}></i>
             
         </li>
         );
    }
}

export default PackageItem;