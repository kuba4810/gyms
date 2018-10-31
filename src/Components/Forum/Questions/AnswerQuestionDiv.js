import React from 'react'




class AnswerQuestionDiv extends React.Component{
    constructor(){
        super(...arguments);
    }


    showLoginForm = () => {
        document.getElementById("loginForm").classList.remove("invisible");
    }

    sendAnswer = () => {
        var answerContent = document.getElementById("answerContent").value;
        var data = {
            userID: localStorage.getItem("logedIn"),
            questionId: this.props.questionId,
            content: answerContent

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
                    window.location.reload();
                }
                else{
                    alert(response.message);
                }
            });

        //console.log("Treść wiadomości: " , answerContent);
    }

    render(){
        if(localStorage.getItem("logedIn") != 'false'){
            if(localStorage.getItem("emailConfirmed") == "true"){
                return(
                    <div className="answerQuestionDiv collapse" id="ansDiv">

                      
                             <span className="title">Twoja odpowiedź</span>
                             <textarea className="answerContent" id="answerContent" cols="30" rows="9" wrap="hard"></textarea>
                            <div className="sendAnswer" onClick={this.sendAnswer}>Wyślij</div>
                       

                        
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