import React from 'react'
import Messages from './Messages'

class MessageContainer extends React.Component{

    constructor(){
        super();

        this.state = {
            messages: [],
            messageType: "received",
            showRead: false
        }
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
                messages = this.state.messages.filter( message =>(message.receiver == userId) )
                
            }
            else{
                messages = this.state.messages.filter( message =>(message.receiver == userId && message.is_read === false) )
            }
            
        }
        else if(this.state.messageType == "sent"){
           messages = this.state.messages.filter( message =>(message.sender == userId ) )
        }
        else if(this.state.messageType == "input"){
            var input = this.state.searchValue.toLowerCase();
            messages = this.state.messages.filter( message =>(message.login.indexOf(input) != -1) )
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
                                         <Messages filterFunctions={filterFunctions} messages={messages} /> 
                                    </div>
                           
                                </div>
                           </div>
                            
                        </div>

                        
                      
                 </div>
                
 
        );
    }
}

export default MessageContainer;