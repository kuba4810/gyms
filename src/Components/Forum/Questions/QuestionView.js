import React from 'react'
import AnswersList from './AnswersList'
import AnswerQuestionDiv from './AnswerQuestionDiv'

import {connect} from 'react-redux'
import {getFilteredQuestions, selectQuestion} from '../../../Selectors/selectQuestion'
import {selectCurrentQuestion,answerAdded} from '../../../Actions';
import {is_question_voted, question_vote} from '../../../services/API/user';

import {Link} from 'react-router-dom'
import history from '../../../history'
import {formatDate} from '../../../services/dateService'
import { unwatchFile } from 'fs';
import { booleanLiteral } from 'babel-types';

class Question extends React.Component{
    constructor(){
        super(...arguments);
        
        this.state = {
            Question:null,
            qID :this.props.match.params.questionId,
            votes : 0,
            isVoted : null,
            voteValue : null,
            voteMessage : '',
            visibility : 'invisible'

        }

    }

    redirectToLink = (link) => {
        history.push(`http://localhost:3000`);
    }

    showAnswerDiv(){
        document.querySelector(".answerQuestionDiv").classList.toggle("ansInvisible");
    }


    componentDidMount = async () => {

        document.querySelector(".forumNav").classList.add("invisible");
        document.querySelector(".forumContent").style.width="100%";
        var questionId = this.props.match.params.questionId;
        const userId = localStorage.getItem('loggedId');
        let question;
        let res;

        // Get question data
        // ---------------------------------------------------------------
        res = await fetch("http://localhost:8080/getQuestion/"+questionId);
        res = await res.json();

        this.setState({
            Question : res,
            votes : (res.pluses - res.minuses)
        })

        // Check if question was voted
        // ---------------------------------------------------------------
        res = await is_question_voted(questionId,userId);

        if(res.response === 'success'){
            this.setState({
                isVoted : res.value,
                voteValue : res.vote_value
            },()=>{
                console.log('Question View State : ',this.state);
                
            })
        }

    
        
    }
    answerAdded = (answer) => {
        console.log('Wysyłam odpowiedź do magazynu: ',answer);
        
        this.props.answerAdded(answer);
    }

      // Vote function
    // Sends prepared data to API
    // Updates local state
    vote = async (value) =>{
        
        const isLoggedIn = localStorage.getItem('isLoggedIn');       
        const type = localStorage.getItem('type');
        const mail = localStorage.getItem('isEmailConfirmed');

        if( isLoggedIn === 'false'){
            this.setState({
                voteMessage : 'Zaloguj się by móc oddać swój głos !',
                visibility : ''
            })
        } else if( type === 'trainer' ){
            this.setState({
                voteMessage : 'Zaloguj się  jako użytkownik by móc oddać swój głos !',
                visibility : ''
               
            })
        }else if ( mail === 'false' ){
            this.setState({
                voteMessage : 'Potwierdź swój E-mail by móc oddać swój głos !',
                visibility : ''
               
            })
        }else{
            // Prepare data to send
        let data = null;

        if(this.state.voteValue === -1){
            
            data = {
                user_id : localStorage.getItem('loggedId'),
                question_id : this.props.match.params.questionId,
                previous_vote : this.state.voteValue,
                next_vote : value
            }

        } else if(this.state.voteValue === value){

            data = {
                user_id : localStorage.getItem('loggedId'),
                question_id : this.props.match.params.questionId,
                previous_vote : this.state.voteValue,
                next_vote : -1
            }

        } else {
            data = {
                user_id : localStorage.getItem('loggedId'),
                question_id : this.props.match.params.questionId,
                previous_vote : this.state.voteValue,
                next_vote : value
            }
        }
        

        // Execute function from API
        try {
            
            let res = await question_vote(data);

            // If success, change state
            if(res.response === 'success'){
                switch(value){
                    case 0:

                        // #1 Wasn't voted, next value is 0
                        if(this.state.isVoted === false){

                            this.setState({
                                votes : this.state.votes-1,
                                isVoted : true,
                                voteValue : value
                            })
                        }
                        // #2 Was voted and prev value was 0
                        else if ( this.state.isVoted === true &&
                                  this.state.voteValue === 0){

                                    this.setState({
                                        votes : this.state.votes+1,
                                        isVoted : false,
                                        voteValue : -1
                                    })

                                  }                       

                        // #3 Was voted and prev value was 1
                        else if ( this.state.isVoted === true &&
                            this.state.voteValue === 1){

                                this.setState({
                                    votes : this.state.votes-2,
                                    isVoted : true,
                                    voteValue : value
                                })

                            }

                        break;
                    case 1:
                        // #4 Wasn't voted, next value is 1
                        if(this.state.isVoted === false){

                            this.setState({
                                votes : this.state.votes+1,
                                isVoted : true,
                                voteValue : value
                            })
                        }
                        // #5 Was voted and prev value was 0
                        else if ( this.state.isVoted === true &&
                                this.state.voteValue === 0){

                                    this.setState({
                                        votes : this.state.votes+2,
                                        isVoted : true,
                                        voteValue : value
                                    })

                                }                       

                        // #6 Was voted and prev value was 1
                        else if ( this.state.isVoted === true &&
                            this.state.voteValue === 1){

                                this.setState({
                                    votes : this.state.votes-1,
                                    isVoted : false,
                                    voteValue : -1
                                })

                            }
                        break;
                }
            }
            else{
                throw 'failed';
            }

        } catch (error) {
           
            console.log(error);            
            alert('Wystąpił błąd, spróbuj ponownie później !');
        }
        }
        
        
    }

    /* voteUp = () => {
        if(localStorage.getItem("isLoggedIn")!=="false")
        {
            var data = {
                user_id : localStorage.getItem('loggedId'),
                question_id:this.state.qID,
                value : '1'
            };
            fetch("http://localhost:8080/api/question/vote", {
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
                .catch(err=>{
                    alert('Wystąpił błąd, spróbuj ponownie później !');
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
        if(localStorage.getItem("isLoggedIn")!=="false")
        {
            var data = {
                user_id : localStorage.getItem('loggedId'),
                question_id:this.state.qID,
                value : '0'
            };
            fetch("http://localhost:8080/api/question/vote", {
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
             .catch(err=>{
                alert('Wystąpił błąd, spróbuj ponownie później !');
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
    } */

    showLoginForm = () => {
        var loginForm = document.getElementById("loginForm");
        var loginContent = document.querySelector('.loginContent');

        loginForm.classList.remove("invisible");
        
        loginContent.classList.remove('fadeOutDown');
        loginContent.classList.add('zoomIn');

        this.setState({
            visibility : 'invisible'
        })

    }


    render(){

        var data = this.state.Question;
        let voteArrows='';

        if(this.state.Question !=null && this.state.isVoted!==null)
        {


            // Buttons for vote
            if(this.state.isVoted === false){
                voteArrows =  

                <div> 
                    <div className="plus" onClick={this.vote.bind(this,1)}>
                         <i className="fas fa-caret-up"></i>
                    </div>
                    <div className="minus" onClick={this.vote.bind(this,0)}>
                         <i className="fas fa-caret-down"></i>
                    </div>
                </div>

            } else if( this.state.isVoted && this.state.voteValue === 0 ){
                voteArrows = 

                   <div> 
                      <div className="plus" onClick={this.vote.bind(this,1)}>
                         <i className="fas fa-caret-up"></i>
                      </div>
                      <div className="minus" onClick={this.vote.bind(this,0)}
                           style={{'color' : 'red'}}>
                         <i className="fas fa-caret-down"></i>
                     </div>
                   </div>

            } else if(this.state.isVoted && this.state.voteValue === 1){
                voteArrows = 

                    <div> 
                        <div className="plus" onClick={this.vote.bind(this,1)}
                             style={{'color' : 'green'}}>
                            <i className="fas fa-caret-up"></i>
                        </div>
                        <div className="minus" onClick={this.vote.bind(this,0)}>
                            <i className="fas fa-caret-down"></i>
                        </div>
                    </div>                
            }
                       

            // Return
            return(
                <div>
                    <div className="topicsGroupTitle">{data.topic}</div>
                    <div className="topicsContent" id="topicsContent">


                        <div className="postContentHeader">

                            <div className="postContentEvaluations">


                                <div className="evaluationsButtons">
                                {
                                    voteArrows
                                }
                              
                                   
                                </div>
                                <span className="colorWhite votesCounter">
                                    {this.state.votes}
                                    <br/>głosów
                                </span>


                            </div>

                            <div className="postContentTopic">
                                <span className="colorWhite">Pytanie zadane  w kategorii </span>
                                <Link id="categoryLink" to={"/forum?sort=" + data.category}>{data.category}</Link> przez 

                                <Link id="userLink" to={"/uzytkownik/profil/" + data.login}> {data.login} </Link>
                                <br/><span className="creationDate"> {formatDate(data.creating_date)}</span>
                                <hr/>
                            </div>

                            <div className="userAvatar transition">
                                <Link to={"/uzytkownik/profil/" + data.login}><i className="fas fa-user"></i></Link>
                            </div>
                        </div>

                        <div className={`confirmationButton ${this.state.visibility}`} id="confirmationButton" onClick={this.showLoginForm}>
                             {this.state.voteMessage}
                        </div>

                        <div className="postContentMain">
                            <div className="postContent">


                                <div className="postContentText">
                                    {data.content_}
                                </div>


                                <div className="giveAnswer">
                                    <div className="answer transition" data-toggle="collapse" data-target="#ansDiv">
                                        Odpowiedz
                                    </div>
                                  
                                    <AnswerQuestionDiv answerAdded={this.answerAdded} questionId = {this.state.qID}/>
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
const mapDispatchToProps = {selectCurrentQuestion,answerAdded}

export const QuestionView = connect(mapStateToProps,mapDispatchToProps)(Question);