import React from 'react'
import MessageItem from './MessageItem'

class Messages extends React.Component{

    componentDidMount(){
        console.log("Wiadomości: ",this.props);

    }

    render(){

        var MessageItems = this.props.messages.map( (message,index) => <MessageItem messageType={this.props.messageType} mark={this.props.mark} delete={this.props.delete} key={message.index} message={message}  /> )
        return(
            <div>
                 {MessageItems}   
            </div>                   

        );
    }
}

export default Messages;