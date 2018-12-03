import React from 'react'

class NewGym extends React.Component {
    constructor() {
        super();

        this.state = {
            offers: [],
            packages: [],
            photos: [],
            currentForm: 'primaryData'
        }
    }

    handleSubmit = () => {
        var data={}
        const primaryForm = document.querySelector('.primaryData');
        const hours = document.querySelector('.openingHoursForm');

        

        var primaryData ={
            gym_name: primaryForm.name.value,
            city: primaryForm.city.value,
            street : primaryForm.street.value,
            post_code: primaryForm.post_code.value,
            phone_number: primaryForm.phone_number.value,
            landline_number : primaryForm.landline_number.value,
            email: primaryForm.mail.value,
            description: primaryForm.description.value,
            mon: `${hours.monO.value}-${hours.monC.value}`,
            tue: `${hours.tueO.value}-${hours.tueC.value}`,
            wed: `${hours.wedO.value}-${hours.wedC.value}`,
            thu: `${hours.thuO.value}-${hours.thuC.value}`,
            fri: `${hours.friO.value}-${hours.friC.value}`,
            sat: `${hours.satO.value}-${hours.satC.value}`,
            sun: `${hours.sunO.value}-${hours.sunC.value}`
            
        }

        var offers = this.state.offers;
        var packages = this.state.packages;

        data = Object.assign({},data,primaryData,{offers:[...offers]},{packages:[...packages]});

        console.log(data);

        fetch('http://localhost:8080/api/gym', {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin", //
         
            body: JSON.stringify(data), // body data type must match "Content-Type" header
            headers: {
                "Content-Type": "application/json"
            }
            }).then(res =>res.json())
                .then(res=>{
                    console.log(res);
                });

    }

    handleOfferSubmit = (e) => {
        e.preventDefault();
        var offers = this.state.offers;

        offers.push({
            name: e.target.offerName.value,
            description: e.target.offerDescription.value
        });
        this.setState({
            offers
        })
        console.log("Utworzyłem nową ofertę: ", offers);
        e.target.offerName.value = ''
        e.target.offerDescription.value = ''
        e.target.classList.remove("show");
        document.querySelector('.showOfferForm').classList.remove('invisible');
    }

    showOfferForm = (e) => {
        var form = document.querySelector(".offerForm");
        //   form.classList.remove("show");
        e.target.classList.add('invisible');

    }
    showPackageForm=(e)=>{
        e.target.classList.add('invisible');
    }

    deleteOffer = (i) => {
        var offers = this.state.offers;

        offers = offers.filter((o, index) => (i != index));
        this.setState({
            offers
        });
    }

    handlePackageSubmit = (e) => {
        e.preventDefault();
        var packages = this.state.packages;

        packages.push({
            name: e.target.packageName.value,
            price: e.target.packagePrice.value,
            period: e.target.packagePeriod.value
        });
        this.setState({
            packages
        })

        e.target.packageName.value = ''
        e.target.packagePrice.value = ''
        e.target.packagePeriod.value = ''

        e.target.classList.remove("show");
        document.querySelector('.showPackageForm').classList.remove('invisible');

    }

    deletePackage=(i) => {
        var packages = this.state.packages;

        packages = packages.filter((p, index) => (i != index));
        this.setState({
            packages
        });
    }
    render() {

        var currentOffers = ''
        var currentPackages = ''

        // Utworzenie listy dodanych ofert
        currentOffers = this.state.offers.map((o, index) =>
            (<li key={index} className="animated fadeInDown" >
                {o.name},{o.description}
                <div className="btn btn-danger deleteOffer" onClick={this.deleteOffer.bind(null, index)}>Usuń</div>
                <div className="btn btn-warning editOffer">Edytuj</div>
            </li>));

        currentPackages = this.state.packages.map((p, index) =>
            (<li key={index} className="animated fadeInDown" >
                {p.name}, {p.price}zł , {p.period}
                <div className="btn btn-danger deleteOffer" onClick={this.deletePackage.bind(null, index)}>Usuń</div>
                <div className="btn btn-warning editOffer">Edytuj</div>
            </li>));

        return (
            <div>
                <form className="newGymForm primaryData" onSubmit={this.handleSubmit}>
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
              </form>
                 <div className="formTitle">
                     <h3>Harmonogram</h3>
                     Dodaj godziny otwarcia Twojej siłowni
                     <hr />
                 </div>

                 <form className="openingHoursForm newGymForm">

                        <div className="form-group">
                            <label>Pon</label>
                            <input type="time" name="monO" className="form-control"/>
                            <input type="time" name="monC" className="form-control"/>
                        </div>

                        <div className="form-group">
                             <label>Wt</label>
                            <input type="time" name="tueO" className="form-control"/>
                            <input type="time" name="tueC" className="form-control"/>
                        </div>

                        <div className="form-group">
                             <label htmlFor="">Śr</label>
                            <input type="time" name="wedO" className="form-control"/>
                            <input type="time" name="wedC" className="form-control"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="">Czw</label>
                           <input type="time" name="thuO" className="form-control"/>
                           <input type="time" name="thuC" className="form-control"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="">Pt</label>
                           <input type="time" name="friO" className="form-control"/>
                           <input type="time" name="friC" className="form-control"/>
                        </div>

                        <div className="form-group">
                        <label htmlFor="">Sob</label>
                           <input type="time" name="satO" className="form-control"/>
                           <input type="time" name="satC" className="form-control"/>
                         </div>

                        <div className="form-group">
                           <label htmlFor="">Nd</label>
                           <input type="time" name="sunO" className="form-control"/>
                           <input type="time" name="sunC"className="form-control"/>
                        </div>

                           
                        
                 </form>

                 <div className="formTitle">
                     <h3>Oferta</h3>
                     Dodaj oferty jakie są dostępne w Twojej siłowni (Siłownia,Basen,Sauna...)
                     <hr />
                 </div>

                <div className="formTitle">
                    {/* <h4>Dodane oferty:</h4> */}
                    <ul className="list-group">
                        {currentOffers}
                    </ul>
                </div>
                <div className="formTitle addOffer">
                    <i className="fas fa-plus-circle showOfferForm" onClick={this.showOfferForm} data-toggle="collapse" data-target="#offerForm"></i>
                </div>

                <form id="offerForm" className="newGymForm offerForm collapse" onSubmit={this.handleOfferSubmit}>


                    <label htmlFor="offerName">Nazwa oferty</label>
                    <input name="offerName" type="text" className="form-control" />

                    <label htmlFor="offerDescription">Opis oferty</label>
                    <textarea name="offerDescription" id="" cols="30" rows="5" className="form-control"></textarea>
                    <br />

                    <button className="btn btn-primary" >Dodaj oferte</button>
                    <br /> <br />

                </form>

                <div className="formTitle">

                    <h3>Cennik</h3>
                    Dodaj pakiety jakie Twoja siłownia oferuje. <br />
                    Przykład: 1 wejście, 6zł , 1raz
                     <hr />
                </div>

                {/* ----------------------------------------------------------------------------------------- */}
                {/* -----------------------------------------PAKIETY----------------------------------------- */}
                {/* ----------------------------------------------------------------------------------------- */}

                <div className="formTitle">
                    {/* <h4>Dodane pakiety:</h4> */}
                    <ul className="list-group">
                        {currentPackages}
                    </ul>
                </div>

                <div className="formTitle addPackages">
                    <i className="fas fa-plus-circle showPackageForm" onClick={this.showOfferForm} data-toggle="collapse" data-target="#packageForm"></i>
                </div>

                <form id="packageForm" className=" newGymForm packageForm collapse" onSubmit={this.handlePackageSubmit}>


                    <label htmlFor="packageName">Nazwa pakietu</label>
                    <input name="packageName" type="text" className="form-control" />

                    <label htmlFor="packagePrice">Cena pakietu(zł)</label>
                    <input type="number" className="form-control" name="packagePrice" />

                    <label htmlFor="packagePeriod">Okres/Liczebność</label>
                    <input type="text" className="form-control" name="packagePeriod" />

                    <br />
                    <button className="btn btn-primary" >Dodaj oferte</button>
                    <br /> <br />

                </form>

                {/* Pobieranie zdjęć */}
                {/* ----------------------------------------------------------------------------------------- */}
                {/* <form className="newGymForm photoForm">
                    <label htmlFor="photo">Dodaj zdjęcie</label>
                    <input type="file" name="photo"  accept="image/png, image/jpeg" multiple="true" className="form-control"/>
                </form> */}



                <div className="formTitle">
                   <div className="btn btn-success sendForm" onClick={this.handleSubmit}>Wyślij formularz</div>
                </div>
            </div >
        );
    }
}

export default NewGym