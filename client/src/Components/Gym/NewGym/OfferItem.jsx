import React from 'react'

class OfferItem extends React.Component{
    render(){
        let offerData = this.props.offerData;
        return(
            <li key={this.props.key} className="animated fadeInDown text-left pl-5" >
                <b>{offerData.name} </b>{/* ,{offerData.description} */}
                <i className="fas fa-trash text-danger" onClick={this.props.deleteOffer.bind(null)}></i>
                
            </li>
        );
    }
}

export default OfferItem;