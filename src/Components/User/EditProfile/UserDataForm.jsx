import React, { Component } from 'react';
import { copyFile } from 'fs';
class UserDataForm extends Component {
  state = {
    first_name: '',
    last_name: '',
    login: '',
    passw: '',
    confirm_password: '',
    con_password_message: '',
    email: '',
    height: '',
    mass: '',
    favourite_exercise: '',
    phone_number: ''
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
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
            email: s.email,
            height: s.height,
            mass: s.mass,
            favourite_exercise: s.favourite_exercise,
            phone_number: s.phone_number
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
  componentDidMount() {
    let d = this.props.data;
    this.setState({
      first_name: d.first_name,
      last_name: d.last_name,
      login: d.login,
      passw: d.passw,
      confirm_password: d.passw,
      email: d.email,
      height: d.height,
      mass: d.mass,
      favourite_exercise: d.favourite_exercise,
      phone_number: d.phone_number
    })
  }

  render() {
    return (<div>
      <div class="container-fluid">
        <div class="row editProfileRow animated fadeIn">
          {/* User avatar */}
          <div className="col-lg-4">

            <div className="userAvatar">
              <i className="fas fa-user"></i>
            </div>

            <label for='userAvatar'>Dodaj zdjęcie</label>
            <input type='file' name='userAvatar' />

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
              {/* Height */}
              <div class="form-group">
                <label class="col-lg-12 control-label">Wzrost:</label>
                <div class="col-lg-12">
                  <input class="form-control" name='height' autoComplete='off'
                    value={this.state.height} onChange={this.handleChange}
                    type="text" />
                </div>
              </div>

              {/* Mass */}
              <div class="form-group">
                <label class="col-md-3 control-label">Masa:</label>
                <div class="col-lg-12">
                  <input className='form-control' name='mass' autoComplete='off'
                    value={this.state.mass} onChange={this.handleChange}
                    type='text' />
                </div>
              </div>

              {/* Favourite exercise */}
              <div class="form-group">
                <label class="col-lg-12 control-label">Ulubione ćwiczenie:</label>
                <div class="col-lg-12">
                  <input class="form-control" name='favourite_exercise'
                    autoComplete='off'
                    value={this.state.favourite_exercise}
                    onChange={this.handleChange}
                    type="text" />
                </div>
              </div>

              {/* Mail */}
              <div class="form-group">
                <label class="col-lg-12 control-label">Mail:</label>
                <div class="col-lg-12">
                  <input class="form-control" name='email' autoComplete='off'
                    value={this.state.email} onChange={this.handleChange}
                    type="text" />
                </div>
              </div>

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
                <label class="col-lg-12 control-label"></label>
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
    </div>);
  }
}

export default UserDataForm;