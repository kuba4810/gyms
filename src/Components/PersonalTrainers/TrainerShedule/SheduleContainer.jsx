import React, { Component } from 'react'; 
import DayItem from './DayItem'  
class SheduleContainer extends Component {
    constructor(){
        super();
        console.log('Pracuje konstruktor ...');
        
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();
        let currentDay = currentDate.getDate();

        let februaryDaysCount = 
           (currentYear % 4 == 0 && currentYear % 100 != 0 || currentYear % 400 == 0) ? 29 : 28;

        
        this.state = {
            year : currentYear,
            month : currentMonth,
            day : currentDay,            
            dow: null,
            monthDaysCount : [31,februaryDaysCount,31,30,31,30,31,31,30,31,30,31],
            isLeapYear :  (currentYear % 4 == 0 && currentYear % 100 != 0 || currentYear % 400 == 0),
            firstAppear : true,
            monthNames : ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec',
                          'Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'],
            dayNames : ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota'],
            dayItems :[]
        }
    }

    componentDidMount(){
        this.renderCalendar();
        console.log('State: ',this.state);
        
        console.log('Dzień tygodnia: ',(new Date()).getDay())
    }

    renderCalendar = () => {
        console.log('Renderuje kalendarz :D');
        
        var items = [];
        let days = document.querySelectorAll('.dayItem');

        for(var ind=0; ind<42; ind++){
            // days[ind].innerHTML='-';
            items.push( <DayItem dayNumber={'-'} /> )
        }

        this.setState({
            dayItems : [...items]
        })

        let dow;

       if(this.state.firstAppear){
           console.log('Szukam dnia');
           this.setState({
               firstAppear:false
           })
           
          let day = this.state.day;
          dow= (new Date()).getDay();
          var i=day;

            for(i;i>1;i--){
                if(dow === 0)
                {
                    dow = 6;
                }else{
                    dow--;
                }
                
            }

           console.log('Pierwszy dzień miesiąca to : ',dow);

            this.setState({
                dow: dow
            })
        }
        else{
            dow = this.state.dow;
        }
      
        i=1;        
      /*   for(var index=dow; index < this.state.monthDaysCount[this.state.month]+dow ; index++ ){           
            
            days[index].innerHTML = i;
            i++;
        } */

        items = []
        for(var index=0; index < 42 ; index++ ){           
            
            if(index < dow || index >= this.state.monthDaysCount[this.state.month]+dow ){
                items.push( <DayItem dayNumber={'-'} />)
            }else{
                items.push( <DayItem dayNumber={`${i}`} />)
                i++;
            }

           
        } 

        this.setState({
            dayItems : [...items]
        })

    }

    changeMonth = () => {
        console.log('Zmieniam miesiąc...');
        
            if(this.state.month === 11){
                console.log('Zmieniam też rok...');
                
                let year = this.state.year+1;
                let month = 0;
                let dow = (this.state.dow + 3) > 6 ? (this.state.dow + 3)-7 : (this.state.dow + 3);
                this.setState({
                    year : year,
                    isLeapYear :(year+1 % 4 == 0 && year+1 % 100 != 0 || year+1 % 400 == 0),
                    month : month,
                    dow: dow
                },()=>{
                    console.log(this.state);                    
                    this.renderCalendar();
                })

               
                
            }else{
                let dow;
                let month;
                if(this.state.monthDaysCount[this.state.month] === 31){
                     dow = (this.state.dow + 3) > 6 ? (this.state.dow + 3)-7 : (this.state.dow + 3);
                     month = this.state.month+1;
                }else if(this.state.monthDaysCount[this.state.month] === 30){
                     dow = (this.state.dow + 2) > 6 ? (this.state.dow + 2)-7 : (this.state.dow + 2);
                     month = this.state.month+1;
                }else if(this.state.monthDaysCount[this.state.month] === 28){
                    dow = this.state.dow;
                    month = this.state.month+1;
                }else{
                    dow = (this.state.dow + 1) > 6 ? (this.state.dow + 1)-7 : (this.state.dow + 1);
                    month = this.state.month+1;
                }
                this.setState({
                    month : month,
                    dow: dow
                },()=>{
                    console.log(dow,month);
                    this.renderCalendar()
                })
            }
    }
    render() { 
        return ( 
            <div className="sheduleContainer">
              
              <div className="listContainer">
                 <div className="listHeader">
                    <b>17</b>, Grudzień
                 </div>

                 <div className="list">
                 </div>
              </div>

              <div className="calendarContainer">
              <div className="calendarContainerHeader">
                  
                     <div className="previousMonth"><i class="fas fa-angle-left"></i></div> 
                     <div className="currentMonth">{this.state.monthNames[this.state.month]}</div>
                     <div className="nextMonth" onClick={this.changeMonth}><i class="fas fa-angle-right"></i></div>

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
                       {/*  <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div>
                        <div className="dayItem"></div> */}

                        {this.state.dayItems}
                    </div>
                </div>

              </div>

             
            </div>
         );
    }
}
 
export default SheduleContainer;