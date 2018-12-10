import React from 'react'
import history from '../../../history'
import OfferItem from './OfferItem'
import PackageItem from './PackageItem'
import Spinner from '../../LoadingSpinner'


class NewGym extends React.Component {
    constructor() {
        super();

        this.state = {
            errors :{
                name: '',
                city: '',
                street: '',
                phone_number: '',
                landline_number:'',
                post_code : '',
                mail: '',
                description: ''
            },
            formValid: false,
            name: '',
            city: '',
            street: '',
            post_code: '',
            phone_number: '',
            landline_number: '',
            mail: '',
            description: '',
            monO: '',
            tueO: '',
            wedO: '',
            thuO: '',
            friO: '',
            satO: '',
            sunO: '',
            monC: '',
            tueC: '',
            wedC: '',
            thuC: '',
            friC: '',
            satC: '',
            sunC: '',
            offers: [],
            packages: [],
            photos: [],
            currentForm: 'primaryData',
            gymIsAdding: false
        }
    }

    checkTextLength = (value,isRequired) =>{
        if( value.length === 0 && isRequired){
            return({
                valid : false,
                error: 'To pole jest wymagane !'
            }) 
        }
        else if(value.length > 0 && value.length < 3){
            return({
                valid : false,
                error: 'Minimum 3 znaki !'
            })
        }
        else if(value.length > 50){
            return({
                valid : false,
                error: 'Maksimum 50 znaków !'
            })
        } else{
            return({
                valid : true,
                error: ''
            })
        }
    }

    validate = () =>{
        let errors = this.state.errors;
        let formValid = true;
        let checkTextResponse;
        let pattern;

            // name
            checkTextResponse = this.checkTextLength(this.state.name,true);
            if(!checkTextResponse.valid) {
                formValid = false;
                errors = Object.assign({},errors,{name: checkTextResponse.error});
            }
            else{
                errors = Object.assign({},errors,{name: checkTextResponse.error});
            }

            // city
            checkTextResponse =  this.checkTextLength(this.state.city,true);
            if(!checkTextResponse.valid) {
                formValid = false;
                errors = Object.assign({},errors,{city: checkTextResponse.error});
            } else{
                errors = Object.assign({},errors,{city: checkTextResponse.error});
            }

            // street
            checkTextResponse = this.checkTextLength(this.state.street,true);
            if(!checkTextResponse.valid) {
                formValid = false;
                errors = Object.assign({},errors,{street: checkTextResponse.error});
            } else{
                errors = Object.assign({},errors,{street: checkTextResponse.error});
            }

            // post_code
            pattern = /^[0-9]{2}-?[0-9]{3}$/;

            if(this.state.post_code.length !== 0 && !pattern.test(this.state.post_code)){
                formValid = false;
                errors = Object.assign({},errors,{post_code : 'Kod pocztowy jest nieprawidłowy !'})
            } else {
                checkTextResponse = this.checkTextLength(this.state.post_code,false);
                if(!checkTextResponse.valid) {
                    formValid = false;
                    errors = Object.assign({},errors,{post_code: checkTextResponse.error});
                }else{
                    errors = Object.assign({},errors,{post_code: checkTextResponse.error});
                }
            } 

            // phone_number
            pattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/

            if(this.state.phone_number.length !== 0 && !pattern.test(this.state.phone_number)){
                formValid = false;
                errors = Object.assign({},errors,{phone_number : 'Podany numer jest nieprawidłowy !'})
            } else {
                checkTextResponse = this.checkTextLength(this.state.phone_number,false);
                if(!checkTextResponse.valid) {
                    formValid = false;
                    errors = Object.assign({},errors,{phone_number: checkTextResponse.error});
                }else{
                    errors = Object.assign({},errors,{phone_number: checkTextResponse.error});
                }
            } 


            // landline_number

            if(this.state.landline_number.length !== 0 && !pattern.test(this.state.landline_number)){
                formValid = false;
                errors = Object.assign({},errors,{landline_number : 'Podany numer jest nieprawidłowy !'})
            } else {
                checkTextResponse = this.checkTextLength(this.state.landline_number,false);
                if(!checkTextResponse.valid) {
                    formValid = false;
                    errors = Object.assign({},errors,{landline_number: checkTextResponse.error});
                }else{
                    errors = Object.assign({},errors,{landline_number: checkTextResponse.error});
                }
            }

            // mail
            pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

            checkTextResponse = this.checkTextLength(this.state.mail,true);
            if(!checkTextResponse.valid) {
                formValid = false;
                errors = Object.assign({},errors,{mail: checkTextResponse.error});
            }
            else if(!pattern.test(this.state.mail)){
                formValid = false;
                errors = Object.assign({},errors,{mail : 'Podany mail jest nieprawidłowy !'})
            } else{
                errors = Object.assign({},errors,{mail: checkTextResponse.error});
            }

            // description
            checkTextResponse = this.checkTextLength(this.state.description,true);
            if(!checkTextResponse.valid) {
                formValid = false;
                errors = Object.assign({},errors,{description: checkTextResponse.error});
            } else{
                errors = Object.assign({},errors,{description: checkTextResponse.error});
            }

            this.setState({
                errors
            })

            return formValid;
    }

    checkOpeningHours = () => {
        let s = this.state;
        
        let ifEmpty = (s.monO.length === 0) && (s.monC.length === 0) &&
                      (s.tueO.length === 0) && (s.tueC.length === 0) &&
                      (s.wedO.length === 0) && (s.wedC.length === 0) &&
                      (s.thuO.length === 0) && (s.thuC.length === 0) &&
                      (s.friO.length === 0) && (s.friC.length === 0) &&
                      (s.satO.length === 0) && (s.satC.length === 0) &&
                      (s.sunO.length === 0) && (s.sunC.length === 0) 
        
                      return ifEmpty;

    }

    handleSubmit = () => {
      // Pobierz state   
      let s = this.state;
      let confirmResponse;
      let ifContinue = true;

      if(this.validate()){

        if(this.checkOpeningHours()){
            confirmResponse = window.confirm('Harmonogram jest pusty, czy kontynuować ? ');  
            if(!confirmResponse){
               return null;
            }      
        }

        if(s.offers.length === 0){
            confirmResponse = window.confirm('Oferty są puste, czy kontynuować ? ');  
            if(!confirmResponse){
               return null;
            }      
        }

        if(s.packages.length === 0){
            confirmResponse = window.confirm('Cennik jest pusty, czy kontynuować ?');
            if(!confirmResponse){
                return null;
             }  
        }          

            // Utworzenie obiektu data z wszystkimi danymi siłowni
        this.setState({
            gymIsAdding: !this.state.gymIsAdding
        })
        var data = {}

        var primaryData = {
            gym_name: s.name,
            city: s.city,
            street: s.street,
            post_code: s.post_code,
            phone_number: s.phone_number,
            landline_number: s.landline_number,
            email: s.mail,
            description: s.description,
            mon: `${s.monO}-${s.monC}`,
            tue: `${s.tueO}-${s.tueC}`,
            wed: `${s.wedO}-${s.wedC}`,
            thu: `${s.thuO}-${s.thuC}`,
            fri: `${s.friO}-${s.friC}`,
            sat: `${s.satO}-${s.satC}`,
            sun: `${s.sunO}-${s.sunC}`
        }

        var offers = this.state.offers;
        var packages = this.state.packages;

        data = Object.assign({}, data, primaryData, { offers: [...offers] }, { packages: [...packages] });

        console.log(data);

        // Wysłanie żądania do serwera
        fetch('http://localhost:8080/api/gym', {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",

            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(res => {
                console.log(res);
                let formatedName = s.name.split(' ').join('-');
                history.push(`/silownie/view/${res.gym_id}/${formatedName}`)
            });

      }
    }


    // Utworzenie pojedynczej oferty
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
        e.target.classList.add('invisible');
    }

    showPackageForm = (e) => {
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

    deletePackage = (i) => {
        var packages = this.state.packages;
        packages = packages.filter((p, index) => (i != index));
        this.setState({
            packages
        });
    }

    handleChange = (e) => {
        let target = e.target;
        let value = e.target.value;

        let data = {
            target: value
        }
        this.setState({
            [e.target.name]: value
        },()=>{
          console.log(this.state.monO)
        })


    }
    /* ------------------------------------------------------------------------------------------------ */
    /*                                          RENDER                                                  */
    /* ------------------------------------------------------------------------------------------------ */
    render() {
        var currentOffers = ''
        var currentPackages = ''

        // Utworzenie listy dodanych ofert
        currentOffers = this.state.offers.map((o, index) =>
            (<OfferItem offerData={o} key={index} deleteOffer={this.deleteOffer.bind(this, index)} />));

        // Utworzenie listy pakietów
        currentPackages = this.state.packages.map((p, index) =>
            (<PackageItem packageData={p} key={index} deletePackage={this.deletePackage.bind(this, index)} />));

        return (
            <div>
                {/* Spinner */}
                {this.state.gymIsAdding && <Spinner />}

                {/* Podstawowe dane */}
                {/* ------------------------------------------------------------------------------- */}
                <form className="newGymForm primaryData animated" onSubmit={this.handleSubmit}>
                    <legend>Dodaj nową siłownię</legend>
                    <hr />

                    <div className="form-group">
                        {/* name */}
                        <label htmlFor="name">
                        *Nazwa <span className="inputError"> {this.state.errors.name} </span>
                        </label>
                        <input type="text" name="name" className="form-control"
                            value={this.state.name} onChange={this.handleChange}
                            autoComplete="off" />

                        {/* city */}
                        <label htmlFor="city">
                        *Miasto <span className="inputError"> {this.state.errors.city} </span>
                        </label>
                        <input type="text" name="city" className="form-control"
                            value={this.state.city} onChange={this.handleChange} />

                        {/* street */}
                        <label htmlFor="street">
                        *Ulica <span className="inputError"> {this.state.errors.street} </span>
                        </label>
                        <input type="text" name="street" className="form-control"
                            value={this.state.street} onChange={this.handleChange} />

                        {/* post_code */}
                        <label htmlFor="post_code">
                        Kod pocztowy  <span className="inputError"> {this.state.errors.post_code} </span>
                        </label>
                        <input type="text" name="post_code" className="form-control"
                            value={this.state.post_code} onChange={this.handleChange} />

                        {/* phone_number */}
                        <label htmlFor="phone_number">
                        Telefon komórkowy <span className="inputError"> {this.state.errors.phone_number} </span>
                        </label>
                        <input type="text" name="phone_number" className="form-control"
                            value={this.state.phone_number} onChange={this.handleChange} />

                        {/* landline_number */}
                        <label htmlFor="landline_phone">
                        Telefon stacjonarny <span className="inputError"> {this.state.errors.landline_number}</span>
                        </label>
                        <input type="text" name="landline_number" className="form-control"
                            value={this.state.landline_phone} onChange={this.handleChange} />

                        {/* mail */}
                        <label htmlFor="mail">
                        *E-mail <span className="inputError"> {this.state.errors.mail} </span>
                        </label>
                        <input type="text" name="mail" className="form-control"
                            value={this.state.mail} onChange={this.handleChange} />

                        {/* description */}
                        <label htmlFor="description">
                        *Opis <span className="inputError"> {this.state.errors.description} </span>
                        </label>
                        <textarea className="form-control" name="description" id="" cols="30" rows="10"
                            value={this.state.description} onChange={this.handleChange}>
                        </textarea>
                    </div>
                </form>

                {/* Godziny otwarcia */}
                {/* ------------------------------------------------------------------------------- */}
                <div className="formTitle">
                    <h3>Harmonogram</h3>
                    Dodaj godziny otwarcia Twojej siłowni
                    <hr />
                </div>

                <form className="openingHoursForm newGymForm">


                    <div className="form-group">
                        <label>Pon</label>
                        <input type="time" name="monO" className="form-control"
                            value={this.state.monO} onChange={this.handleChange} />

                        <input type="time" name="monC" className="form-control" 
                        value={this.state.monC} onChange={this.handleChange}/>
                    </div>

                    <div className="form-group">
                        <label>Wt</label>
                        <input type="time" name="tueO" className="form-control"
                        value={this.state.tueO} onChange={this.handleChange} />

                        <input type="time" name="tueC" className="form-control" 
                        value={this.state.tueC} onChange={this.handleChange}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Śr</label>
                        <input type="time" name="wedO" className="form-control"
                         value={this.state.wedO} onChange={this.handleChange}/>

                        <input type="time" name="wedC" className="form-control" 
                        value={this.state.wedC} onChange={this.handleChange}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Czw</label>
                        <input type="time" name="thuO" className="form-control" 
                        value={this.state.thuO} onChange={this.handleChange}/>

                        <input type="time" name="thuC" className="form-control" 
                        value={this.state.thuC} onChange={this.handleChange}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Pt</label>
                        <input type="time" name="friO" className="form-control" 
                        value={this.state.friO} onChange={this.handleChange}/>

                        <input type="time" name="friC" className="form-control"
                        value={this.state.friC} onChange={this.handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Sob</label>
                        <input type="time" name="satO" className="form-control"
                        value={this.state.satO} onChange={this.handleChange} />

                        <input type="time" name="satC" className="form-control" 
                        value={this.state.satC} onChange={this.handleChange}/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Nd</label>
                        <input type="time" name="sunO" className="form-control" 
                        value={this.state.sunO} onChange={this.handleChange}/>

                        <input type="time" name="sunC" className="form-control" 
                        value={this.state.sunC} onChange={this.handleChange}/>
                    </div>
                </form>

                {/* Oferty */}
                {/* ------------------------------------------------------------------------------- */}
                <div className="formTitle">
                    <h3>Oferta</h3>
                    Dodaj oferty jakie są dostępne w Twojej siłowni (Siłownia,Basen,Sauna...)
                   <hr />
                </div>

                <div className="formTitle">
                    <ul className="list-group">
                        {currentOffers}
                    </ul>
                </div>

                <div className="formTitle addOffer">
                    <i className="fas fa-plus-circle showOfferForm"
                        onClick={this.showOfferForm} data-toggle="collapse" data-target="#offerForm">
                    </i>
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

                {/* Pakiety */}
                {/* ------------------------------------------------------------------------------- */}

                <div className="formTitle">
                    <h3>Cennik</h3>
                    Dodaj pakiety jakie Twoja siłownia oferuje. <br />
                    Przykład: 1 wejście, 6zł , 1raz
                   <hr />
                </div>

                <div className="formTitle">
                    <ul className="list-group">
                        {currentPackages}
                    </ul>
                </div>

                <div className="formTitle addPackages">
                    <i className="fas fa-plus-circle showPackageForm"
                        onClick={this.showOfferForm} data-toggle="collapse" data-target="#packageForm">
                    </i>
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

                <div className="newGymButtons">
                    <div className="formTitle">
                        <div className="btn btn-success sendForm" onClick={this.handleSubmit}>
                            Wyślij formularz
                      </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default NewGym