import React from 'react' 

class List extends React.Component{
    render(){
       return(
        <div class="container-fluid">
             {this.props.text}
        </div>
       );
    }
}

export default List;