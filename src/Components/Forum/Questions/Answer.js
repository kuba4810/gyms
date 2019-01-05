import React from 'react'
import {Link} from 'react-router-dom'
import {formatDate} from '../../../services/dateService'
class Answer extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            
            votes: (this.props.answerData.pluses - this.props.answerData.minuses)
        }


    }

    voteUp = () => {
        if(localStorage.getItem("logedIn")!="false")
        {
            var data = {
                user_id : localStorage.getItem('loggedId'),
                answer_id:this.props.answerData.answer_id,
                value : '1'
            };
            fetch("http://localhost:8080/api/answer/vote", {
                    method: "POST",
                    mode: "cors",
                    cache: "no-cache",
                    credentials: "same-origin", //
                
                    body: JSON.stringify(data), // body data type must match "Content-Type" header
                    headers: {
                        "Content-Type": "application/json"
                    }
            }).then(response => response.json())
                .then( (response)=> {
                    this.setState({votes: response.votes_count});
                })
        }
        else{
            var buttons = document.getElementsByClassName("confirmationButton");
            var i=0;
            for(i ; i< buttons.length ; i++){
                buttons[i].classList.add("invisible");
            }
           

              document.getElementById("confirmationButton" + this.state.Answer[0]).classList.remove("invisible");
        }
        
        
    }

    voteDown = () =>{
        if(localStorage.getItem("logedIn")!="false")
        {
            var data = {
                user_id : localStorage.getItem('loggedId'),
                answer_id:this.props.answerData.answer_id,
                value : '0'
            };
            fetch("http://localhost:8080/api/answer/vote", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin", //
             
                body: JSON.stringify(data), // body data type must match "Content-Type" header
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
                .then( (response)=> {
                    this.setState({votes: response.votes_count});
                })
        }
        else{
            var buttons = document.getElementsByClassName("confirmationButton");
            var i=0;
            for(i ; i< buttons.length ; i++){
                buttons[i].classList.add("invisible");
            }
           

              document.getElementById("confirmationButton" + this.state.Answer[0]).classList.remove("invisible");
              
         }

    }

    showLoginForm = () => {
        var loginForm = document.getElementById("loginForm");
            var loginContent = document.querySelector('.loginContent');

            loginForm.classList.remove("invisible");
            
            loginContent.classList.remove('fadeOutDown');
            loginContent.classList.add('zoomIn');

    }

    render(){

        var data = this.props.answerData;
        return(
            <div className="answers">
                <div className="postContentHeader">

                    <div className="postContentEvaluations">

                        <div className="evaluationsButtons">
                            <div className="answerPlus" onClick={this.voteUp}>
                                <i className="fas fa-caret-up"></i>
                            </div>
                            <div className="answerMinus" onClick={this.voteDown}>
                                <i className="fas fa-caret-down"></i>
                            </div>
                        </div>

                        <span className="colorWhite answerVotesCounter"> {this.state.votes} <br/>głosów  </span>

                    </div>

                    <div className="postContentTopic">
                        <span className="colorWhite">Odpowiedź od  </span>
                        <Link to={"/uzytkownik/profil/" + data.login} id="userAnswerLink">{data.login}</Link> <br/>
                        <span className="answerDate">{formatDate(data.creating_date)} </span>
                        <hr/>
                    </div>

                    <div className="userAvatar transition">
                        <Link to={"/uzytkownik/profil/" + data.login}><i className="fas fa-user"></i></Link>
                    </div>
                </div>

                 <div className="confirmationButton invisible" id={"confirmationButton" + data.answer_id} onClick={this.showLoginForm}> Zaloguj się by móc odpowiadać</div>


                <div className="postContentMain">
                    <div className="postContent">

                        <div className="answerContentText">
                            {data.content_}
                        </div>


                    </div>
                </div>
            </div>
        );
    }

}

export default Answer;