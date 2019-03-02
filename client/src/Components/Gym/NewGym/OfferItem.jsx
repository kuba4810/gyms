import React from 'react'

class OfferItem extends React.Component{
    render(){
        let offerData = this.props.offerData;
        return(
            <li key={this.props.key} className="animated fadeInDown" >
                {offerData.name} {/* ,{offerData.description} */}
                <div className="btn btn-danger deleteOffer" onClick={this.props.deleteOffer.bind(null)}>Usuń</div>
                
            </li>
        );
    }
}

export default OfferItem;