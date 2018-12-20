import React from 'react'

class EditProfile extends React.Component{

    componentDidMount(){
/*         document.querySelector(".forumNav").classList.add("invisible");
        document.querySelector(".forumContent").style.width="100%";
        document.querySelector(".topicsMenu").classList.add("invisible"); */
    }
    render(){
        return(
            <div>
                <div className="topicsGroupTitle">EDYCJA PROFILU</div>
                    <div className="topicsContent" id="topicsContent">
                    <div class="container">

	<div class="row">

      <div class="col-md-12 ">
       {/* <div class="alert alert-info alert-dismissable">
          <a class="panel-close close" data-dismiss="alert">×</a> 
          <i class="fa fa-coffee"></i>
          This is an <strong>.alert</strong>. Use this to show important messages to the user.
        </div>*/}
        
        
        <form class="form-horizontal editProfileForm" role="form">
          <legend> <h3>Dane osobowe</h3> </legend>
          <hr/>
          <div class="form-group">
            <label class="col-lg-3 control-label">Imię</label>
            <div class="col-lg-12">
              <input class="form-control" type="text" placeholder="Imię..."/>
            </div>
          </div>
          <div class="form-group">
            <label class="col-lg-3 control-label">Nazwisko</label>
            <div class="col-lg-12">
              <input class="form-control" type="text" placeholder="Nazwisko..."/>
            </div>
          </div>
          <div class="form-group">
            <label class="col-lg-3 control-label">Wzrost:</label>
            <div class="col-lg-12">
              <input class="form-control" type="text" placeholder="Wzrost..."/>
            </div>
          </div>

          <div class="form-group">
            <label class="col-md-3 control-label">Masa:</label>
            <div class="col-lg-12">
              <input class="form-control" type="text" placeholder="Masa..."/>
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-3 control-label">Ulubione ćwiczenie:</label>
            <div class="col-lg-12">
              <input class="form-control" type="text" placeholder="Ulubione ćwiczenie..."/>
            </div>
          </div>
          <div class="form-group">
            <label class="col-lg-3 control-label">Hasło:</label>
            <div class="col-lg-12">
              <input class="form-control" type="password" />
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-3 control-label">Potwierdź hasło:</label>
            <div class="col-lg-12">
              <input class="form-control" type="password" />
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-3 control-label"></label>
            <div class="col-lg-12">
              <input type="button" class="btn btn-primary" value="Zapisz zmiany"/>
              <span></span>
              <input type="reset" class="btn btn-default" value="Wyczyść"/>
            </div>
          </div>
        </form>
      </div>
  </div>
</div>
<hr/>
                    </div>
            </div>
        );
    }
}

export default EditProfile;