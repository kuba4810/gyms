import React from 'react'

class EditProfile extends React.Component{
  constructor(){
    super();
    this.state ={
      first_name: '',
      last_name: '',
      height: '',
      mass : '',
      favourite_exercise : '',
      passw : '',
      email: '',
      confirm_password : ''
    }
  }

    componentDidMount(){
        fetch(`http://localhost:8080/getUserData/${localStorage.getItem('loggedNick')}`)
        .then(res=>res.json())
        .then(res=>{
          this.setState({
            first_name : res.first_name,
            last_name : res.last_name,
            height : res.height,
            mass : res.mass,
            favourite_exercise : res.favourite_exercise,
            passw : res.passw,
            email : res.email
          })
        })
        .catch(err=>{
          alert('Wystąpił błąd, spróbuj ponownie później !');
        })
    }

    handleChange = (e) => {
      let value = e.target.value;
      this.setState({
          [e.target.name]: value
      })
  
  }
    
    render(){
        return(
            <div>
                <div className="topicsGroupTitle">EDYCJA PROFILU</div>
                    <div className="topicsContent" id="topicsContent">
                    <div class="container-fluid">
                   

	<div class="row editProfileRow animated fadeIn">

       <div className="col-lg-4">
          <div className="userAvatar">
            <i className="fas fa-user"></i>
          </div>

             <label for='userAvatar'>Dodaj zdjęcie</label>
            <input type='file' name='userAvatar'/>

          
       </div> 
      <div className="col-lg-8 ">
       {/* <div class="alert alert-info alert-dismissable">
          <a class="panel-close close" data-dismiss="alert">×</a> 
          <i class="fa fa-coffee"></i>
          This is an <strong>.alert</strong>. Use this to show important messages to the user.
        </div>*/}
        
        
         <form class="form-horizontal editProfileForm" role="form">
         
          <div class="form-group">
            <label class="col-lg-12 control-label">Imię</label>
            <div class="col-lg-12">
              <input class="form-control" name='first_name'
                     type="text" value={this.state.first_name} onChange={this.handleChange} />
            </div>
          </div>
          <div class="form-group">
            <label class="col-lg-12 control-label">Nazwisko</label>
            <div class="col-lg-12">
              <input class="form-control" name='last_name' 
                     type="text" value={this.state.last_name} onChange={this.handleChange} />
            </div>
          </div>
          <div class="form-group">
            <label class="col-lg-12 control-label">Wzrost:</label>
            <div class="col-lg-12"> 
              <input class="form-control" name='height' 
                     type="text" value={this.state.height} onChange={this.handleChange} />
            </div>
          </div>

          <div class="form-group">
            <label class="col-md-3 control-label">Masa:</label>
            <div class="col-lg-12">
            <input className='form-control' name='mass' 
                   type='text' value={this.state.mass} onChange={this.handleChange} />
            </div>
          </div>
          <div class="form-group">
            <label class="col-lg-12 control-label">Ulubione ćwiczenie:</label>
            <div class="col-lg-12">
              <input class="form-control" name='favourite_exercise'  
                     type="text" value={this.state.favourite_exercise} onChange={this.handleChange} />
            </div>
          </div>
          <div class="form-group">
            <label class="col-lg-12 control-label">Mail:</label>
            <div class="col-lg-12">
              <input class="form-control" name='email'
                     type="text" value={this.state.email} onChange={this.handleChange}/>
            </div>
          </div>
          <div class="form-group">
            <label class="col-lg-12 control-label">Hasło:</label>
            <div class="col-lg-12">
              <input class="form-control" name='passw'
                     type="password" value={this.state.passw} onChange={this.handleChange}/>
            </div>
          </div>
          <div class="form-group">
            <label class="col-lg-12 control-label">Potwierdź hasło:</label>
            <div class="col-lg-12">
              <input class="form-control" type="password" name='confirm_password'
                     value={this.state.confirm_password} onChange={this.handleChange}  />
            </div>
          </div>
          <div class="form-group">
            <label class="col-lg-12 control-label"></label>
            <div class="col-lg-12">
              <input type="button" class="btn btn-success" value="Zapisz zmiany"/>
              <span></span>
              <input type="reset" class="btn btn-danger" value="Wyczyść"/>
            </div>
          </div>
        </form>
      </div>
  </div>
</div>

                    </div>
            </div> 

        );
    }
}

export default EditProfile;