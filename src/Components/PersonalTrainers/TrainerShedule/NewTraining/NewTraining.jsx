import React, { Component } from 'react';
import GymList from './GymList/GymList'
import UserList from './UserList/UserList'
import { parse } from 'path';
import { connect } from 'react-redux';
import { editModeDisabled } from '../../../../Actions/trainings';
import {editTraining} from '../../../../services/API/training';

const default_state = {
    training_name: '',
    duration: '0',
    price: '0',
    date: '',
    hour: '',
    description: '',
    user_name: '',
    gym_name: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    weeks: [false, false, false, false, false, false, false],
    howManyWeeks: 1,
    howManyTrainings: 1,
    priceSum: '0',
    dates: [],
    packages: [],
    gyms: [],
    gym_id: null,
    users: [],
    user_id: null
}

class NewTrainingContainer extends Component {

    constructor() {
        super();
    }
    state = {
        daysOfMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        training_name: '',
        duration: '0',
        price: '0',
        date: '',
        hour: '',
        description: '',
        user_name: '',
        gym_name: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        weeks: [false, false, false, false, false, false, false],
        howManyWeeks: 1,
        howManyTrainings: 0,
        priceSum: '0',
        dates: [],
        packages: [],
        gyms: [],
        gym_id: null,
        users: [],
        user_id: null
    }

   componentDidUpdate = (prev) => {

       if((prev.editMode !== this.props.editMode) && this.props.editMode === true){
        console.log('Propsy w newTraining (UPDATE): ',this.props);

        
        
        if(this.props.editMode){
            let data = this.props.training;
            let date = data.date.slice(0,10);
            let hour = data.date.slice(11,16);

            this.setState({
                training_name : data.name,
                duration : data.duration,
                price : data.prize,
                date : date,
                hour : hour,
                description : data.note,
                gym_name : data.gym_name,
                user_name : data.user_name,
                phone_number : data.phone_number
            })
        }
       }
    }

    componentDidMount() {

        console.log('Propsy w newTraining (Mount): ',this.props);
        

        if(this.props.editMode){
            let data = this.props.training;

            this.setState({
                training_name : data.training_name,
                duration : data.duration,
                price : data.price,
                date : data.date,
                hour : data.hour,
                description : data.description,
                gym_name : data.gym_name,
                user_name : data.user_name,
                phone_number : data.phone_number
            })
        }

        let id = localStorage.getItem('loggedId');
        console.log('Trainer id', id);
        console.log(this.props);


        fetch(`http://localhost:8080/api/trainer/packages/${id}`)
            .then(res => res.json())
            .then(res => {
                console.log('Pakiety: ', res);
                if (res.response === 'success') {


                    this.setState({
                        packages: res.packages
                    })
                }
                else {
                    return Promise.reject();
                }
            })
            .catch(err => {

            })
    }
    // Hide new training panel
    hide = () => {
        let container = document.querySelector('.newTrainingContainer');
        container.classList.remove('zoomIn');
        container.classList.add('zoomOut');
        this.props.editModeDisabled();


        setTimeout(() => {
            container.classList.add('invisible');
            this.clearForm();
        }, 500)


    }

    // Check id chosen year is leap
    checkYear(year) {
        let days = this.state.daysOfMonth;

        if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
            days[1] = 29;
        }

        this.setState({
            daysOfMonth: [...days]
        })
    }

    // Handle input change
    handleChange = (e) => {
        let value = e.target.value;
        let name = e.target.name;

        this.setState({
            [e.target.name]: value
        }, () => {
            console.log(this.state.price);

            if (name === 'price' ||
                name === 'howManyWeeks' ||
                name == 'date') {

                this.countTraining();
                if (name = 'date') {
                    let year = parseInt(value.split('')[2]);
                    this.checkYear(year);
                }
            }

            if (name === 'gym_name') {
                this.checkForGyms();
                if (this.state.gyms.length > 0 && this.state.gym_name.length > 0) {
                    this.showGyms();
                }
                else {
                    this.hideGyms();
                }
            }

            if (name === 'user_name') {

                let array = this.state.user_name.split(' ');
                if (array.length === 1) {
                    this.setState({
                        first_name: array[0],
                        last_name: ''
                    }, () => {
                        this.checkForUsers();
                    })
                } else if (array.length === 1) {
                    this.setState({
                        first_name: array[0],
                        last_name: array[1]
                    }, () => {
                        this.checkForUsers();
                    })
                }

                if (this.state.users.length > 0 && this.state.user_name.length > 0) {
                    this.showUsers();
                }
                else {
                    this.hideUsers();
                }



            }
        });
    }

    // Show gyms prompt
    showGyms = () => {
        if (this.state.gym_name.length > 0 && this.state.gym_name !== ' ') {
            let div = document.querySelector('.selectedGymsContainer');
            div.classList.remove('invisible');
        }

    }

    // Hide gyms prompt
    hideGyms = () => {
        let div = document.querySelector('.selectedGymsContainer');
        div.classList.add('invisible');
    }

    showUsers = () => {
        let div = document.querySelector('.selectedUsersContainer');
        div.classList.remove('invisible');

    }

    hideUsers = () => {
        let div = document.querySelector('.selectedUsersContainer');
        div.classList.add('invisible');
    }

    chooseGym = (id, name) => {
        this.setState({
            gym_id: id,
            gym_name: name
        });

        this.hideGyms();
    }

    chooseUser = (id, name, phone_number) => {
        console.log(id);


        this.setState({
            user_id: id,
            user_name: name,
            phone_number: phone_number,
            first_name: name.split(' ')[0],
            last_name: name.split(' ')[1]
        });

        this.hideUsers();
    }



    // Handle weeks checkboxes change
    // Dow : day of week
    checkDow = (e) => {
        let index;
        let value;
        let weeks = this.state.weeks;

        switch (e.target.name) {
            case 'mon':
                index = 0;
                break;

            case 'tue':
                index = 1;
                break;
            case 'wed':
                index = 2;
                break;

            case 'thu':
                index = 3;
                break;
            case 'fri':
                index = 4;
                break;
            case 'sat':
                index = 5;
                break;
            case 'sun':
                index = 6;
                break;
        }

        value = e.target.checked ? true : false;
        weeks[index] = value;

        this.setState({
            weeks: [...weeks]
        }, () => {
            console.log(this.state.weeks);
            this.countTraining();
        })

    }

    // Count trainings
    // Get training price and weeks sum to repeat
    // Return training counts and total price for trainings
    countTraining = () => {

        // Declarations
        let isChecked = false;
        let i;
        let firstDayInArray;
        let howManyTrainings = 1;
        let isFirstLoop = true;
        let sumCount = 0;

        // Check if some days are chosen
        for (i in this.state.weeks) {
            if (this.state.weeks[i]) {
                isChecked = true;

            }
        }

        if (isChecked === false) {
            // If not
            this.setState({
                howManyTrainings: 1,
                priceSum: this.state.price
            })

        } else if (isChecked && this.state.date.length > 1) {
            // Check day of week of chosen date
            let weeks = parseInt(this.state.howManyWeeks);
            let dow = (new Date(this.state.date).getDay())
            console.log('Dzień tygodnia to : ', dow);

            // Check which day of week is first ckecked
            for (let index = 0; index < this.state.weeks.length; index++) {
                const element = this.state.weeks[index];
                if (element) {
                    firstDayInArray = index;
                    break;
                }
            }

            // Calculate training counts
            // Start with chosen date and check every item in weeks array
            for (let weekCount = 0; weekCount < parseInt(this.state.howManyWeeks); weekCount++) {
                console.log("Nr tygodnia: ", weekCount);

                if (isFirstLoop) {
                    console.log('Pierwsze przejście...');

                    for (let index = dow; index < this.state.weeks.length; index++) {
                        const element = this.state.weeks[index];
                        if (element) {
                            console.log('Dodaje trening');

                            howManyTrainings++;
                        }
                    }

                    isFirstLoop = false;
                } else {
                    console.log('Kolejne przejście', weekCount);

                    for (let i in this.state.weeks) {
                        if (this.state.weeks[i]) {
                            howManyTrainings++;
                            console.log('Dodaje trening');
                        }
                    }
                }
            }
            console.log(howManyTrainings);

            sumCount = howManyTrainings * parseInt(this.state.price);


            this.setState({
                howManyTrainings: howManyTrainings,
                priceSum: sumCount
            })
        }
    }

    // Check available trainer packages to prompt about price and duration
    checkPackages = () => {
        for (let index = 0; index < this.state.packages.length; index++) {
            const element = this.state.packages[index];
            if (element.name === this.state.training_name) {
                this.setState({
                    duration: element.duration,
                    price: element.price
                }, () => {
                    this.countTraining();
                })
            }

        }

    }

    // Fetch gym list whcich name is similar to input
    checkForGyms = () => {

        let data = {
            gym_name: this.state.gym_name
        }
        if (this.state.gym_name.length > 0 && this.state.gym_name !== ' ') {
            fetch("http://localhost:8080/api/trainer/selected_gyms", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin", //

                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json())
                .then((res) => {
                    console.log(res);

                    if (res.gyms.length === 0) {
                        this.hideGyms();
                    }
                    this.setState({
                        gyms: res.gyms
                    })
                }).catch(err => {

                });
        }
    }

    // Search for users whose first and last name is similar to input
    checkForUsers = () => {

        let data = {
            first_name: this.state.first_name,
            last_name: this.state.last_name
        }
        fetch("http://localhost:8080/api/trainer/selected_users", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin", //

            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then((res) => {
                console.log(res);

                if (res.users.length === 0) {

                }
                this.setState({
                    users: res.users
                })
            }).catch(err => {

            });
    }

    // Generate dates based on checked days to repeat and number of weeks
    generateDates = () => {

        return new Promise((resolve, reject) => {
            let arrayDate = this.state.date.split('-');

            let date = {
                day: parseInt(arrayDate[2]),
                month: parseInt(arrayDate[1]),
                year: parseInt(arrayDate[0])
            }

            let dow = (new Date(this.state.date).getDay());
            let weeks = this.state.weeks;
            let howManyWeeks = this.state.howManyWeeks;

            let dates = [];

            // Go through array weeks "howManyWeeks" times
            // In every iteration check wchich day of week is checked
            // If is checked then create a date and push to dates array
            // First iteration will start checking from number of day from chosen date
            for (let i = 0; i < howManyWeeks; i++) {

                let j;
                if (i === 0) {
                    j = dow;
                } else {
                    j = 1;
                }

                for (j; j <= weeks.length; j++) {
                    const element = weeks[j - 1];

                    if (element || (i == 0 && j == dow)) {
                        console.log('Dodaje date...');
                        dates.push(`${date.year}-${this.zeroesInDate(date.month)}-${this.zeroesInDate(date.day)},${this.state.hour}`);
                    }
                    date = this.incrementDate(date, this.state.daysOfMonth);

                }
            }

            this.setState({
                dates: [...dates]
            }, () => {
                resolve('Ready');
            })

        });

    }

    zeroesInDate = (number) => {
        if (number < 10) {
            return '0' + number
        }
        else {
            return number
        }
    }

    incrementDate = (date, daysOfMonth) => {

        let newDate = {
            day: '',
            month: '',
            year: ''
        }

        // Check if day is the last day of curent month
        if (parseInt(date.day) === daysOfMonth[parseInt(date.month) - 1]) {
            newDate = Object.assign({}, newDate,
                {
                    day: 1
                }
            );
            // Check if it is a december
            if (date.month === 12) {
                // New month is 1 and year ++
                let year = parseInt(date.year) + 1;

                newDate = Object.assign({}, newDate,
                    {
                        month: 1,
                        year: year
                    });
                this.checkYear(year);
            } else {
                // Yeas is the same and month ++
                let month = parseInt(date.month) + 1;

                newDate = Object.assign({}, newDate,
                    {
                        month: month,
                        year: date.year
                    });
            }

        } else {
            let day = parseInt(date.day) + 1;

            newDate = Object.assign({}, newDate,
                {
                    day: day,
                    month: date.month,
                    year: date.year
                });
        }



        return newDate;
    }
    // Add training
    addTraining = async () => {

        if (this.props.editMode) {

        }
        else {
            let trainer_id = localStorage.getItem('loggedId');
            this.generateDates()
                .then(res => {
                    let s = this.state;
                    let data = {
                        training_name: s.training_name,
                        trainer_id: trainer_id,
                        duration: s.duration,
                        price: s.price,
                        date: s.date,
                        hour: s.hour,
                        description: s.description,
                        user_name: s.user_name,
                        gym_name: s.gym_name,
                        first_name: s.first_name,
                        last_name: s.last_name,
                        phone_number: s.phone_number,
                        dates: s.dates,
                        gym_id: s.gym_id,
                        user_id: s.user_id
                    }

                    console.log('Takie dane wysyłan na serwer: ', data);


                    fetch("http://localhost:8080/api/trainers/new-training", {
                        method: "POST",
                        mode: "cors",
                        cache: "no-cache",
                        credentials: "same-origin", //

                        body: JSON.stringify(data),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(response => response.json())
                        .then(res => {
                            console.log(res);
                            this.hide();
                            window.location.reload();

                        })
                        .catch(err => {
                            alert('Wystąpił błąd, spróbuj ponownie później !')
                            console.log(err);

                        });
                })

        }



    }

    // Clear form
    clearForm = () => {
        let newState = Object.assign({}, this.state, default_state);
        this.setState(newState);
        this.setState({
            weeks: [false, false, false, false, false, false, false]
        })
    }

    editTraining = async () => {

        try {

            let training = this.state;

            let data = {
                training_id : this.props.training.training_id,
                training_name : training.training_name,
                duration : training.duration,
                price : parseInt(training.price),
                date : training.date + ',' + training.hour,
                description : training.description,
                gym_name : training.gym_name,
                user_name : training.user_name
            }
            
            let res = await editTraining(data);

            if(res === 'success') {
                this.props.editModeDisabled();
                this.props.editTraining({
                    training_id : this.props.training.training_id,
                    date : training.date + ',' + training.hour,
                    name : training.training_name

                });
                this.hide();
            }  else {
                throw 'failed'
            }

        } catch (error) {
            console.log(error);
            
            alert('Wystąpił błąd, spróbuj ponownie później !')

        }

    }



    // Render
    // -------------------------------------------------------------------------------------------- 
    render() {
        return (
            // Container
            <div className="newTrainingContainer invisible animated zoomOut">
                {/* Header */}
                <div className="newTrainingHeader">
                    {/* Title */}
                    <div className="newTrainingTittle">
                        {
                            this.props.editMode ? 'Edycja treningu' : 'Nowy trening'
                        }
                    </div>
                    {/* Hide container */}
                    <div className="hideTrainingDetails" onClick={this.hide} >
                        <i class="fas fa-times"></i>
                    </div>
                </div>

                {/* Form */}
                <form className="newTrainingForm">
                    {/* Training Data */}
                    <div className="primaryData">
                        {/* Training name */}
                        <div className="form-group">
                            <label htmlFor="training_name">Rodzaj treningu</label>
                            <input className="form-control" type="text" name="training_name"
                                onChange={this.handleChange} value={this.state.training_name}
                                onBlur={this.checkPackages} />
                        </div>
                        {/* Duration and prize */}
                        <div className="form-group durationPrice">
                            {/* Duration */}
                            <div className="trainingDurationForm">
                                <label htmlFor="duration">Czas trwania</label>
                                <input name="duration" type="text" className="form-control"
                                    value={this.state.duration} onChange={this.handleChange} />
                            </div>

                            {/* Price */}
                            <div className="trainingPrize">
                                <label htmlFor="price">Do zapłaty</label>
                                <input name="price" type="text" className="form-control"
                                    value={this.state.price} onChange={this.handleChange} />
                            </div>
                        </div>
                        {/* Date and hour */}
                        <div className="form-group trainingFullDate">
                            {/* Date */}
                            <div className="trainingDate">
                                <label htmlFor="date">Data</label>
                                <input type="date" className="form-control" name="date"
                                    onChange={this.handleChange} value={this.state.date} />
                            </div>

                            {/* Hour */}
                            <div className="trainingTime">
                                <label htmlFor="hour">Godzina</label>
                                <input type="time" className="form-control" name="hour"
                                    onChange={this.handleChange} value={this.state.hour} />
                            </div>
                        </div>
                        {/* Description */}
                        <div className="form-group">
                            <label htmlFor="description">Notatka</label>
                            <textarea id="" cols="30" rows="7"
                                className="form-control" name="description"
                                onChange={this.handleChange} value={this.state.description}>
                            </textarea>
                        </div>
                        {/* Buttons */}
                        <div className="form-group button-group newTrainingButtons">
                            {/* Add training */}
                            {
                                this.props.editMode ? 
                                <div className="btn btn-success" onClick={this.editTraining}>
                                    Zapisz
                                </div> :
                                <div className="btn btn-success" onClick={this.addTraining}>
                                     Dodaj
                                 </div>
                            }
                            {/* Clear form */}
                            <div className="btn btn-danger" onClick={this.clearForm}>
                                Wyczyść
                            </div>
                        </div>

                    </div>
                    {/* Details */}
                    <div className="details">
                        {/* ------------------------------------------------------------- */}
                        {/* Gym Name */}
                        <div className="form-group gymFormGroup">
                            <label htmlFor="gym_name">Gdzie ?</label>
                            <input type="text" name="gym_name" className="form-control" autoComplete="off"
                                onChange={this.handleChange} value={this.state.gym_name} />
                            <GymList
                                gyms={this.state.gyms}
                                choose={this.chooseGym} />
                        </div>

                        {/* User name */}
                        <div className="form-group gymFormGroup">
                            <label htmlFor="user_name">Z kim ?</label>
                            <input type="text" name="user_name" className="form-control" autoComplete="off"
                                onChange={this.handleChange} value={this.state.user_name} />

                            <UserList
                                users={this.state.users}
                                choose={this.chooseUser}
                            />

                        </div>
                        {/* Phone number */}
                        <div className="form-group">
                            <label htmlFor="phone_number">Nr telefonu</label>
                            <input name="phone_number" type="text" className="form-control"
                                value={this.state.phone_number} onChange={this.handleChange} />
                        </div>


                        {/* Choose days */}
                        <label></label>
                        {
                            !this.props.editMode && 
                            <div className="form-group">
                                <div className="btn btn-primary"
                                    data-toggle="collapse"
                                    data-target="#repeatContainer"
                                    onClick={this.countTraining}>
                                    Powtórz trening
                                </div>
                            </div>
                        }

                        <div className="repeatContainer collapse" id="repeatContainer">
                            {/* ------------------------------------------------------------- */}
                            {/* Days */}
                            <div className="form-group daysToRepeat">

                                <div className="form-group">
                                    <label>Pon</label>
                                    <input type="checkbox" name="mon"
                                        onChange={this.checkDow} value={this.state.weeks[0]}
                                        checked={this.state.weeks[0]} />
                                </div>

                                <div className="form-group">
                                    <label>Wt</label>
                                    <input type="checkbox" name="tue"
                                        onChange={this.checkDow} value={this.state.weeks[1]}
                                        checked={this.state.weeks[1]} />
                                </div>

                                <div className="form-group">
                                    <label>Śr</label>
                                    <input type="checkbox" name="wed"
                                        onChange={this.checkDow} value={this.state.weeks[2]}
                                        checked={this.state.weeks[2]} />
                                </div>

                                <div className="form-group">
                                    <label>Czw</label>
                                    <input type="checkbox" name="thu"
                                        onChange={this.checkDow} value={this.state.weeks[3]}
                                        checked={this.state.weeks[3]} />
                                </div>

                                <div className="form-group">
                                    <label>Pt</label>
                                    <input type="checkbox" name="fri"
                                        onChange={this.checkDow} value={this.state.weeks[4]}
                                        checked={this.state.weeks[4]} />
                                </div>

                                <div className="form-group">
                                    <label>Sob</label>
                                    <input type="checkbox" name="sat"
                                        onChange={this.checkDow} value={this.state.weeks[5]}
                                        checked={this.state.weeks[5]} />
                                </div>

                                <div className="form-group">
                                    <label>Nd</label>
                                    <input type="checkbox" name="sun"
                                        onChange={this.checkDow} value={this.state.weeks[6]}
                                        checked={this.state.weeks[6]} />
                                </div>
                            </div>

                            {/* Weeks counter */}
                            <div className="chooseWeeks">
                                <label htmlFor="howManyWeeks">Ile tygodni</label>
                                <input name="howManyWeeks" type="number" className="form-control" min="1"
                                    value={this.state.howManyWeeks} onChange={this.handleChange} />
                            </div>
                            <div className="form-group weeksCounter">


                                <div className="trainingCounters">
                                    <label> Treningów </label>
                                    <input type="text" value={this.state.howManyTrainings}
                                        value={this.state.howManyTrainings} />
                                </div>

                                <div className="priceSum">
                                    <label>Suma za treningi</label>
                                    <input type="text" value={`${this.state.priceSum}zł`} />
                                </div>
                            </div>
                        </div>

                    </div>
                </form>

            </div>);
    }
}

const mapStateToProps = (state) => {
    return {
        editMode: state.trainings.editMode,
        training : state.trainings.currentTraining
    }
}

const mapDispatchToProps = { editModeDisabled }

const NewTraining = connect(mapStateToProps, mapDispatchToProps)(NewTrainingContainer);

export default NewTraining;