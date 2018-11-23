import React from 'react'
import Messages from './Messages'
import { timingSafeEqual } from 'crypto';

class MessageContainer extends React.Component{

    constructor(){
        super();

        this.state = {
            messages: [],
            messageType: "received",
            showRead: false,
            messageContainerAlert : "",
            alertTimeout : null
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
        this.setState({messageType: "received"});
    }

    filterSentMessages=()=>{
        this.setState({messageType: "sent"});
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

        var userId = localStorage.getItem("logedIn");

        fetch("http://localhost:8080/getMessages/"+ userId,{
            method: "GET",
          
            headers: {
                "Content-Type": "application/json;",
            },
          
        }).then(response => response.json())
            .then( (response) => {
                this.setState({messages : response});
                console.log(response);               
            }).catch(()=>{console.log("Nie udało się wczytać wiadomości !")})

            //document.getElementById("forumNav").classList.add("invisible");

            document.querySelector(".forumNav").classList.add("invisible");
            document.querySelector(".topicsMenu").classList.add("invisible");
            document.querySelector(".forumContent").style.width="100%";
    }



    render(){

        var userId = localStorage.getItem("logedIn");
        var messages=[];

        if(this.state.messageType == "received"){
            if(this.state.showRead){
                messages = this.state.messages.filter( message =>(message.receiver == userId && message.receiver_deleted == false) )
                
            }
            else{
                messages = this.state.messages.filter( message =>(message.receiver == userId && message.is_read === false && message.receiver_deleted == false) )
            }
            
        }
        else if(this.state.messageType == "sent"){
           messages = this.state.messages.filter( message =>(message.sender == userId  && message.sender_deleted == false) )
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
                             WIADOMOŚCI
                       </div>
        
                        <div className="topicsContent" id="topicsContent"> 
                           <div className="messageContainerAlert animated">{this.state.messageContainerAlert}</div>
                           <div className="container-fluid">
                                
                                <div class="row messageOptionRow">
                                    <div className="col-lg-12">
                                         <ul className="messageListOption ">
                                             <li onClick={this.filterReceiveMessages}>Skrzynka odbiorcza</li>
                                             <li onClick={this.filterSentMessages}>Pozycje wysłane</li>
                                             <li>
                                             <div class="custom-control custom-checkbox mb-3">
                                            
                                             <input  type="checkbox" class="custom-control-input" id="customCheck" name="example1" />
                                             <label onClick={ this.changeMessageState} class="custom-control-label" for="customCheck">Pokaż przeczytane</label>
                                            </div>
                                             </li>
                                         </ul>
                                        {/* <input type="text" placeholder="Nazwa użytkownika" value={this.state.searchValue} onChange={this.handleTextChange}/>
                                         <button type="button" onClick={()=>{this.setState({messageType:'input'})}}>Szukaj</button>*/ }
                                     </div>

                                     <div className="col-12 messageList">
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