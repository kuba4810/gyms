import React from 'react'
import Answer from './Answer'
import {connect} from 'react-redux'
import {answersFetched,answerAdded,answerDeleted} from '../../../Actions/index'

class Answers extends React.Component{
    constructor(){
        super();

        this.state = {
            Answers:[]
        }
    }

    componentWillMount(){
        var questionId = this.props.questionId;
        console.log("Id pytania: " ,questionId);

        var data = {
            questionId: questionId
        }
        fetch("http://localhost:8080/getAnswers/"+questionId, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin", 
            headers: {
                "Content-Type": "application/json;",
            },
            redirect: "follow",
            referrer: "no-referrer",
        }).then(response => response.json())
            .then(
                (result) => {
                    this.props.answersFetched(result);
                    // this.setState({
                    //     Answers: result
                    // },()=>{console.log("Stan po załadowaniu odpowiedzi: ",this.state.Answers)});
                    console.log("Odpowiedzi: ",result);
                },

            );

    }    

    deleteAnswer = (answer_id) =>{

        console.log('Usuwam z magazynu odpowiedź : ',answer_id);
        
        this.props.answerDeleted(answer_id);

    }
  
    render(){
        let answers;
        if(this.props.answers.isLoading === false){
            answers = this.props.answers.answerList.map( answer =>  
                <Answer key={answer.answer_id} answerData={answer} deleteAnswer = {this.deleteAnswer}/> )
        }
        return(
            <div>{answers}</div>
        );

        // if(this.state.Answers.length > 0)
        // {
        //     return(

        //      <div>
        //          { this.state.Answers.map( answer =>  <Answer key={answer.answer_id} answerData={answer}/> )}
                 
        //      </div>
        //     );
        // }
        // else{
        //     return(
        //         <div></div>
        //     );
        // }
    }
}

const mapStateToProps = state =>{
    return {
        answers : state.answers
    }
}

const mapDispatchToProps = {answerAdded,answersFetched,answerDeleted}

const AnswersList = connect(mapStateToProps,mapDispatchToProps)(Answers);

export default AnswersList;