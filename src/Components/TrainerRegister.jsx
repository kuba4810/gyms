import React, { Component } from 'react';
import {createTrainer} from '../services/API/trainers';

class TrainerRegister extends Component {

    state = {
        login: '',
        passw: '',
        mail: '',
        description: '',
        package_name: '',
        package_price: '',
        package_duration: '',
        skill_name: '',
        skill_description: '',
        packages: [],
        skills: []
    }

    // Handle change
    // ------------------------------------------------------------------------
    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    // Add package
    // ------------------------------------------------------------------------
    addPackage = () => {

        let packages = this.state.packages;

        if (this.state.package_name.length > 0 &&
            this.state.package_price.length > 0 &&
            this.state.package_duration.length > 0) {

            let p = {
                name: this.state.package_name,
                price: this.state.package_price,
                duration: this.state.package_duration
            }

            packages.push(p);

            this.setState({
                packages: [...packages],
                package_name: '',
                package_price: '',
                package_duration: ''

            })
        }
    }

    // Add skill 
    // ------------------------------------------------------------------------

    addSkill = () => {

        console.log(this.state);


        if (true) {

            let skills = this.state.skills;

            let skill = {
                name: this.state.skill_name,
                description: this.state.skill_description
            }

            skills.push(skill);

            this.setState({
                skills: [...skills],
                skill_name: '',
                skill_description: ''
            })
        }
    }


    // Register
    // ------------------------------------------------------------------------

    register = async () => {
        
        let confirRes = true;

        if(this.state.packages.length === 0){
            confirRes = window.confirm(`
            Nie dodałeś żadnego pakietu. 
            Jesteś pewien czy chcesz kontynuować ?
            Swoje pakiety możesz później edytować w widoku profilu`)
        }

        if(!confirRes){
            return 0;
        }

        if(this.state.skills.length === 0){
            confirRes = window.confirm(`
            Nie dodałeś żadnych umiejętniści. 
            Jesteś pewien czy chcesz kontynuować ?
            Swoje umiejętności możesz później edytować w widoku profilu`)
        }


        if(!confirRes){
            return 0;
        }

        console.log('Przygotowuje obiekt');
        

        let data = {
            trainer : {
                "first_name" : "",
                "last_name" : "",
                "city" : "",
                "voivodeship" : "brak",
                "login" : this.state.login,
                "passw" : this.state.passw,
                "mail" : this.state.mail
            },
            packages : [...this.state.packages],
            skills : [...this.state.skills]
        }

        console.log('Dane do wysłania : ',data);
        

        // Execute function from API
        let res = await createTrainer(data);

        if(res === 'success'){
            alert(`Rejestracja przebiegła pomyślnie !
                   Możesz się zalogować`);
        } else {
            alert(`Wystąpił błąd, spróbuj ponownie później !`);
        }

        

    }


    render() {

        // Create packages list
        let packages = this.state.packages.map((p, index) => (
            <li key={index} >
                <i class="fas fa-check mr-2"></i>
                <b> {p.name}</b>,
                {p.price} zł,
                {p.duration}
            </li>
        ))


        // Create packages list
        let skills = this.state.skills.map((skill, index) => (
            <li key={index} >
                <i class="fas fa-check mr-2"></i>
                <b>{skill.name}</b>,
                {skill.description.slice(0, 50)}...
             </li>
        ))



        return (
            <div className="trainerRegister bg-secondary m-0">


                {/* Row */}
                <div className="row">

                    {/* Col */}
                    <div className="col-lg-6 col-md-8 col-sm-10 ml-auto mr-auto pt-5 pb-5">

                        {/* Form */}
                        <form action="javascript:(void);"
                            className="bg-light text-dark p-3">

                            {/* Legend */}
                            <legend>
                                <h1 className="text-danger">Rejestracja trenera</h1>
                                <hr />
                            </legend>


                            {/* Login */}
                            <div className="form-group">
                                <label htmlFor="login"> Login * </label>
                                <input name="login" type="text" className="form-control"
                                    autoComplete="off"
                                    value={this.state.login}
                                    onChange={this.handleChange} />
                            </div>

                            {/* E-mal */}
                            <div className="form-group">
                                <label htmlFor="mail"> Adres E-mail * </label>
                                <input name="mail" type="mail" className="form-control"
                                    autoComplete="off"
                                    value={this.state.mail}
                                    onChange={this.handleChange} />
                            </div>

                            {/* Password */}
                            <div className="form-group">
                                <label htmlFor="passw"> Hasło * </label>
                                <input name="passw" type="password" className="form-control"
                                    autoComplete="off"
                                    value={this.state.passw}
                                    onChange={this.handleChange} />
                            </div>


                            {/* Description */}
                            <div className="form-group">
                                <label htmlFor="description"> O mnie </label>
                                <textarea className="form-control text-dark"
                                    name="description" cols="30" rows="5"
                                    value={this.state.description}
                                    onChange={this.handleChange}>
                                </textarea>
                            </div>




                            {/* Packages */}
                            {/* -------------------------------------------------------------------- */}

                            <h3 className="text-danger">Oferta</h3>

                            <ul className="pt-3 pb-3">

                                {packages}

                            </ul>

                            <div
                                className="registerTrainerPackages d-flex justify-content-between">

                                <div className="form-group">
                                    {/* Name */}
                                    <label htmlFor="package_name">Nazwa pakietu</label>
                                    <input name="package_name" type="text" className="form-control"
                                        value={this.state.package_name} onChange={this.handleChange} />
                                </div>

                                <div className="form-group">
                                    {/* Name */}
                                    <label htmlFor="package_price">Cena</label>
                                    <input name="package_price" type="number" className="form-control"
                                        value={this.state.package_price} onChange={this.handleChange} />
                                </div>

                                <div className="form-group">
                                    {/* Duration */}
                                    <label htmlFor="package_duration">Czas trwania</label>
                                    <input name="package_duration" type="text" className="form-control"
                                        value={this.state.package_duration} onChange={this.handleChange} />
                                </div>

                                <div className="form-group d-flex align-items-end">

                                    <button className="btn btn-success"
                                        onClick={this.addPackage}>
                                        Dodaj
                                    </button>
                                </div>
                            </div>

                            {/* Skills */}
                            {/* -------------------------------------------------------------------- */}
                            <ul className="pt-3 pb-3">

                                {skills}

                            </ul>

                            <h3 className="text-danger">Umiejętności</h3>
                            <div className="registerTrainerSkills ">

                                <div className="form-group">

                                    {/* Name */}
                                    <label htmlFor="skill_name">Nazwa</label>
                                    <input name="skill_name" type="text" className="form-control"
                                        value={this.state.skill_name}
                                        onChange={this.handleChange} />

                                    {/* Description */}
                                    <label htmlFor="skill_description">Opis</label>
                                    <textarea className="form-control text-dark"
                                        name="skill_description" cols="30" rows="5"
                                        value={this.state.skill_description}
                                        onChange={this.handleChange}>
                                    </textarea>

                                </div>


                                <div className="form-group">

                                    <div className="btn btn-success"
                                        onClick={this.addSkill}>
                                        Dodaj
                                    </div>

                                </div>

                            </div>



                            <div className="form-group">

                                <div className="btn btn-danger form-control "
                                    onClick={this.register}>
                                    Rejestracja
                                </div>

                            </div>

                        </form>
                    </div>

                </div>

            </div>
        );
    }
}

export default TrainerRegister;