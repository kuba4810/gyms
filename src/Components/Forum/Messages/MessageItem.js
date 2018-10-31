import React from 'react'

class MessageItem extends React.Component{

   

    render(){
        var userId = localStorage.getItem("logedIn");
        var message = this.props.message;
        return(
                 <div class="message animated fadeIn">
                    <div class="messageData"><p> {message.sender==userId ? <span style={{color:"rgb(255,51,51)"}}>Ja</span> :message.login}, {message.sending_date} </p>
                    { message.sender!=userId && <a href={"http://localhost:3000/forum/nowa-wiadomosc/"+message.sender+"/"+message.login}>Odpisz</a>}
                         {message.receiver == userId ? <div class="setRead"> <i class="fas fa-angle-down"></i> </div>: ""}
                          <div class="deleteMessage"><i class="fas fa-trash-alt"></i></div> 
                     </div>
                  <div class="messageText">
                  {message.message_content}
                    </div>
                   
                </div>
        );
    }
}

export default MessageItem;