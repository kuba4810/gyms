import React, { Component } from 'react';
import {
  getTrainerData,
  updateProfile,
  addPackage,
  editPackage,
  deletePackage,
  addSkill,
  editSkill,
  deleteSkill,
  changeAvatar,
  addNewPhoto,
  deleteAvatar,
  deletePhoto
} from '../../../services/API/trainers';

import { connect } from 'react-redux';
import { deleteImage } from '../../../Actions/index';
import Gallery from '../Gallery';

class TrainerForm extends Component {
  state = {
    first_name: '',
    last_name: '',
    login: '',
    passw: '',
    confirm_password: '',
    con_password_message: '',
    city: '',
    image: '',
    imageChanged: false,
    img: null,
    voivodeship: '',
    packages: [],
    package_name: '',
    package_duration: '',
    package_price: '',
    editPackage: '',
    skills: [],
    editSkill: '',
    skill_name: '',
    skill_description: '',
    photos: [],
    newPhoto: null,
    photo: null,
    currentIndex : 0

  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  photoChanged = (type, e) => {

    switch (type) {

      case 'avatar':
        this.handlePhotoChange(e);
        break;

      case 'newPhoto':
        this.handleNewPhoto(e);
        break;

    }

  }

  // HANDLE PHOTO CHANGE
  // --------------------------------------------
  handlePhotoChange = (e) => {

    console.log('Handle photo change');

    var reader = new FileReader();

    reader.onload = (e) => {

      this.setState({
        img: e.target.result,
        imageChanged: true
      })
    };

    reader.readAsDataURL(e.target.files[0]);

    this.setState({
      image: e.target.files[0]
    }, () => {
      console.log(this.state);

    })
  }

  // HANDLE NEW PHOTO
  // --------------------------------------------------------------------------
  handleNewPhoto = (e) => {

    console.log('Handle new photo');

    console.log(e.target.files[0]);

    var reader = new FileReader();

    reader.onload = (e) => {

      this.setState({
        newPhoto: e.target.result
      }, () => {
        console.log(this.state);
      })
    };

    reader.readAsDataURL(e.target.files[0]);

    this.setState({
      photo: e.target.files[0]
    })

  }

  // SEND NEW PHOTO
  // --------------------------------------------------------------------------
  sendNewPhoto = async (e) => {
    e.preventDefault();

    e.preventDefault();

    const login = localStorage.getItem('loggedNick');
    let fileName;
    let index = 1;

    for (let i = 0; i < this.state.photos.length; i++) {
      index++;
    }

    fileName = `${login}_${index}`;


    const formData = new FormData();

    formData.append('avatar', this.state.photo, fileName);


    let res = await addNewPhoto(formData);

    window.location.reload();
  }

  // DELETE AVATAR
  // --------------------------------------------------------------------------
  deleteImage = async () => {

    const confirm = window.confirm('Czy na pewno usunąć zdjęcie ?');

    if (confirm) {
      let res = await deleteAvatar(this.state.login);

      if (res.response === 'failed') {
        alert('Wystąpił błąd, spróbuj ponownie później !');
      } else {
        this.setState({
          img: null,
          image: null,
          imageChanged: false
        })

        this.props.deleteImage();
      }
    }

  }

  // DELETE PHOTO
  // --------------------------------------------------------------------------
  deleteImageFromAlbum = async (photo_name) => {

    const confirm = window.confirm('Czy na pewno usunąć zdjęcie ?');

    if (confirm) {
      let res = await deletePhoto(photo_name);

      if (res.response === 'failed') {
        alert('Wystąpił błąd, spróbuj ponownie później !');
      } else {
        let photos = this.state.photos;

        photos = photos.filter(photo => (photo.photo_name !== photo_name))
        this.setState({
          photos: [...photos]
        })


      }
    }

  }

  // SEND IMAGE
  // --------------------------------------------------------------------------
  sendImage = async (e) => {

    e.preventDefault();

    const login = localStorage.getItem('loggedNick');

    const formData = new FormData();

    formData.append('avatar', this.state.image, login);

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };

    let res = await changeAvatar(formData);

    window.location.reload();

  }


  // SHOW PACKAGE EDIT
  // --------------------------------------------------------------------------
  showPackageEdit = (id) => {

    console.log(id, this.state.packages);


    const p = this.state.packages.filter(p => (p.package_id === id))[0];

    console.log(p);


    this.setState({
      editPackage: id,
      package_name: p.name,
      package_duration: p.duration,
      package_price: p.price,
    })

    const container = document.querySelector('.trainerProfileEditContainer');
    container.classList.remove('invisible');
    container.classList.remove('fadeOut');
    container.classList.add('fadeIn');

    const editPackage = document.querySelector('.trainerProfileEditContainer .editPackage');
    editPackage.classList.remove('fadeOut');
    editPackage.classList.remove('invisible');
    editPackage.classList.add('fadeIn');
  }

  // HIDE PACKAGE EDIT
  // --------------------------------------------------------------------------

  hidePackageEdit = () => {

    this.setState({
      editPackage: 0,
      package_name: '',
      package_duration: '',
      package_price: '',
    })

    const container = document.querySelector('.trainerProfileEditContainer');
    container.classList.add('fadeOut');
    container.classList.remove('fadeIn');


    const editPackage = document.querySelector('.trainerProfileEditContainer .editPackage');
    editPackage.classList.add('fadeOut');
    editPackage.classList.remove('fadeIn');


    setTimeout(() => {
      container.classList.add('invisible');
      editPackage.classList.add('invisible');
    }, 500)

  }

  // HIDE SKILL EDIT
  // --------------------------------------------------------------------------

  hideSkillEdit = () => {

    this.setState({
      editSkill: 0,
      skill_name: '',
      package_description: ''
    })

    const container = document.querySelector('.trainerProfileEditContainer');
    container.classList.add('fadeOut');
    container.classList.remove('fadeIn');

    const editSkill = document.querySelector('.trainerProfileEditContainer .editSkill');
    editSkill.classList.add('fadeOut');
    editSkill.classList.remove('fadeIn');

    setTimeout(() => {
      container.classList.add('invisible');
      editSkill.classList.add('invisible');
    }, 500)

  }

  // ADD PACKAGE
  // --------------------------------------------------------------------------
  addPackage = async () => {

    // Prepare data object
    const data = {
      trainer_id: localStorage.getItem('loggedId'),
      name: this.state.package_name,
      duration: this.state.package_duration,
      price: this.state.package_price
    }

    // API call
    let res = await addPackage(data);

    if (res.response === 'success') {

      // Push new object to state
      let packages = this.state.packages;

      packages.push({
        package_id: res.package_id,
        trainer_id: localStorage.getItem('loggedId'),
        name: this.state.package_name,
        duration: this.state.package_duration,
        price: this.state.package_price
      })

      this.setState({
        packages: [...packages],
        package_name: '',
        package_duration: '',
        package_price: ''
      })

      document.querySelector('#packages').classList.add('collapse');
      document.querySelector('#packages').classList.remove('show');



    } else {
      alert('Wystąpił błąd, spróbuj ponownie później !');
    }

  }

  // EDIT PACKAGE
  // --------------------------------------------------------------------------

  editPackage = async () => {

    // Prepare data object
    const data = {
      package_id: this.state.editPackage,
      trainer_id: localStorage.getItem('loggedId'),
      name: this.state.package_name,
      duration: this.state.package_duration,
      price: this.state.package_price
    }

    console.log(data);


    // API call
    let res = await editPackage(data);

    if (res.response === 'success') {

      // Push new object to state
      let packages = this.state.packages;

      packages = packages.filter(p => p.package_id !== this.state.editPackage)

      packages.push({
        package_id: this.state.editPackage,
        trainer_id: localStorage.getItem('loggedId'),
        name: this.state.package_name,
        duration: this.state.package_duration,
        price: this.state.package_price
      })

      this.setState({
        packages: [...packages],
        package_name: '',
        package_duration: '',
        package_price: ''
      })

      // document.querySelector('#packages').classList.add('collapse');
      // document.querySelector('#packages').classList.remove('show');

      this.hidePackageEdit();

    } else {
      alert('Wystąpił błąd, spróbuj ponownie później !');
    }

  }

  // DELETE PACKAGE
  // --------------------------------------------------------------------------

  deletePackage = async (id) => {

    console.log(id);


    let response = window.confirm('Czy na pewno usunąć ten pakiet ?');

    if (response) {

      let res = await deletePackage(id);

      if (res.response === 'success') {

        let packages = this.state.packages;

        packages = packages.filter(p => (p.package_id !== id));

        this.setState({
          packages: [...packages]
        })

      } else {
        alert('Wystąpił błąd, spróbuj ponownie później !');
      }
    }

  }

  // SHOW SKILL EDIT
  // --------------------------------------------------------------------------
  showSkillEdit = (id) => {



    const s = this.state.skills.filter(s => (s.skill_id === id))[0];

    console.log(s);


    this.setState({
      editSkill: id,
      skill_name: s.name,
      skill_description: s.description
    })

    const container = document.querySelector('.trainerProfileEditContainer');
    container.classList.remove('invisible');
    container.classList.remove('fadeOut');
    container.classList.add('fadeIn');

    const editSkill = document.querySelector('.trainerProfileEditContainer .editSkill');
    editSkill.classList.remove('fadeOut');
    editSkill.classList.remove('invisible');
    editSkill.classList.add('fadeIn');
  }

  // EDIT SKILL
  // --------------------------------------------------------------------------

  editSkill = async () => {

    // Prepare data object
    const data = {
      skill_id: this.state.editSkill,
      trainer_id: localStorage.getItem('loggedId'),
      name: this.state.skill_name,
      description: this.state.skill_description
    }

    console.log(data);


    // API call
    let res = await editSkill(data);

    if (res.response === 'success') {

      // Push new object to state
      let skills = this.state.skills;

      skills = skills.filter(p => p.skill_id !== this.state.editSkill)

      skills.push({
        skill_id: this.state.editSkill,
        trainer_id: localStorage.getItem('loggedId'),
        name: this.state.skill_name,
        description: this.state.skill_description
      })

      this.setState({
        skills: [...skills],
        skill_name: '',
        skill_description: ''
      })

      // document.querySelector('#skills').classList.add('collapse');
      // document.querySelector('#skills').classList.remove('show');

      this.hideSkillEdit();

    } else {
      alert('Wystąpił błąd, spróbuj ponownie później !');
    }

  }


  // ADD SKILL
  // --------------------------------------------------------------------------
  addSkill = async () => {

    // Prepare data object
    const data = {
      trainer_id: localStorage.getItem('loggedId'),
      name: this.state.skill_name,
      description: this.state.skill_description
    }

    // API call
    let res = await addSkill(data);

    if (res.response === 'success') {

      // Push new object to state
      let skills = this.state.skills;

      skills.push({
        skill_id: res.skill_id,
        trainer_id: localStorage.getItem('loggedId'),
        name: this.state.skill_name,
        description: this.state.skill_description
      })

      this.setState({
        skills: [...skills],
        skill_name: '',
        skill_description: ''
      })

      document.querySelector('#skills').classList.add('collapse');
      document.querySelector('#skills').classList.remove('show');

    } else {
      alert('Wystąpił błąd, spróbuj ponownie później !');
    }

  }

  // DELETE SKILL
  // --------------------------------------------------------------------------
  deleteSkill = async (id) => {

    let response = window.confirm('Czy na pewno usunąć te umiejętność ?');
    console.log(id);


    if (response) {

      let res = await deleteSkill(id);

      if (res.response === 'success') {

        let skills = this.state.skills;

        skills = skills.filter(s => (s.skill_id !== id));

        this.setState({
          skills: [...skills]
        })

      } else {
        alert('Wystąpił błąd, spróbuj ponownie później !');
      }
    }


  }

  // Funkcja walidująca formularz
  // Sprawdza każde pole pod względem długości i poprawności danych
  // Sprawdza czy hasła są identyczne
  validateForm = () => {
    console.log(this.state);

    let valid = true;
    if (this.state.passw != this.state.confirm_password) {
      valid = false;
      this.setState({
        con_password_message: 'Hasło nie jest identyczne !'
      })
    }

    return valid;
  }

  // Wysłanie formularza
  // Wywołuje funkcje walidującą
  // Przygotowuje formularz do wysłania
  // Przed wysłaniem wyświetla okno potwiedzenia 
  handleSubmit = () => {
    // 1.) Wywołanie funkcji walidującej
    let valid = this.validateForm();
    console.log(valid);

    if (valid) {
      // 2.) Wyświetlenie okna potwierdzenia
      let confirm = window.confirm('Czy na pewno zapisać zmiany ?');
      if (confirm) {
        // 3.) Przygotowanie formularza
        let s = this.state;
        let data = {
          type: localStorage.getItem('type'),
          id: localStorage.getItem('loggedId'),
          data: {
            first_name: s.first_name,
            last_name: s.last_name,
            login: s.login,
            passw: s.passw,
            city: s.city,
            voivodeship: s.voivodeship
          }
        }
        // 4.) Wysłanie formularza
        fetch('http://localhost:8080/api/user/edit-profile', {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json"
          }
        })
          // 5.) Odpowiedź z serwera
          .then(res => res.json())
          .then(res => {
            if (res.response === 'success') {
              alert('Zmiany zostały zapisane !')
            }
            else {
              alert('Wystąpił błąd, spróbuj ponownie później !');
            }
          })
      }

    }
  }


  // Odbiera dane z propsów i przypisuje odpowiednim właściom wartości
  componentDidMount = async () => {

    const id = localStorage.getItem('loggedId');
    let res = await getTrainerData(id);

    console.log('Dane trenera : ', res);


    if (res.response === 'success') {

      const d = res.data.trainer;
      this.setState({
        first_name: d.first_name,
        last_name: d.last_name,
        login: d.login,
        passw: d.passw,
        city: d.city,
        img: d.image,
        voivodeship: d.voivodeship,
        packages: [...res.data.packages],
        skills: [...res.data.skills],
        photos: [...res.data.photos]
      })

    } else {
      alert('Wystąpił błąd, spróbuj ponownie później !');
    }


  }

  // SHOW GALLERY
  // --------------------------------------------------------------------------
  showGallery = (index) => {

    this.setState({
      currentIndex : index
    })
    let gallery = document.querySelector('.gallery');

    gallery.classList.add('fadeIn');
    gallery.classList.remove('fadeOut');
    gallery.classList.remove('invisible');

  }

  render() {

    let packages = this.state.packages.map((p, index) => (
      <li key={index} className=" packageItem animated mb-2 fadeInLeft bg-secondary d-flex justify-content-between align-items-center" >
        <div>

          <i class="fas fa-check mr-2 text-light"></i>
          <b> {p.name}</b>,
          {p.price} zł,
          {p.duration}
        </div>

        <div>
          <i class="fas fa-pen mr-2 text-warning"
            onClick={this.showPackageEdit.bind(null, p.package_id)}></i>
          <i className="fas fa-trash text-danger position-relative"
            onClick={this.deletePackage.bind(this, p.package_id)}></i>
        </div>
      </li>
    ))


    // Create packages list
    let skills = this.state.skills.map((skill, index) => (
      <li key={index} className=" skillItem animated mb-2 fadeInLeft bg-secondary d-flex justify-content-between align-items-center">
        <div>
          <i class="fas fa-check mr-2 text-light"></i>
          <b>{skill.name}</b>,
          {skill.description.slice(0, 30)} {skill.description.length > 50 && '...'}
        </div>

        <div>
          <i class="fas fa-pen mr-2 text-warning"
            onClick={this.showSkillEdit.bind(null, skill.skill_id)}></i>
          <i className="fas fa-trash text-danger position-relative"
            onClick={this.deleteSkill.bind(this, skill.skill_id)}></i>
        </div>
      </li>
    ))


    let photos = this.state.photos.map((photo, index) => (
      <div className="userAvatar m-2">
        <div className="overlay">

          <i class="fas fa-eye text-primary"
            onClick={this.showGallery.bind(null,index+1)}></i>
          <i className="fas fa-trash text-danger ml-2"
            onClick={this.deleteImageFromAlbum.bind(null, photo.photo_name)}
          ></i>

        </div>
        <img src={`http://localhost:8080/public/images/${photo.photo_name}.jpg`} />
      </div>
    ))

    let galleryPhotos = [...this.state.photos];
    galleryPhotos.unshift({
      photo_name : this.state.login
    })

    return (
      <div>
        <Gallery photos={galleryPhotos} currentIndex = {this.state.currentIndex}/>
        <div class="container-fluid trainer-profile-edit position-relative">

          {/* Edit Form */}
          {/* ------------------------------------------------------------------------------------- */}
          <div className="trainerProfileEditContainer animated invisible fadeOut">

            <form action="" className="bg-light ml-auto mr-auto w-50 p-2 editPackage invisible animated fadeOut">

              <i className="fas fa-times position-absolute closeEditForm"
                onClick={this.hidePackageEdit}>
              </i>

              <h3 className="text-dark">Edycja pakietu</h3>
              <hr />

              {/* Name */}
              <div className="form-group">

                <label htmlFor="package_name">
                  Nazwa
              </label>

                <input name="package_name" type="text" className="form-control"
                  value={this.state.package_name} onChange={this.handleChange} />

              </div>

              {/* Duration */}
              <div className="form-group">

                <label htmlFor="package_duration">
                  Czas trwania
              </label>

                <input name="package_duration" type="text" className="form-control"
                  value={this.state.package_duration} onChange={this.handleChange} />

              </div>


              {/* Price */}
              <div className="form-group">

                <label htmlFor="package_price">
                  Cena
              </label>
                <input name="package_price" type="number" className="form-control"
                  value={this.state.package_price} onChange={this.handleChange} />

              </div>

              <div className="form-group">
                <div className="btn btn-success"
                  onClick={this.editPackage}>
                  Zapisz
              </div>
              </div>


            </form>
            {/* ---------------------------------------------------------------------------------------- */}



            <form action="" className="bg-light ml-auto mr-auto w-50 p-2 editSkill invisible animated fadeOut">

              <h3 className="text-dark">Edycja umiejętności</h3>
              <hr />

              <i className="fas fa-times position-absolute closeEditForm"
                onClick={this.hideSkillEdit}>
              </i>

              {/* Name */}
              {/* <div className="form-group">

                <label htmlFor="skill_name">
                  Nazwa
              </label>

                <input name="skill_name" type="text" className="form-control"
                  value={this.state.skill_name} onChange={this.handleChange} />

              </div> */}

              {/* Description */}
              <div className="form-group">

                <label htmlFor="skill_description">
                  Opis
              </label>

                <textarea name="skill_description" id="" cols="30" rows="10" className="form-control"
                  value={this.state.skill_description} onChange={this.handleChange}>
                </textarea>
              </div>


              <div className="form-group">
                <div className="btn btn-success"
                  onClick={this.editSkill}>
                  Zapisz
              </div>
              </div>


            </form>
            {/* ----------------------------------------------------------------------------------------- */}

          </div>

          <div class="row editProfileRow animated fadeIn">
            {/* User avatar */}
            <div className="col-lg-4">

              {
                this.state.img === null &&
                <div className="userAvatar mb-3">
                  <i className="fas fa-user"></i>
                </div>
              }

              {
                (this.state.img !== null && this.state.imageChanged === false) &&
                <div className="userAvatar mb-3">
                  <div className="overlay">

                    <i class="fas fa-eye text-primary"
                      onClick={this.showGallery.bind(null,0)}></i>
                    <i className="fas fa-trash text-danger ml-2"
                      onClick={this.deleteImage}></i>

                  </div>
                  <img src={`http://localhost:8080/public/images/${this.state.login}.jpg`} alt="" />
                </div>
              }

              {
                (this.state.img !== null && this.state.imageChanged === true) &&

                <div className="userAvatar mb-3">
                  <img src={this.state.img} alt="" />
                </div>
              }


              {/* Select image from disk */}
              <label for='userAvatar'>
                <h4>Zdjęcie profilowe</h4>
              </label>

              <input type="file" name="" id="file" class=""
                onChange={this.photoChanged.bind(this, 'avatar')} />
              {/* <label for="file">
                <i class="fas fa-upload mr-2"></i>
                Wybierz nowe
              </label> */}
              {/* ------------------------------------------------------ */}

              {
                this.state.imageChanged &&
                <button className="btn-success form-control mt-3"
                  onClick={this.sendImage}>
                  Zapisz
                  </button>
              }

              <hr className="bg-dark text-dark w-100" />

              {/* Select image from disk */}
              <label htmlFor="addPhoto">
                <h4 className=" w-100 text-left">Album</h4>
              </label>
              {/* ------------------------------------------------------ */}


              <div className="w-100 d-flex justify-content-start mt-2 trainer-photos">

                {
                  photos
                }
                {
                  this.state.newPhoto !== null &&
                  <div className="userAvatar mb-2 ml-2">
                    <div className="overlay">

                      <i className="fas fa-user text-primary"></i>
                      <i className="fas fa-trash text-danger ml-2"></i>

                    </div>
                    <img src={this.state.newPhoto} />
                  </div>
                }

              </div>

              {
                this.state.newPhoto === null &&
                <div>
                  <input type="file" /* name="" id="newPhoto" class="" */
                    onChange={this.photoChanged.bind(this, 'newPhoto')} />

                  {/* <label for="file" className="mt-2">
                     <i class="fas fa-upload mr-2"></i>
                     Dodaj...
                  </label> */}
                </div>
              }


              {
                this.state.newPhoto !== null &&
                <div className="btn btn-success w-25" onClick={this.sendNewPhoto}>
                  Wyślij
               </div>
              }

            </div>

            {/* User data */}
            <div className="col-lg-8 ">

              <form class="form-horizontal editProfileForm" role="form">

                {/* First name */}
                <div class="form-group">
                  <label class="col-lg-12 control-label">Imię</label>
                  <div class="col-lg-12">
                    <input class="form-control" name='first_name' autoComplete='off'
                      value={this.state.first_name} onChange={this.handleChange}
                      type="text" />
                  </div>
                </div>

                {/* Last name */}
                <div class="form-group">
                  <label class="col-lg-12 control-label">Nazwisko</label>
                  <div class="col-lg-12">
                    <input class="form-control" name='last_name' autoComplete='off'
                      value={this.state.last_name} onChange={this.handleChange}
                      type="text" />
                  </div>
                </div>
                {/* City */}
                <div class="form-group">
                  <label class="col-lg-12 control-label">Miastp:</label>
                  <div class="col-lg-12">
                    <input class="form-control" name='city' autoComplete='off'
                      value={this.state.city} onChange={this.handleChange}
                      type="text" />
                  </div>
                </div>

                {/* Voivodeship */}
                <div class="form-group">
                  <label class="col-md-3 control-label">Województwo:</label>
                  <div class="col-lg-12">
                    <input className='form-control' name='voivodeship' autoComplete='off'
                      value={this.state.voivodeship} onChange={this.handleChange}
                      type='text' />
                  </div>
                </div>


                {/* Mail */}
                {/* <div class="form-group">
                <label class="col-lg-12 control-label">Mail:</label>
                <div class="col-lg-12">
                  <input class="form-control" name='mail' autoComplete='off'
                    value={this.state.mail} onChange={this.handleChange}
                    type="text" />
                </div>
              </div> */}

                {/* Password */}
                <div class="form-group">
                  <label class="col-lg-12 control-label">Hasło:</label>
                  <div class="col-lg-12">
                    <input class="form-control" name='passw' autoComplete='off'
                      value={this.state.passw} onChange={this.handleChange}
                      type="password" />
                  </div>
                </div>

                {/* Confirm password */}
                <div class="form-group">
                  <label class="col-lg-12 control-label">Potwierdź hasło:</label>
                  <div class="col-lg-12">
                    <input class="form-control" type="password"
                      name='confirm_password' autoComplete='off'
                      value={this.state.confirm_password} onChange={this.handleChange}
                    />
                    <label class="color-red" htmlFor="">{this.state.con_password_message}</label>
                  </div>
                </div>

                {/* Buttons */}
                <div class="form-group">
                  <div class="col-lg-12">
                    <input type="button" class="btn btn-success" value="Zapisz zmiany"
                      onClick={this.handleSubmit} />
                    <span></span>
                    <input type="reset" class="btn btn-danger" value="Wyczyść" />
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>



        <div className="row editProfileRow animated fadeIn mt-2">

          {/* Skills */}
          <div className="col-lg-6">

            <div className="h3 text-center">
              Umiejętności
          </div>

            <ul>
              {skills}
            </ul>

            <h4>
              <i class="fas fa-plus cursor-pointer" data-toggle="collapse" href="#skills"></i>
            </h4>

            <form action="" className="collapse" id="skills">

              {/* Name */}
              <div className="form-group">

                <label htmlFor="skill_name">
                  Nazwa
              </label>

                <input name="skill_name" type="text" className="form-control"
                  value={this.state.skill_name} onChange={this.handleChange} />

              </div>

              {/* Description */}
              <div className="form-group">

                <label htmlFor="skill_description">
                  Opis
              </label>

                <textarea name="skill_description" id="" cols="30" rows="4" className="form-control" wrap="hard"
                  value={this.state.skill_description} onChange={this.handleChange}>
                </textarea>

              </div>

              <div className="form-group">
                <div className="btn btn-success" onClick={this.addSkill}>
                  Dodaj
              </div>
              </div>
            </form>

          </div>

          {/* Packages */}
          <div className="col-lg-6">

            <div className="h3 ">
              Pakiety
          </div>
            <ul>
              {packages}
            </ul>

            <h4>
              <i class="fas fa-plus cursor-pointer" data-toggle="collapse" href="#packages"></i>
            </h4>

            <form action="" className="collapse" id="packages">

              {/* Name */}
              <div className="form-group">

                <label htmlFor="package_name">
                  Nazwa
              </label>

                <input name="package_name" type="text" className="form-control"
                  value={this.state.package_name} onChange={this.handleChange} />

              </div>

              {/* Duration */}
              <div className="form-group">

                <label htmlFor="package_duration">
                  Czas trwania
              </label>

                <input name="package_duration" type="text" className="form-control"
                  value={this.state.package_duration} onChange={this.handleChange} />

              </div>


              {/* Price */}
              <div className="form-group">

                <label htmlFor="package_price">
                  Cena
              </label>
                <input name="package_price" type="number" className="form-control"
                  value={this.state.package_price} onChange={this.handleChange} />

              </div>

              <div className="form-group">
                <div className="btn btn-success"
                  onClick={this.addPackage}>
                  Dodaj
              </div>



              </div>
            </form>

          </div>

        </div>
      </div>);
  }
}

const mapStateToProps = state => {
  return {
    image: state.user.image
  }
}

const mapDispatchToProps = { deleteImage }

const TrainerDataForm = connect(mapStateToProps, mapDispatchToProps)(TrainerForm);

export default TrainerDataForm;