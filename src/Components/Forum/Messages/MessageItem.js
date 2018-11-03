import React from 'react'

class MessageItem extends React.Component{
    

    markAsRead = () => {
        fetch(`http://localhost:8080/markMessageAsRead/${this.props.message.message_id}`,{
            method: "GET"
        })
            .then( res => res.json() )
                .then( (response)=> {
                    if( response.response == "Success"){
                        this.props.mark(this.props.message.message_id);
                        //alert("Wiadomość oznaczono jako przeczytaną !");                        
                    }
                    else{
                        alert("Wystąpił błąd, spróbuj ponownie później !"); 
                    }
                });
                
    }

    deleteMessage = () => {
        var userType = ( this.props.messageType == 'received' ? "receiver" : "sender" );
        console.log("Typ użytkownika: ",userType);

        var data = {
            message_id : this.props.message.message_id,
            userType : userType
        }
        console.log("Dane do zapytania ",data);

        fetch(`http://localhost:8080/deleteMessage`,{
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin", //
         
            body: JSON.stringify(data), // body data type must match "Content-Type" header
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then( res => res.json() )
                .then( (response)=> {
                    if( response.response == "Success"){
                        this.props.delete(this.props.message.message_id,userType);
                        //alert("Wiadomość oznaczono jako przeczytaną !");                        
                    }
                    else{
                        alert("Wystąpił błąd, spróbuj ponownie później !"); 
                    }
                });
    }

    componentDidMount(){
        //console.log("Propsy w MessageItem: ", this.props);
    }


   

    render(){
        var user_id = localStorage.getItem("logedIn");
        var message = this.props.message;
        var bgColor;
        if( message.is_read == true && message.receiver == parseInt(user_id)){
            bgColor = "gray";
        }
        else{
            bgColor = "cornsilk";
        }
        var userId = localStorage.getItem("logedIn");
        
        return(
                 <div class="message animated fadeIn">
                    <div class="messageData"><p> {message.sender==userId ? <span style={{color:"rgb(255,51,51)"}}>Ja</span> :message.login}, {message.sending_date} </p>
                    { message.sender!=userId  && <a href={"http://localhost:3000/forum/nowa-wiadomosc/"+message.sender+"/"+message.login}>Odpisz</a>}
                         {(message.receiver == userId && message.is_read == false) ? <div class="setRead" onClick={this.markAsRead}> <i class="fas fa-angle-down"></i> </div>: ""}
                          <div class="deleteMessage" onClick={this.deleteMessage}><i class="fas fa-trash-alt"></i></div> 
                     </div>
                  <div class="messageText" style={{backgroundColor: bgColor}}>
                  {message.message_content}
                    </div>
                   
                </div>
        );
    }
}

export default MessageItem;