import React from 'react'
import history from '../../../history'
import OfferItem from './OfferItem'
import PackageItem from './PackageItem'
import Spinner from '../../LoadingSpinner'
import ImageUploader from 'react-images-upload';
import axios from 'axios'
import { Link } from 'react-router-dom'
import { createGym, savePhotos } from '../../../services/API/gyms';



class NewGym extends React.Component {
    constructor() {
        super();

        this.state = {
            errors: {
                name: '',
                city: '',
                street: '',
                phone_number: '',
                landline_number: '',
                post_code: '',
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
            pictures: [],
            picturesToSend: [],
            equipment: [],
            currentForm: 'primaryData',
            gymIsAdding: false,
            selectedFile: null
        }
    }

    onDrop = (picture) => {
        let pictures = picture.map(pic => URL.createObjectURL(pic));
        console.log(pictures);

        this.setState({
            pictures: pictures,
        }, () => {
            console.log('Zdjęcia: ', this.state.pictures)
        });


    }

    // HANDLE PHOTO CHANGE
    // ------------------------------------------------------------------------
    handlePhotoChange = (e) => {

        let reader = new FileReader();
        let pictures = [...this.state.pictures];
        let picturesToSend = [...this.state.picturesToSend];

        reader.onload = (e) => {

            pictures.push(e.target.result);

            this.setState({
                pictures: [...pictures]
            })
        };

        reader.readAsDataURL(e.target.files[0]);
        picturesToSend.push(e.target.files[0]);

        let file = e.target.files[0];

        console.log('Zmieniony obraz : ', file)

        this.setState({
            picturesToSend: [...picturesToSend]
        }, () => {
            console.log(this.state.picturesToSend);
        })

    }

    // SAVE PHOTOS
    // ------------------------------------------------------------------------
    sendPhotos = async (gym_id, gym_name) => {

        const formData = new FormData();

        const photos = [...this.state.picturesToSend];

        for (let index = 0; index < photos.length; index++) {
            const el = photos[index];

            formData.append('image', el, `${gym_id}_${gym_name}`);

        }

        let res = await savePhotos(formData);

        return {
            response: res.response
        }

        console.log(res)

    }

    fileUploadHandler = () => {
        console.log("Wysyłam zdjęcie ...");

        let fd = new FormData()

        for (var img of this.state.pictures) {
            fd.append('image', img, img.name);
        }


        axios.post('http://localhost:8080/upload/silkaMiszczuf', fd)
            .then(res => {
                console.log(res);

            })
    }



    checkTextLength = (value, isRequired,isDescription) => {
        if (value.length === 0 && isRequired) {
            return ({
                valid: false,
                error: 'To pole jest wymagane !'
            })
        }
        else if (value.length > 0 && value.length < 3) {
            return ({
                valid: false,
                error: 'Minimum 3 znaki !'
            })
        }
        else if (value.length > 50 && isDescription === false) {
            return ({
                valid: false,
                error: 'Maksimum 50 znaków !'
            })
        } else {
            return ({
                valid: true,
                error: ''
            })
        }
    }

    validate = () => {
        let errors = this.state.errors;
        let formValid = true;
        let checkTextResponse;
        let pattern;

        // name
        checkTextResponse = this.checkTextLength(this.state.name, true,false);
        if (!checkTextResponse.valid) {
            formValid = false;
            errors = Object.assign({}, errors, { name: checkTextResponse.error });
        }
        else {
            errors = Object.assign({}, errors, { name: checkTextResponse.error });
        }

        // city
        checkTextResponse = this.checkTextLength(this.state.city, true,false);
        if (!checkTextResponse.valid) {
            formValid = false;
            errors = Object.assign({}, errors, { city: checkTextResponse.error });
        } else {
            errors = Object.assign({}, errors, { city: checkTextResponse.error });
        }

        // street
        checkTextResponse = this.checkTextLength(this.state.street, true,false);
        if (!checkTextResponse.valid) {
            formValid = false;
            errors = Object.assign({}, errors, { street: checkTextResponse.error });
        } else {
            errors = Object.assign({}, errors, { street: checkTextResponse.error });
        }

        // post_code
        pattern = /^[0-9]{2}-?[0-9]{3}$/;

        if (this.state.post_code.length !== 0 && !pattern.test(this.state.post_code)) {
            formValid = false;
            errors = Object.assign({}, errors, { post_code: 'Kod pocztowy jest nieprawidłowy !' })
        } else {
            checkTextResponse = this.checkTextLength(this.state.post_code, false,false);
            if (!checkTextResponse.valid) {
                formValid = false;
                errors = Object.assign({}, errors, { post_code: checkTextResponse.error });
            } else {
                errors = Object.assign({}, errors, { post_code: checkTextResponse.error });
            }
        }

        // phone_number
        pattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/

        if (this.state.phone_number.length !== 0 && !pattern.test(this.state.phone_number)) {
            formValid = false;
            errors = Object.assign({}, errors, { phone_number: 'Podany numer jest nieprawidłowy !' })
        } else {
            checkTextResponse = this.checkTextLength(this.state.phone_number, false,false);
            if (!checkTextResponse.valid) {
                formValid = false;
                errors = Object.assign({}, errors, { phone_number: checkTextResponse.error });
            } else {
                errors = Object.assign({}, errors, { phone_number: checkTextResponse.error });
            }
        }


        // landline_number

        if (this.state.landline_number.length !== 0 && !pattern.test(this.state.landline_number)) {
            formValid = false;
            errors = Object.assign({}, errors, { landline_number: 'Podany numer jest nieprawidłowy !' })
        } else {
            checkTextResponse = this.checkTextLength(this.state.landline_number, false,false);
            if (!checkTextResponse.valid) {
                formValid = false;
                errors = Object.assign({}, errors, { landline_number: checkTextResponse.error });
            } else {
                errors = Object.assign({}, errors, { landline_number: checkTextResponse.error });
            }
        }

        // mail
        pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        checkTextResponse = this.checkTextLength(this.state.mail, true,false);
        if (!checkTextResponse.valid) {
            formValid = false;
            errors = Object.assign({}, errors, { mail: checkTextResponse.error });
        }
        else if (!pattern.test(this.state.mail)) {
            formValid = false;
            errors = Object.assign({}, errors, { mail: 'Podany mail jest nieprawidłowy !' })
        } else {
            errors = Object.assign({}, errors, { mail: checkTextResponse.error });
        }

        // description
        checkTextResponse = this.checkTextLength(this.state.description, true,true);
        if (!checkTextResponse.valid) {
            formValid = false;
            errors = Object.assign({}, errors, { description: checkTextResponse.error });
        } else {
            errors = Object.assign({}, errors, { description: checkTextResponse.error });
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

    handleSubmit = async (e) => {

        e.preventDefault();
        // Pobierz state   
        let s = this.state;
        let confirmResponse;
        let ifContinue = true;

        if (this.validate()) {

            if (this.checkOpeningHours()) {
                confirmResponse = window.confirm('Harmonogram jest pusty, czy kontynuować ? ');
                if (!confirmResponse) {
                    return null;
                }
            }

            if (s.offers.length === 0) {
                confirmResponse = window.confirm('Oferty są puste, czy kontynuować ? ');
                if (!confirmResponse) {
                    return null;
                }
            }

            if (s.packages.length === 0) {
                confirmResponse = window.confirm('Cennik jest pusty, czy kontynuować ?');
                if (!confirmResponse) {
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
            var equipment = this.state.equipment.join(',');
            var pictures = this.state.pictures.map(pic => `images/${s.name}/${pic.name}`);

            data = Object.assign({}, data, primaryData,
                { offers: [...offers] },
                { packages: [...packages] },
                { equipment: equipment },
                { pictures: [...pictures] }
            );

            console.log(data);
            let gym_id;
            // Wysłanie żądania do serwera

            try {

                let res = await createGym(data);

                console.log('Odpowiedź z serwera : ', res)

                if (res.response === 'failed') {
                    if (res.message) {
                        throw {
                            myMessage: res.message
                        }
                    } else {
                        throw {
                            type: 'failed'
                        }
                    }
                }


                gym_id = res.gym_id;

                res = await this.sendPhotos(gym_id, s.name);

                if (res.response === 'failed') {
                    throw {
                        type: 'failed'
                    }
                }


                let formatedName = s.name.split(' ').join('-');
                history.push(`/silownie/view/${gym_id}/${formatedName}`)



            } catch (error) {
                console.log(error);

                if (error.myMessage) {
                    alert(error.myMessage);
                } else {
                    alert('Wystąpił błąd, spróbuj ponownie później !')
                }

            }

            // fetch('http://localhost:8080/api/gym', {
            //     method: "POST",
            //     mode: "cors",
            //     cache: "no-cache",
            //     credentials: "same-origin",

            //     body: JSON.stringify(data),
            //     headers: {
            //         "Content-Type": "application/json"
            //     }
            // }).then(res => res.json())
            //     .then(res => {

            //         console.log('Odpowiedź z serwera : ',res)
            // if (res.response !== 'success') {
            //     alert('Wystąpił błąd !')
            // }
            // else {
            //     gym_id = res.gym_id;
            // }
            //     })

            // .then(() => {
            // let formatedName = s.name.split(' ').join('-');
            // history.push(`/silownie/view/${gym_id}/${formatedName}`)
            // })

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
        // let target = e.target;
        let value = e.target.value;

        let data = {
            target: value
        }
        this.setState({
            [e.target.name]: value
        }, () => {
            console.log(this.state.monO)
        })

    }

    // Dodawanie bądź usuwanie wyposażenia
    // --------------------------------------------------------------------------------------------
    handleCheck = (e) => {
        let equipment = this.state.equipment;
        if (e.target.checked) {
            equipment.push(e.target.value);
        } else {
            equipment = equipment.filter(eq => (eq !== e.target.value));
        }

        this.setState({
            equipment: [...equipment]
        }, () => {
            console.log("Wyposażenie: ", this.state.equipment);

        })
    }



    /* ------------------------------------------------------------------------------------------------ */
    /*                                          RENDER                                                  */
    /* ------------------------------------------------------------------------------------------------ */
    render() {
        var currentOffers = ''
        var currentPackages = ''
        var pictures = ''

        // Utworzenie listy dodanych ofert
        currentOffers = this.state.offers.map((o, index) =>
            (<OfferItem offerData={o} key={index} deleteOffer={this.deleteOffer.bind(this, index)} />));

        // Utworzenie listy pakietów
        currentPackages = this.state.packages.map((p, index) =>
            (<PackageItem packageData={p} key={index} deletePackage={this.deletePackage.bind(this, index)} />));

        pictures = this.state.pictures.map(pic => (
            <div className="userAvatar mr-2">
                <img src={pic} alt="" />
            </div>))



        return (
            <div className="newGymContainer row">

                {this.state.gymIsAdding &&
                    <div className="spinnerContainer ">
                        <div className="spinnerContent text-light text-center">
                            <Spinner />
                            Trwa dodawanie siłowni !
                        </div>
                    </div>}
                    {
                        localStorage.getItem('isLoggedIn') === 'true' ?
                        
                <div className="newGymContainerForms rounded text-dark col-lg-6 col-md-8 col-sm-10 mr-auto ml-auto animated fadeIn">

                <h1 className="text-center pt-5 color-red-FE493B">Dodawanie nowej siłowni</h1>
                {/* Spinner */}


                {/* Podstawowe dane */}
                {/* ------------------------------------------------------------------------------- */}

                <div className="formTitle text-center mt-4">
                    <h4>Podstawowe dane</h4>
                    <hr />
                </div>

                <form className="newGymForm primaryData animated" onSubmit={this.handleSubmit}>
                    <div className="form-group mx-auto">
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
                <div className="formTitle text-center">
                    <h4>Harmonogram</h4>
                    Dodaj godziny otwarcia Twojej siłowni
                <hr />
                </div>

                <form className="openingHoursForm  newGymForm mx-auto d-flex justify-content-center ">

                    <div className="form-group ">
                        <label>Pon</label>
                        <input type="time" name="monO" className="form-control "
                            value={this.state.monO} onChange={this.handleChange} />

                        <input type="time" name="monC" className="form-control"
                            value={this.state.monC} onChange={this.handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Wt</label>
                        <input type="time" name="tueO" className="form-control"
                            value={this.state.tueO} onChange={this.handleChange} />

                        <input type="time" name="tueC" className="form-control"
                            value={this.state.tueC} onChange={this.handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Śr</label>
                        <input type="time" name="wedO" className="form-control"
                            value={this.state.wedO} onChange={this.handleChange} />

                        <input type="time" name="wedC" className="form-control"
                            value={this.state.wedC} onChange={this.handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Czw</label>
                        <input type="time" name="thuO" className="form-control"
                            value={this.state.thuO} onChange={this.handleChange} />

                        <input type="time" name="thuC" className="form-control"
                            value={this.state.thuC} onChange={this.handleChange} />
                    </div>


                    <div className="form-group">
                        <label htmlFor="">Pt</label>
                        <input type="time" name="friO" className="form-control"
                            value={this.state.friO} onChange={this.handleChange} />

                        <input type="time" name="friC" className="form-control"
                            value={this.state.friC} onChange={this.handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Sob</label>
                        <input type="time" name="satO" className="form-control"
                            value={this.state.satO} onChange={this.handleChange} />

                        <input type="time" name="satC" className="form-control"
                            value={this.state.satC} onChange={this.handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="">Nd</label>
                        <input type="time" name="sunO" className="form-control"
                            value={this.state.sunO} onChange={this.handleChange} />

                        <input type="time" name="sunC" className="form-control"
                            value={this.state.sunC} onChange={this.handleChange} />
                    </div>
                </form>

                {/* Oferty */}
                {/* ------------------------------------------------------------------------------- */}
                <div className="formTitle  mx-auto pt-5 pl-5">
                    <h4>Oferta</h4>
                    Dodaj oferty jakie są dostępne w Twojej siłowni (Siłownia,Basen,Sauna...)
               <hr />
                </div>

                <div className="formTitle">
                    <ul className="list-group">
                        {currentOffers}
                    </ul>
                </div>

                <div className="formTitle addOffer mx-auto text-left">
                    <i className="fas fa-plus-circle showOfferForm pl-5"
                        onClick={this.showOfferForm} data-toggle="collapse" data-target="#offerForm">
                    </i>
                </div>

                <form id="offerForm" className="newGymForm offerForm collapse  pl-5" onSubmit={this.handleOfferSubmit}>
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

                <div className="formTitle  mx-auto pl-5 pt-5">
                    <h3>Cennik</h3>
                    Dodaj pakiety jakie Twoja siłownia oferuje. <br />
                    Przykład: Siłownia, 6zł , 1 wejście
                <hr className="bg-dark" />

                </div>

                <div className="formTitle">
                    <ul className="list-group">
                        {currentPackages}
                    </ul>
                </div>

                <div className="formTitle addPackages c mx-auto text-left">
                    <i className="fas fa-plus-circle showPackageForm pl-5"
                        onClick={this.showOfferForm} data-toggle="collapse" data-target="#packageForm">
                    </i>
                </div>

                <form id="packageForm" className=" newGymForm packageForm collapse col-6 pl-5" onSubmit={this.handlePackageSubmit}>

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

                {/* Wyposażenie */}
                {/* ------------------------------------------------------------------------------- */}
                <div className="formTitle mx-auto pl-5 pt-5">
                    <h3>Wyposażenie</h3>
                    Zaznacz dostępne w Twojej siłowni wyposażenie.
               <hr />
                </div>

                <form className="equipment mx-auto pl-5 d-flex justify-content-start flex-wrap">


                    <div className="form-group mr-2">
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value='Atlas' onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Atlas</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value='Bieżnie' onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Bieżnie</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value='Bramy' onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Bramy</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value='Drążki do podciągania' onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Drążki do podciągania</label>
                        </div>
                    </div>

                    <div className="form-group mr-2">
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value='Hantle' onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Hantle</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value='Ławki skośne' onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Ławki skośne</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value='Ławki treningowe' onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Ławki treningowe</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value="Orbiterek" onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Orbiterek </label>
                        </div>
                    </div>

                    <div className="form-group mr-2">
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value="Piłki treningowe" onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Piłki treningowe</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value="Rowery treningowe" onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Rowery treningowe</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value="Stepper" onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Stepper</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value="Stepy do aerobiku" onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Stepy do aerobiku</label>
                        </div>
                    </div>


                    <div className="form-group mr-2">
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value="Suwnice do wypychania" onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Suwnice do wypychania</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value="Sztangi" onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Sztangi</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value="Wiosła" onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Wiosła</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value="Maszyny eliptyczne" onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Maszyny eliptyczne</label>
                        </div>
                    </div>

                    <div className="form-group mr-2">
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value="Piłki fitness" onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Piłki fitness</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value="Kettle" onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Kettle</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value="Pasy obciążeniowe" onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Pasy obciążeniowe</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value="Maszyny hammer" onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Maszyny hammer</label>
                        </div>
                    </div>

                    <div className="form-group mr-2">
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value="Skakanki" onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Skakanki</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value="Sklep" onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Sklep</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value="Hula hop" onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Hula hop</label>
                        </div>
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" value="Maszyny hammer" onChange={this.handleCheck} />
                            <label class="form-check-label" for="exampleCheck1">Maszyny hammer</label>
                        </div>
                    </div>
                </form>

                {/* Zdjęcie */}
                {/* ------------------------------------------------------------------------------- */}
                <div className="formTitle pl-5">
                    <h3>Zdjęcia</h3>
                    Dodaj zdjęcia do swojej siłowni
                 <hr />
                </div>

                <div className="formTitle gymImagesUploadList d-flex pl-5 mb-3">
                    {pictures}
                </div>

                <div className="pl-5">
                    <input type="file" name="file" id="file" class="inputfile" onChange={this.handlePhotoChange} />
                    <label for="file">Dodaj zdjęcie -></label>
                </div>

                {/* <div className="gymImagesUpload col-6 mx-auto">
                <ImageUploader
                        withIcon={true}
                        buttonText='Choose images'
                        onChange={this.onDrop}
                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                        maxFileSize={5242880}
                    /> */}

                {/* <input type="file" onChange={this.fileSelectedHandler}/>
                    <button onClick={this.fileUploadHandler} >Wyślij</button> */}
                {/* </div> */}

               

                {/* Przycisk do wysyłania */}
                {/* ------------------------------------------------------------------------------- */}
                <div className="newGymButtons text-center pb-5 mt-5">
                    <div className="formTitle">
                        <div className="btn btn-success sendForm w-100" onClick={this.handleSubmit}>
                            Wyślij formularz
                  </div>
                    </div>
                </div>

            </div>:
                    <div className="logggedInAlert">
                        <div className="loggedInAlertContent">
                             <h2>Zaloguj się by móc dodać nową siłownię !</h2>
                        </div>
        
                    </div>
                    }
            </div>
        );
    }
}

export default NewGym