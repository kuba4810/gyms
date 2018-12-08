import React from 'react'
import {connect} from 'react-redux'

class  Question extends React.Component{
    componentDidMount(){
        document.querySelector(".forumNav").classList.add("invisible");
        document.querySelector(".forumContent").style.width="100%";
        document.querySelector(".topicsMenu").classList.add("invisible");
        console.log(this.props.questions.questionsList);
    }
    sendNewQuestion = (event) =>{

        var topic = event.target.topic.value;
        var category = event.target.category.value;
        var content = event.target.content.value;
        var userId = localStorage.getItem("logedIn");

        var topicWithDashes = topic.toLowerCase().split(" ").join("-");

       //console.log("Zawartość formularza (NewQuestion): Temat: " + topic + " Kategoria: " + category + " Treść: " + content,"UserID: " +userId);

        var data = {
            UserID: localStorage.getItem("logedIn"),
            Topic: topic,
            Text: content,
            Category: category
        };

       // console.log(data);


        fetch("http://localhost:8080/newQuestion", {
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
                console.log("Odpowiedź z serwera: ",response);
                window.location = "http://localhost:3000/forum/pytanie/" + response.question_id + "/" + topicWithDashes;
            }).catch();
            
        event.preventDefault();
    }

    showLoginForm(){
        var loginForm = document.getElementById("loginForm");
        var loginContent = document.querySelector('.loginContent');

        loginForm.classList.remove("invisible");
        
        loginContent.classList.remove('fadeOutDown');
        loginContent.classList.add('zoomIn');

    }

    render(){

        if(localStorage.getItem("logedIn") != 'false'){
            if(localStorage.getItem("emailConfirmed") == "true"){
                return(

                    <div>
                           <div className="topicsGroupTitle">NOWE PYTANIE</div>
                        <div className="topicsContent" id="topicsContent">
                     
        
                        <form className="askingQuestionDiv" style={{border:"none"}} onSubmit={this.sendNewQuestion}>
        
                            <h3>Temat - czego pytanie będzie dotyczyć.</h3>
                            <input type="text" className="questionTopic" name="topic"/>
                            <br/> <br/>
                            <h3>Wybierz kategorie</h3>
        
                            <div className="form-group" name="">
                                    <select className="form-control" id="sel1" name="category">
                                    <option value="Treningi">Treningi</option>
                                    <option value="Siłownie">Siłownie</option>
                                    <option value="Dieta">Dieta</option>
                                    <option value="Sprzęt">Sprzęt</option>
                                    <option value="Suplementy">Suplementy</option>
                                    <option value="Muzyka">Muzyka</option>
                                    <option value="Zawody">Zawody</option>
                                    <option value="Zdrowie">Zdrowie</option>
                                    <option value="Rozrywka">Rozrywka</option>
                                </select>
                            </div>
        
                            <h3>Treść pytania</h3>
                            <textarea className="questionContent" cols="30" rows="20" name="content"></textarea>
        
                            <button type="submit" className="saveQuestion">Zadaj pytanie</button>
                        </form>
        
                        </div>
                    </div>
        
                );
            }
            else{
              return(
               <div>
                    <div className="topicsGroupTitle">NOWE PYTANIE</div>
                     <div className="topicsContent" id="topicsContent">
                        <div className="confirmationButton" > <a href="http://localhost:3000/potwierdz-email">Potwierdź E-mail by móc odpowiadać</a></div>
                    
                </div>
               </div>
              );
            }
        }else{
          return(
            <div>
            <div className="topicsGroupTitle">NOWE PYTANIE</div>
             <div className="topicsContent" id="topicsContent">
             <div className="confirmationButton" onClick={this.showLoginForm} >
                 Zaloguj się by móc odpowiadać
             </div>
        </div>
       </div>
          
          );
        }

        
    }


}

const mapStateToProps = state => {
    return{
        questions: state.questions
    };
}


export const NewQuestion = connect(mapStateToProps)(Question);
