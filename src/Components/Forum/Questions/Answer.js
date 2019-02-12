import React from 'react'
import {Link} from 'react-router-dom'
import {formatDate} from '../../../services/dateService'
import {is_answer_voted,answer_vote} from '../../../services/API/user';

class Answer extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            visibility : 'invisible',
            votes: (this.props.answerData.pluses - this.props.answerData.minuses),
            isVoted : null,
            voteValue : null
        }


    }

    componentDidMount = async () =>{
        const userId = localStorage.getItem('loggedId');
        console.log('Zalogowany user : ',userId);
        
        let answer_id = this.props.answerData.answer_id;
        let res;

        res = await is_answer_voted(answer_id,userId);

        if(res.response === 'success'){
            this.setState({
                isVoted : res.value,
                voteValue : res.vote_value
            },()=>{
                console.log('Answer view state : ',this.state);
                
            })
        }
    }

    vote = async (value) =>{
        
        // Prepare data to send
        let data = null;

        if(this.state.voteValue === -1){
            
            data = {
                user_id : localStorage.getItem('loggedId'),
                answer_id : this.props.answerData.answer_id,
                previous_vote : this.state.voteValue,
                next_vote : value
            }

        } else if(this.state.voteValue === value){

            data = {
                user_id : localStorage.getItem('loggedId'),
                answer_id : this.props.answerData.answer_id,
                previous_vote : this.state.voteValue,
                next_vote : -1
            }

        } else {
            data = {
                user_id : localStorage.getItem('loggedId'),
                answer_id : this.props.answerData.answer_id,
                previous_vote : this.state.voteValue,
                next_vote : value
            }
        }
        
        console.log('Dane do serwera : ',data);
        

        // Execute function from API
        try {
            
            let res = await answer_vote(data);

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


    /* voteUp = () => {
        if(localStorage.getItem("isLoggedIn")!=="false")
        {
            this.setState({
                visibility : 'invisible'
            })

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
            this.setState({
                visibility : ''
            })
        }
        
        
    }

    voteDown = () =>{
        if(localStorage.getItem("isLoggedIn")!=="false")
        {
            this.setState({
                visibility : 'invisible'
            })
            var data = {
                user_id : localStorage.getItem('loggedId'),
                answer_id:this.props.answerData.answer_id,
                value : '0'
            };
            fetch("http://localhost:8080/api/answer/vote", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin", 
             
                body: JSON.stringify(data), 
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
                .then( (response)=> {
                    this.setState({votes: response.votes_count});
                })
        }
        else{
            this.setState({
                visibility : ''
            })
              
         }

    } */

    showLoginForm = () => {
        var loginForm = document.getElementById("loginForm");
            var loginContent = document.querySelector('.loginContent');

            loginForm.classList.remove("invisible");
            
            loginContent.classList.remove('fadeOutDown');
            loginContent.classList.add('zoomIn');

    }

    render(){

        var data = this.props.answerData;
        let voteArrows = '';

        if(this.state.isVoted !== null) {
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
        }
        return(
            <div className="answers">
                <div className="postContentHeader">

                    <div className="postContentEvaluations">

                        <div className="evaluationsButtons">
                            {voteArrows}
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

                 <div className={`confirmationButton ${this.state.visibility}`} onClick={this.showLoginForm}>
                     Zaloguj się by móc głosować
                </div>


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