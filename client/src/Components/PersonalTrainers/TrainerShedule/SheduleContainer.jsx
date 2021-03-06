import React, { Component } from 'react';
import DayItem from './DayItem';
import SheduleTrainingsList from './SheduleTrainingsList';
import TrainingDetails from './TrainingDetails';
import NewTraining from './NewTraining/NewTraining';
import { rejects } from 'assert';
import history from '../../../history';
import { deleteTraining } from '../../../services/API/training';

class SheduleContainer extends Component {
    constructor() {
        super();
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();
        let currentDay = currentDate.getDate();

        let februaryDaysCount =
            (currentYear % 4 == 0 && currentYear % 100 != 0 || currentYear % 400 == 0) ? 29 : 28;
        let monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
            'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień']

        this.state = {
            isLoading: true,
            year: currentYear,
            month: currentMonth,
            day: currentDay,
            dow: null,
            monthDaysCount: [31, februaryDaysCount, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            isLeapYear: (currentYear % 4 == 0 && currentYear % 100 != 0 || currentYear % 400 == 0),
            firstAppear: true,
            monthNames: monthNames,
            dayNames: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
            dayItems: [],
            trainingsList: [],
            currentTrainingList: [

            ],
            sheduleListDate: {
                day: currentDay,
                month: monthNames[currentMonth]
            },
            currentTraining: 0,
            currentDayClicked: currentDay
        }
    }

    deleteTraining = async (training_id) => {

        console.log('Training_id (SheduleContainer): ', training_id);

        try {

            let res = await deleteTraining(training_id);

            if (res === 'success') {
                let trainings = this.state.trainingsList;
                let currentTrainingList = this.state.currentTrainingList;

                currentTrainingList = currentTrainingList.filter(t => (t.training_id !== training_id));


                trainings = trainings.filter(t => (t.training_id !== training_id));

                this.setState({
                    trainingsList: [...trainings],
                    currentTrainingList: [...currentTrainingList]
                }, () => {
                    this.renderCalendar();
                })

                return 'success'

            } else {
                throw 'failed'
            }
        } catch (error) {

            console.log(error);

            return 'failed'
        }

    }

    clearCurrentTrainingId = () => {
        this.setState({
            currentTraining: 0
        })
    }

    // EDIT TRAINING
    // ------------------------------------------------------------------------
    editTraining = (training) => {

        console.log('Shedule container - edytuje trening : ', training);


        let trainings = this.state.trainingsList;
        let currentTrainingList = this.state.currentTrainingList;

        // --------------------------------------------------------------------
        trainings = trainings.map(t => {

            if (t.training_id === training.training_id) {

                return Object.assign({}, t, {
                    name: training.name,
                    date: training.date
                })

            } else {
                return t;
            }


        })

        // --------------------------------------------------------------------
        currentTrainingList = currentTrainingList.map(t => {

            if (t.training_id === training.training_id) {

                return Object.assign({}, t, {
                    name: training.name,
                    date: training.date
                })

            } else {
                return t;
            }


        })

        this.setState({
            trainingsList: [...trainings],
            currentTrainingList: [...currentTrainingList]
        }, () => {
            console.log('List treningów: ', this.state.currentTrainingList);

            this.renderCalendar();
        })

    }

    addTraining = (training) => {
        let trainings = this.state.trainingsList;

        trainings.push(training);

        this.setState({
            trainingsList: [...trainings]
        })
    }


    fetchTrainings = () => {

        let id = localStorage.getItem('loggedId');
        let type = localStorage.getItem('type');

        let data = {
            id: id,
            type: type
        }
        fetch("http://localhost:8080/api/trainer/shedule", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin", //

            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then((res) => {
                // Failed
                if (res.response === 'failed') {
                    //  console.log(res);

                    return Promise.reject(res.message);
                }
                // Success
                else {
                    console.log('Odebrane z serwera treningi: ', res);
                    this.setState({
                        trainingsList: res.trainings,
                        isLoading: false
                    })
                }
            })
            .then(() => {
                this.renderCalendar();
            })
            .catch(err => {
                alert('Wystąpił błąd ! Spróbuj ponownie później');
                // console.log(err);

            })
    }
    componentDidMount() {
        this.fetchTrainings();
    }

    showTrainingList = (trainings, dayItem) => {
        // console.log('Dostałem takie treningi: ',trainings);

        let array = this.state.trainingsList.filter(tr => {
            for (var i = 0; i < trainings.length; i++) {
                if (tr.training_id === trainings[i]) {
                    return tr;
                }
            }
        })


        let sheduleListDate = {
            day: dayItem,
            month: this.state.monthNames[this.state.month]
        }

        this.setState({
            currentTrainingList: [...array],
            sheduleListDate: sheduleListDate,
            currentDayClicked: dayItem

        })
        // console.log('Znalazłem takie treningi: ',array)
    }
    renderCalendar = () => {

        // console.log('Renderuje kalendarz :D');

        var items = [];
        let days = document.querySelectorAll('.dayItem');

        for (var ind = 0; ind < 42; ind++) {
            // days[ind].innerHTML='-';
            items.push(<DayItem dayNumber={'-'} />)
        }

        this.setState({
            dayItems: [...items]
        })

        let dow;

        if (this.state.firstAppear) {
            //    console.log('Szukam dnia');
            this.setState({
                firstAppear: false
            })

            let day = this.state.day;
            dow = (new Date()).getDay();
            var i = day;

            for (i; i > 1; i--) {
                if (dow === 0) {
                    dow = 6;
                } else {
                    dow--;
                }

            }

            this.setState({
                dow: dow
            })
        }
        else {
            dow = this.state.dow;
        }

        i = 1;


        let dayOfWeek = dow;


        items = []
        let dates = this.state.trainingsList.map(t => ({ id: t.training_id, date: t.date.split(',')[0] }));
        for (var index = 0; index < 42; index++) {

            if (index < dow || index >= this.state.monthDaysCount[this.state.month] + dow) {
                items.push(<DayItem dayNumber={'-'} dow={-1} isActive={false} />)
            } else {
                let itemDate = `${this.state.year}-${this.state.month + 1 < 10 ? `0${this.state.month + 1}` : this.state.month + 1}-${i < 10 ? `0${i}` : i}`
                let propsTrainings = dates.filter(tr => (tr.date === itemDate))
                let isActive = (i === this.state.currentDayClicked)
                items.push(
                    <DayItem
                        dayNumber={`${i}`}
                        trainings={propsTrainings}
                        showTrainings={this.showTrainingList.bind(this)}
                        dow={dayOfWeek}
                        isActive={isActive}
                    />
                )
                i++;
                if (dayOfWeek === 6) {
                    dayOfWeek = 0;
                }
                else {
                    dayOfWeek++;
                }
            }

        }

        this.setState({
            dayItems: [...items]
        })

    }

    nextMonth = () => {
        // console.log('Zmieniam miesiąc...');

        if (this.state.month === 11) {
            // console.log('Zmieniam też rok...');

            let year = this.state.year + 1;
            let month = 0;
            let dow = (this.state.dow + 3) > 6 ? (this.state.dow + 3) - 7 : (this.state.dow + 3);
            this.setState({
                year: year,
                isLeapYear: (year + 1 % 4 == 0 && year + 1 % 100 != 0 || year + 1 % 400 == 0),
                month: month,
                dow: dow
            }, () => {
                // console.log(this.state);                    
                this.renderCalendar();
            })



        } else {
            let dow;
            let month;
            if (this.state.monthDaysCount[this.state.month] === 31) {
                dow = (this.state.dow + 3) > 6 ? (this.state.dow + 3) - 7 : (this.state.dow + 3);
                month = this.state.month + 1;
            } else if (this.state.monthDaysCount[this.state.month] === 30) {
                dow = (this.state.dow + 2) > 6 ? (this.state.dow + 2) - 7 : (this.state.dow + 2);
                month = this.state.month + 1;
            } else if (this.state.monthDaysCount[this.state.month] === 28) {
                dow = this.state.dow;
                month = this.state.month + 1;
            } else {
                dow = (this.state.dow + 1) > 6 ? (this.state.dow + 1) - 7 : (this.state.dow + 1);
                month = this.state.month + 1;
            }
            this.setState({
                month: month,
                dow: dow
            }, () => {
                // console.log(dow,month);
                this.renderCalendar()
            })
        }
    }

    previousMonth = () => {
        // console.log('Zmieniam miesiąc...');

        if (this.state.month === 0) {
            // console.log('Zmieniam też rok...');

            let year = this.state.year - 1;
            let month = 11;
            let dow = (this.state.dow - 3) < 0 ? (this.state.dow - 3) + 7 : (this.state.dow - 3);
            this.setState({
                year: year,
                isLeapYear: (year + 1 % 4 == 0 && year + 1 % 100 != 0 || year + 1 % 400 == 0),
                month: month,
                dow: dow
            }, () => {
                // console.log(this.state);                    
                this.renderCalendar();
            })



        } else {
            let dow;
            let month;
            if (this.state.monthDaysCount[this.state.month - 1] === 31) {
                dow = (this.state.dow - 3) < 0 ? (this.state.dow - 3) + 7 : (this.state.dow - 3);
                month = this.state.month - 1;
            } else if (this.state.monthDaysCount[this.state.month - 1] === 30) {
                dow = (this.state.dow - 2) < 0 ? (this.state.dow - 2) + 7 : (this.state.dow - 2);
                month = this.state.month - 1;
            } else if (this.state.monthDaysCount[this.state.month - 1] === 28) {
                dow = this.state.dow;
                month = this.state.month - 1;
            } else {
                dow = (this.state.dow - 1) < 0 ? (this.state.dow - 1) + 7 : (this.state.dow - 1);
                month = this.state.month + 1;
            }
            this.setState({
                month: month,
                dow: dow
            }, () => {
                // console.log(dow,month);
                this.renderCalendar()
            })
        }
    }

    showNewTrainingContainer = () => {
        let container = document.querySelector('.newTrainingContainer');
        container.classList.remove('zoomOut');
        container.classList.remove('invisible');
        container.classList.add('zoomIn');
        // console.log('Pokazuje kontener');


    }

    showDetails = (training_id) => {
        document.querySelector('.trainingDetails').classList.remove('zoomOut');
        document.querySelector('.trainingDetails').classList.remove('invisible');
        document.querySelector('.trainingDetails').classList.add('zoomIn');

        let id = training_id;
        // console.log('Dostaje takie id: ',id);

        this.setState({
            currentTraining: id
        }, () => {
            // console.log('Nowy state',this.state);

        })
    }
    render() {
        const user_type = localStorage.getItem('type');
        console.log('Typ użytkownika to : ', user_type);


        const loader = <div class="loaderContainer">
            <div class="loader">
            </div>
            <div class="loaderInner">
            </div>
            <div class="loaderInnerSmall">
            </div>
        </div>

        // console.log('Renderuje shedule container...');

        let list = <SheduleTrainingsList
            showDetails={this.showDetails.bind(this)}
            trainingsList={this.state.currentTrainingList}
        />
        let details = <TrainingDetails
            training_id={this.state.currentTraining}
            deleteTraining={this.deleteTraining}
            clear={this.clearCurrentTrainingId}
        />
        return (
            <div className="topicsContent">
                <div className="sheduleContainer animated fadeIn">



                    <div className="listContainer">

                        <div className="listHeader">
                            <b>{this.state.sheduleListDate.day}</b> : {this.state.sheduleListDate.month}
                        </div>
                        <div className="listTitle">
                            Zaplanowane treningi
                        </div>

                        {
                            user_type == 'trainer' &&
                            <div className="addTrainingButton" onClick={this.showNewTrainingContainer}>
                                Dodaj trening <i className="fas fa-plus"></i>
                            </div>
                        }

                        {/* <center>{this.state.isLoading && loader}</center>  */}
                        {list}
                    </div>

                    <div className="calendarContainer">
                        {details}

                        {
                            user_type == 'trainer' &&
                            <NewTraining
                                fetchTrainings={this.fetchTrainings.bind(this)}
                                addTraining={this.addTraining}
                                editTraining={this.editTraining}
                            />
                        }

                        <div className="calendarContainerHeader">

                            <div className="previousMonth" onClick={this.previousMonth}><i class="fas fa-angle-left"></i></div>
                            <div className="currentMonth">{this.state.monthNames[this.state.month]}</div>
                            <div className="nextMonth" onClick={this.nextMonth}><i class="fas fa-angle-right"></i></div>

                            <div className="year">{this.state.year}</div>
                            <div className="checkoutCurrentDay"></div>
                        </div>

                        <div className="calendar">

                            <div className="calendarHeader">
                                <div className="dayTitle">Nd</div>
                                <div className="dayTitle">Pon</div>
                                <div className="dayTitle">Wt</div>
                                <div className="dayTitle">Śr</div>
                                <div className="dayTitle">Czw</div>
                                <div className="dayTitle">Pt</div>
                                <div className="dayTitle">Sob</div>
                            </div>
                            <div className="calendarBody">
                                {/* <center>{this.state.isLoading && loader}</center> */}
                                {this.state.dayItems}
                            </div>
                        </div>

                    </div>


                </div>
                <center>{this.state.isLoading && loader}</center>
            </div>
        );
    }
}

export default SheduleContainer;