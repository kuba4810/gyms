import React from 'react'
import UserDataForm from './EditProfile/UserDataForm'
import TrainerDataForm from './EditProfile/TrainerDataForm'
class EditProfile extends React.Component{
  constructor(){
    super();
    this.state = {
      isLoading : true,
      data : null
    }
  }

    componentDidMount() {

      let data = {
        id: localStorage.getItem('loggedId'),
        type: localStorage.getItem('type')
      }

      fetch(`http://localhost:8080/api/user`, {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin", 
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(res => res.json())
        .then(res => {
          if (res.response === 'success') {
            console.log(res);
            
            this.setState({
              isLoading: false,
              data: res.data
            })
          }
        })
        .catch(err => {
          alert('Wystąpił błąd, spróbuj ponownie później !');
        })
    }

     
    render(){

        let form = '';

        // Jeśli dane zostały pobrane z api
        if(this.state.isLoading === false){
          // Jeśli zalogowany jest użytkownikiem
          if(localStorage.getItem('type')==='user'){

            form = <UserDataForm data = {this.state.data} />

          // Jeśli zalogowany jest trenerem 
          } else if(localStorage.getItem('type')==='trainer')
          {
            form = <TrainerDataForm data = {this.state.data} />
          }
        }
        return(
            <div>
                <div className="topicsGroupTitle">EDYCJA PROFILU</div>
                <div className="topicsContent" id="topicsContent">                   
                  {form}
                </div>
            </div> 

        );
    }
}

export default EditProfile;