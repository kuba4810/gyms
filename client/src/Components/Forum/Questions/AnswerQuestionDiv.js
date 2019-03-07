import React from 'react'




class AnswerQuestionDiv extends React.Component{
    constructor(){
        super(...arguments);
        this.state = {
            content : ''
        }
    }


    showLoginForm = () => {
        var loginForm = document.getElementById("loginForm");
        var loginContent = document.querySelector('.loginContent');

        loginForm.classList.remove("invisible");
        loginForm.classList.remove("fadeOut");
        loginForm.classList.add('fadeIn');
        
        loginContent.classList.remove('fadeOutDown');
        loginContent.classList.add('zoomIn');

    }

    sendAnswer = () => {
        let user_type = localStorage.getItem('type');
        let login = localStorage.getItem('loggedNick')

        var data = {
            userID: localStorage.getItem("loggedId"),
            questionId: this.props.questionId,
            content: this.state.content,
            user_type : user_type,
            login : login

        };

        
        fetch("http://localhost:8080/insertAnswer", {
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
                console.log(response);
                if(response.result == "success"){
                    console.log('Wysyłam odpowiedź do QuestionView: ',response.newAnswer);
                    
                   this.props.answerAdded(response.newAnswer)
                   this.setState({
                       content : ''
                   })
                }
                else{
                    alert(response.message);
                }
            });

        //console.log("Treść wiadomości: " , answerContent);
    }

    handleChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    render(){


        if(localStorage.getItem("isLoggedIn") != 'false'){
            if(localStorage.getItem("isEmailConfirmed") === "true" ){
                return(
                    <div className="answerQuestionDiv collapse" id="ansDiv">

                      
                             <span className="title">Twoja odpowiedź</span>
                             <textarea className="answerContent" name="content"
                                       id="answerContent" cols="30" rows="9" wrap="hard"
                                       value = {this.state.content}
                                       onChange = {this.handleChange}>
                            </textarea>
                             <div className="sendAnswer" data-toggle="collapse" data-target="#ansDiv"
                             onClick={this.sendAnswer}>Wyślij</div>
                       

                        
                    </div>
                );
            }
            else{
                return(
                    <div className="collapse answerQuestionDiv" id="ansDiv">
                        <div className="confirmationButton" > Potwierdź E-mail by móc odpowiadać</div>
                    </div>
                );
            }
        }
        else{
            return(
                <div className="collapse answerQuestionDiv " id="ansDiv">
                    <div className="confirmationButton" onClick={this.showLoginForm}> Zaloguj się by móc odpowiadać</div>
                </div>
            );
        }
    }
}

export default AnswerQuestionDiv;