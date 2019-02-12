import React, {Component} from 'react'
import QuestionLink from './QuestionLink'

import {connect} from 'react-redux'
import {getFilteredQuestions} from '../../../Selectors/filterQuestions'
import {questionsFetched} from '../../../Actions'

class QuestionList extends Component{
    constructor(){
        super();
    }

    componentDidMount(){

        
        

        document.querySelector(".forumNav").classList.remove("invisible");
        document.querySelector(".forumContent").style.width="74.5%";
        document.querySelector(".topicsMenu").classList.remove("invisible");

        

        fetch("http://localhost:8080/getAllQuestions/"+this.props.sort)
           .then(res => res.json())
            .then(
                (result) => {
                   this.props.questionsFetched(result);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
            );
            
    }

 
    componentDidUpdate = (next) =>{
       if(this.props.sort !== next.sort){
        fetch("http://localhost:8080/getAllQuestions/"+this.props.sort)
        .then(res => res.json())
         .then(
             (result) => {
                this.props.questionsFetched(result);
             },
         );
       }
        
    }
    render(){

        var questions
        var i=0;
                   
        if(this.props.questions.length > 0){
            questions = this.props.questions.map(question => <QuestionLink key={question.question_id} delay={++i} questionData={question}/>);
        }
        else if(this.props.questions.length > 0 && !this.props.isLoading){
            questions = 
                <div style={{ "text-align":"center"}}>
                    
                   
                <div class="loaderContainer">
                    <div class="loader">
                    </div>
                    <div class="loaderInner">
        
                    </div>
        
                    <div class="loaderInnerSmall">
        
                    </div>
        
                </div>
                </div>
        }
        else{
           questions= <div style={{ "text-align":"center"}}>
                    Brak pytań z tej kategorii
            </div>
        }

       

            return(
                <div>
                    <div className="topicsGroupTitle">{this.props.category}</div>
                    <div className="topicsContent" id="topicsContent">
                    { questions}
                    </div>
                </div>
            );
        

    }
}

const mapStateToProps = state => {
    return{
        questions: getFilteredQuestions(state.questions.questionsList,state.questionsSearch),
        sort : state.questions.sort,
        category: state.questions.category
    };
}

const mapDispatchToProps = {questionsFetched}

export const QuestionListContainer = connect(mapStateToProps,mapDispatchToProps)(QuestionList);


