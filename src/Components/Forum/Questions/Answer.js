import React from 'react'
import {Link} from 'react-router-dom'

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
            var data = JSON.stringify({
                Type:1,
                AID: this.props.answerData.answer_id
            });
            fetch("http://localhost:5000/updateAnswerVotes",{
                method: "POST",
              
                headers: {
                    "Content-Type": "application/json;",
                },
              
                body: data, 
            }).then(response => response.json())
                .then( (response)=> {
                    this.setState({votes: response});
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
            var data = JSON.stringify({
                Type:-1,
                AID: this.props.answerData.answer_id
            });
            fetch("http://localhost:5000/updateAnswerVotes",{
                method: "POST",
              
                headers: {
                    "Content-Type": "application/json;",
                },
              
                body: data, 
            }).then(response => response.json())
                .then( (response)=> {
                    this.setState({votes: response});
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
                        <span className="answerDate">{data.creating_date}</span>
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