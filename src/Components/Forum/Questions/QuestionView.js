import React from 'react'
import AnswersList from './AnswersList'
import AnswerQuestionDiv from './AnswerQuestionDiv'

import {connect} from 'react-redux'
import {getFilteredQuestions, selectQuestion} from '../../../Selectors/selectQuestion'
import {selectCurrentQuestion} from '../../../Actions';
import {Link} from 'react-router-dom'


class Question extends React.Component{
    constructor(){
        super(...arguments);
        
        this.state = {
            Question:null,
            qID :this.props.match.params.questionId,
            votes : 0
        }

    }



    showAnswerDiv(){
        /*var ansDiv = document.getElementById("ansDiv");

        if(ansDiv.classList.contains("invisible")){
            ansDiv.classList.remove("invisible");
        }
        else{
            ansDiv.classList.add("invisible");
        }*/

        document.querySelector(".answerQuestionDiv").classList.toggle("ansInvisible");
        //document.querySelector(".answerQuestionDiv").classList.toggle("fadeIn");
    }


    componentDidMount(){

        //this.props.selectCurrentQuestion(this.props.match.params.questionId);

        document.querySelector(".forumNav").classList.add("invisible");
        document.querySelector(".forumContent").style.width="100%";
        var questionId = this.props.match.params.questionId;
        console.log("Id pytania: " ,questionId);

        var data = {
            questionId: questionId
        }
        /*data = JSON.stringify(data);*/
        fetch("http://localhost:8080/getQuestion/"+questionId, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin", //
            headers: {
                "Content-Type": "application/json;",
            },
            redirect: "follow",
            referrer: "no-referrer", // no-referrer, *client
           //body: JSON.stringify(data), // body data type must match "Content-Type" header
        }).then(response => response.json())
            .then(
            (result) => {
                this.setState({
                    Question: result,
                    votes : (result.pluses - result.minuses)
                },()=>{console.log("Stan po załadowaniu pytania: ",this.state.Question)});
                console.log("Rezultat: ",result);
            },

        );
    }

    voteUp = () => {
        if(localStorage.getItem("logedIn")!="false")
        {
            var data = JSON.stringify({
                Type:1,
                QID:this.state.qID
            });
            fetch("http://localhost:5000/updateQuestionVote",{
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
           document.getElementById("confirmationButton").classList.remove("invisible");
        }
    }

    voteDown = () =>{
        if(localStorage.getItem("logedIn")!="false")
        {
            var data = JSON.stringify({
                Type:-1,
                QID:this.state.qID
            });
            fetch("http://localhost:5000/updateQuestionVote",{
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
            document.getElementById("confirmationButton").classList.remove("invisible");
         }
    }

    showLoginForm = () => {
        document.getElementById("loginForm").classList.remove("invisible");
    }


    render(){

        var data = this.state.Question;

        if(this.state.Question !=null)
        {
            return(
                <div>
                    <div className="topicsGroupTitle">{data.topic}</div>
                    <div className="topicsContent" id="topicsContent">


                        <div className="postContentHeader">

                            <div className="postContentEvaluations">


                                <div className="evaluationsButtons">
                                    <div className="plus" onClick={this.voteUp}>

                                        <i className="fas fa-caret-up"></i>
                                    </div>
                                    <div className="minus" onClick={this.voteDown}>
                                        <i className="fas fa-caret-down"></i>
                                    </div>
                                </div>
                                <span className="colorWhite votesCounter">
                                    {this.state.votes}
                                    <br/>głosów
                                </span>


                            </div>

                            <div className="postContentTopic">
                                <span className="colorWhite">Pytanie zadane  w kategorii </span>
                                <Link id="categoryLink" to={"/forum?sort=" + data.category}>{data.category}</Link> przez 
                                <Link id="userLink" to={"/forum/uzytkownik/" + data.login}> {data.login} </Link>
                                <br/><span className="creationDate"> {data.creating_date}</span>
                                <hr/>
                            </div>

                            <div className="userAvatar transition">
                                <Link to={"/forum/uzytkownik/" + data.login}><i className="fas fa-user"></i></Link>
                            </div>
                        </div>

                        <div className="confirmationButton invisible" id="confirmationButton"onClick={this.showLoginForm}> Zaloguj się by móc odpowiadać</div>

                        <div className="postContentMain">
                            <div className="postContent">


                                <div className="postContentText">
                                    {data.content_}
                                </div>


                                <div className="giveAnswer">
                                    <div className="answer transition" data-toggle="collapse" data-target="#ansDiv">
                                        Odpowiedz
                                    </div>
                                  
                                    <AnswerQuestionDiv questionId = {this.state.qID}/>
                                </div>
                            </div>
                        </div>



                        <div className="beforeAnswers">
                           {data.how_many_answers} odpowiedzi
                        </div>

                        <AnswersList questionId={this.state.qID}/>

                    </div>
                </div>

            );
        }
        else{
            return(
                <div>
                    <div className="topicsGroupTitle">

                    </div>
                    <div className="topicsContent" id="topicsContent">
                           
                <div class="loaderContainer">
                    <div class="loader">
                    </div>
                    <div class="loaderInner">
        
                    </div>
        
                    <div class="loaderInnerSmall">
        
                    </div>
        
                </div>
                    </div>
                </div>

            );
        }


    }

}

const mapStateToProps = state => {
    return{
        question: state.questions.currentQuestion   
    };
}
const mapDispatchToProps = {selectCurrentQuestion}

export const QuestionView = connect(mapStateToProps,mapDispatchToProps)(Question);