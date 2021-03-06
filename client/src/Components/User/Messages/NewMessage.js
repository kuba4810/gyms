import React from 'react'
import history from '../../../history'

class NewMessage extends React.Component{

    constructor(){
        super(...arguments);
        this.state = {
            messageContent : "",
            messageAlert : null,
            isLoading: true,
            sender_data : null
        }


    }
    
    componentDidMount(){
        let user_login = this.props.match.params.user_login;


        
        fetch(`http://localhost:8080/api/message/sender-login-data/${user_login}`)
            .then(res=>res.json())
            .then(res=>{
                console.log(res);
                if(res.response === 'success'){
                    
                    
                    this.setState({
                        sender_data : res.data,
                        isLoading : false
                    },()=>{
                        console.log(this.state);
                        
                    })
                }
            })
            .catch(err=>{
                alert('Wystąpił błąd, spróbuj ponownie później !');
            })
    }
    sendMessage = () => {
        var sender = parseInt(localStorage.getItem("loggedId"));
        var sender_type = localStorage.getItem('type');
        var text = this.state.messageContent;
        

        var data ={
            sender: sender,
            receiver: this.state.sender_data.user_id,
            text: text,
            sender_type : sender_type,
            receiver_type:this.state.sender_data.user_type

        };
        console.log(data);

        
        

        fetch("http://localhost:8080/newMessage", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin", //
         
            body: JSON.stringify(data), // body data type must match "Content-Type" header
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json())
            .then( (response) => { 
                history.push('/uzytkownik/wiadomosci')
                //alert("Wiadomość została wysłana !");
                //setTimeout(()=>{window.location = "http://localhost:3000/forum/wiadomosci"});
            }).catch();

        // console.log("Dane wiadomości -  Nadawca: ",sender," Odbiorca: ",receiver," Treść: ",this.state.messageContent);
    }

    handleTextCange = (event) => {
        this.setState({messageContent: event.target.value});
       // console.log(event.target.value);
    }
    render(){
        if(localStorage.getItem("isLoggedIn") != 'false'){
            if(localStorage.getItem("isEmailConfirmed") == "true"){
                return(
                    <div>
                        <div className="topicsGroupTitle">NOWA WIADOMOŚĆ</div>
        
                        <div className="topicsContent" id="topicsContent">
        
                       {this.state.isLoading === false && 
                        <div className="writeMessageDiv">
        
                        <p>Nowa wiadomość do: <b>{this.state.sender_data.login}</b></p>
    
                        <label htmlFor="comment">Treść</label>
                        <textarea ref="messageContent" className="form-control messageContent" name="messageText" rows="5" value={this.state.messageContent} onChange={this.handleTextCange} ></textarea>
    
                        <button type="button" className="sendMessage btn btn-success" onClick={this.sendMessage}>
                            Wyślij
                        </button>
    
                    </div>}
                    </div>
                    </div>
        
        
        
            );
            }
            else{
                return(
                    <div>
                         <div className="topicsGroupTitle">NOWA WIADOMOŚĆ</div>
                          <div className="topicsContent" id="topicsContent">
                             <div className="confirmationButton" > <a href="http://localhost:3000/potwierdz-email">Potwierdź E-mail by móc wysyłać wiadomości</a></div>
                         
                     </div>
                    </div>
                   );
            }
        }
        else{
            return(
                <div>
                <div className="topicsGroupTitle">NAJNOWSZE</div>
                 <div className="topicsContent" id="topicsContent">
                 <div className="confirmationButton" onClick={()=>{document.getElementById("loginForm").classList.remove("invisible")}} >
                     Zaloguj się by móc wysyłać wiadomości
                 </div>
            </div>
           </div>
              
              );
        }
      
    }
}

export default NewMessage;