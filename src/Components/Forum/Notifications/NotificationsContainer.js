import React from 'react';
import NotificationItem from './NotificationItem'

class NotificationsContainer extends React.Component{
    constructor(){
        super();
        this.state = {
            notifications: [],
            notificationsCount : 0,
            isLoading : true
        }
    }
    

        componentDidMount(){
            document.querySelector(".forumNav").classList.add("invisible");
            document.querySelector(".topicsMenu").classList.add("invisible");
            document.querySelector(".forumContent").style.width="100%";

            /* Get notifications from database */
            fetch(`http://localhost:8080/notifications/${localStorage.getItem("logedIn")}`)
                .then( response => response.json() )
                    .then( response => {
                        console.log("Powiadomienia: ",response);
                        if(response.notificationsCount == 0){
                            this.setState({
                                isLoading:false,
                                notificationsCount: 0
                            });
                        }
                        else{
                            this.setState({
                                isLoading: false,
                                notificationsCount: response.notificationsCount,
                                notifications: response.notifications
                            });
                        }
                    });
        }

        render(){
           var notifications;
           if(this.state.isLoading === false){
               if(this.state.notificationsCount === 0){
                   notifications = <div> Brak nowych powiadomień </div>
               }
               else{

                   /*notifications = <div> No niby są nowe powiadomienia ale jeszcze nie wiem jak je wyświetlić xD </div>*/
                   notifications = this.state.notifications.map( (ntf,index)=> ( <NotificationItem delay={index} ntfData = {ntf} /> ) );
                   
               }
           }
           else{
               notifications = <div class="loaderContainer">
                                    <div class="loader">
                                    </div>
                                    <div class="loaderInner">   
                                    </div>   
                                     <div class="loaderInnerSmall">   
                                    </div>   
                                    </div>
           }
                return(
                    <div>
                        <div className="topicsGroupTitle">
                             POWIADOMIENIA
                       </div>
        
                        <div className="topicsContent" id="topicsContent">
                           {notifications}
                        </div>
                    </div>
                );
            
        }
    
}

export default NotificationsContainer;