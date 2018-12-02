import React from 'react'

class NewGym extends React.Component{
    constructor(){
        super();

        this.state = {
            offers:[],
            packages:[],
            photos:[],
            currentForm: 'primaryData'
        }
    }

  handleSubmit=()=>{

  }

  handleOfferSubmit=(e)=>{
      e.preventDefault();
      var offers = this.state.offers;

      offers.push({
          name: e.target.offerName.value,
          description: e.target.offerDescription.value
      });
      this.setState({
          offers 
      })
      console.log("Utworzyłem nową ofertę: ",offers);
      e.target.offerName.value = ''
      e.target.offerDescription.value = ''
      e.target.classList.remove("show");
      document.querySelector('.showOfferForm').classList.remove('invisible');
  }

  showOfferForm=(e)=>{
      var form = document.querySelector(".offerForm");
    //   form.classList.remove("show");
    e.target.classList.add('invisible');

  }

  deleteOffer=(i)=>{
    var offers = this.state.offers;

    offers = offers.filter( (o,index)=> (i!=index) );
    this.setState({
        offers
    });
  }
  render(){

    var currentOffers = ''
    currentOffers = this.state.offers.map( (o,index) =>
    ( <li key={index} > {o.name},{o.description} <div className="btn btn-danger deleteOffer" onClick={this.deleteOffer.bind(null,index)}>Usuń</div> </li> ));

      return(
          <div>
              {/* <form className="newGymForm" onSubmit={this.handleSubmit}>
                    <legend>Dodaj nową siłownię</legend>
                    <hr/>

                    <div className="form-group">
                        <label htmlFor="name">Nazwa</label>
                        <input type="text" name="name" className="form-control" autoComplete="off"/>

                        <label htmlFor="city">Miasto</label>
                        <input type="text" name="city" className="form-control"/>

                        <label htmlFor="street">Ulica</label>
                        <input type="text" name="street" className="form-control"/>

                        <label htmlFor="post_code">Kod pocztowy</label>
                        <input type="text" name="post_code" className="form-control"/>

                        <label htmlFor="phone_number">Telefon komórkowy</label>
                        <input type="text" name="phone_number" className="form-control"/>

                        <label htmlFor="landline_phone">Telefon stacjonarny</label>
                        <input type="text" name="landline_number" className="form-control"/>
 
                        <label htmlFor="mail">E-mail</label>
                        <input type="text" name="mail" className="form-control"/>

                        <label htmlFor="description">Opis</label>
                        <textarea className="form-control" name="description" id="" cols="30" rows="10"></textarea>

                
                    </div>
              </form> */}
                <div className="formTitle">

                <h3>Oferta</h3>
                            Wymień oferty jakie są dostępne w Twojej siłowni,
                        <hr/></div>

                 <div className="formTitle">
                 <h4>Dodane oferty:</h4>
                        <ul>
                            {currentOffers}
                        </ul>
                 </div>
                <div className="formTitle addOffer">
                <i className="fas fa-plus-circle showOfferForm" onClick={this.showOfferForm} data-toggle="collapse" data-target="#offerForm"></i>
                </div>

                  <form id="offerForm" className="newGymForm offerForm collapse" onSubmit={this.handleOfferSubmit}>
            

            <label htmlFor="offerName">Nazwa oferty</label>
            <input  name="offerName" type="text" className="form-control"/>

            <label htmlFor="offerDescription">Opis oferty</label>
            <textarea name="offerDescription" id="" cols="30" rows="5" className="form-control"></textarea>
            <br/>
           
            <button className="btn btn-primary" >Dodaj oferte</button>
            <br/> <br/>
        
  </form>

   <div className="formTitle">

<h3>Cennik</h3>
            Dodaj pakiety jakie Twoja siłownia oferuje
        <hr/></div>

         
          </div>
      );
  }
}

export default NewGym