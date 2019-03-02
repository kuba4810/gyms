import React from 'react'
import Messages from './Messages'
import { timingSafeEqual } from 'crypto';
import {NavLink} from 'react-router-dom'

class MessageContainer extends React.Component{

    constructor(){
        super();

        this.state = {
            messages: [],
            messageType: "received",
            isLoading: true,
            showRead: false,
            messageContainerAlert : "",
            alertTimeout : null,
            title : 'ODEBRANE',
        }
    }

    startTimeout = () =>{
        return(
            setTimeout(function(){
                var alert = document.querySelector(".messageContainerAlert");
                alert.classList.remove("fadeIn");
                alert.classList.add("fadeOut");
            },2500)
        );
    }

    markAsRead = (message_id) =>{
        var newMessages = this.state.messages;
        //Find message and change is_read property to true.
        this.state.messages.map( (message,index)  => { 

            if(message.message_id == message_id) { 
                newMessages[index].is_read = true;
                this.setState({
                    messages:newMessages,
                    messageContainerAlert:"Wiadomość oznaczono jako przeczytaną !"
                })

                var alert = document.querySelector(".messageContainerAlert");
                alert.classList.remove("fadeOut");
                alert.classList.add("fadeIn");

                               
                this.setState({
                    alertTimeout: this.startTimeout()
                })
               
                
            } 

        });
       
    }

    componentWillUnmount(){
        clearTimeout(this.state.alertTimeout);    
    }

    deleteMessage = (message_id,userType) => {
        var newMessages = this.state.messages;

        this.state.messages.map( (message,index)  => { 

            if(message.message_id == message_id) {
                if(userType == 'sender'){
                    newMessages[index].sender_deleted = true;
                }
                else{
                    newMessages[index].receiver_deleted = true;
                }

                console.log("Nowe wiadomości: ", newMessages);
                
                this.setState({
                    messages:newMessages,
                    messageContainerAlert:"Wiadomość została usunięta !"
                })

                document.querySelector(".messageContainerAlert").classList.remove("fadeOut");
                document.querySelector(".messageContainerAlert").classList.add("fadeIn");
                
               this.setState({
                   alertTimeout : this.startTimeout()
               });
                
            } 

        });

        
    }

    filterReceiveMessages=()=>{
        this.setState(
            {
                messageType: "received",
                title: 'ODEBRANE'
            }
            );
    }

    filterSentMessages=()=>{
        this.setState(
            {
                messageType: "sent",
                title: 'WYSŁANE'
            }
            );
    }

    changeMessageState=()=>{
       this.setState({showRead: !this.state.showRead});      
    }

    filterSearchMessage=()=>{

    }

    handleTextChange=(event)=>{
        var text = event.target.value;
        this.setState({searchValue:text});
    }

    

    componentDidMount(){
        console.log('Pobieram wiadomości...');
        console.log('Obecny adres w MessageContainer: ',this.props.match);
        let type = localStorage.getItem('type');
        
        var userId = localStorage.getItem("loggedId");
        console.log('Id użytkownika: ',userId);

        fetch(`http://localhost:8080/getMessages/${userId}/${type}`,{
            method: "GET",
          
            headers: {
                "Content-Type": "application/json;",
            },
          
        }).then(response => response.json())
            .then( (response) => {
                this.setState(
                    {
                        messages : response,
                        isLoading : false
                    });
                console.log('Pobrane wiadomości: ',response);               
            }).catch(()=>{console.log("Nie udało się wczytać wiadomości !")})

            //document.getElementById("forumNav").classList.add("invisible");

          /*   document.querySelector(".forumNav").classList.add("invisible");
            document.querySelector(".topicsMenu").classList.add("invisible");
            document.querySelector(".forumContent").style.width="100%"; */
    }



    render(){

        var userId = localStorage.getItem("loggedId");
        var messages=[];
        const loader = <div class="loaderContainer">
                            <div class="loader">
                            </div>
                             <div class="loaderInner">
                            </div>
                            <div class="loaderInnerSmall">
                            </div>
                        </div>

        if(this.state.messageType == "received"){
            if(this.state.showRead){
                messages = this.state.messages.filter( message =>
                    ( message.type === 'receiver' && 
                      message.receiver_deleted == false &&
                      message.is_read == false
                     ))
                
            }
            else{
                messages = this.state.messages.filter( message =>
                    ( message.type === 'receiver' && 
                      message.receiver_deleted == false
                     ))
            }
            
        }
        else if(this.state.messageType == "sent"){
                 messages = this.state.messages.filter( message =>
                     (
                        message.type === 'sender'  && message.sender_deleted == false
                     ))
        }

        else{
            messages = this.state.messages;
        }
       
        var filterFunctions = {
            received:this.filterReceiveMessages,
            sent: this.filterSentMessages,
            all: this.filterAllMessages
        }
        var received = this.state.message
        return(
                 <div>
                       <div className="topicsGroupTitle">
                             {this.state.title}
                       </div>
        
                        <div className="topicsContent" id="topicsContent"> 
                           <div className="messageContainerAlert animated">{this.state.messageContainerAlert}</div>
                           <div className="container-fluid">
                                
                                <div class="row messageOptionRow">
                                    <div className="col-lg-12">
                                         <ul className="messageListOption ">
                                             <li to={'/uzytkownik/wiadomosci/odebrane'} onClick={this.filterReceiveMessages}>Skrzynka odbiorcza</li>
                                             <li onClick={this.filterSentMessages}>Pozycje wysłane</li>
                                             <li>

                                             <div class="custom-control custom-checkbox mb-3">
                                            
                                             { this.state.title === 'ODEBRANE' && <div>
                                                  <input onClick={ this.changeMessageState} checked={this.state.showRead}  type="checkbox" class="custom-control-input" id="customCheck" name="example1" />
                                                  <label  class="custom-control-label" for="customCheck">
                                                     Ukryj przeczytane
                                                  </label>
                                               </div>}

                                            </div>
                                             </li>
                                         </ul>
                                        {/* <input type="text" placeholder="Nazwa użytkownika" value={this.state.searchValue} onChange={this.handleTextChange}/>
                                         <button type="button" onClick={()=>{this.setState({messageType:'input'})}}>Szukaj</button>*/ }
                                     </div>

                                     <div className="col-12 messageList">
                                         {this.state.isLoading && loader}
                                         <Messages filterFunctions={filterFunctions} messageType={this.state.messageType} delete={this.deleteMessage} mark={this.markAsRead} messages={messages} /> 
                                    </div>
                           
                                </div>
                           </div>
                            
                        </div>

                        
                      
                 </div>
                
 
        );
    }
}

export default MessageContainer;