import React from 'react'
import MessageItem from './MessageItem'

class Messages extends React.Component{

    componentDidMount(){
        console.log("Wiadomości: ",this.props.messages);

    }

    render(){

        var MessageItems = this.props.messages.map( (message,index) => <MessageItem key={message.index} message={message}  /> )
        return(
            <div>
                 {MessageItems}   
            </div>                   

        );
    }
}

export default Messages;