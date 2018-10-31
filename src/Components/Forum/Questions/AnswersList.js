import React from 'react'
import Answer from './Answer'
class AnswersList extends React.Component{
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
        /*data = JSON.stringify(data);*/
        fetch("http://localhost:8080/getAnswers/"+questionId, {
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
                        Answers: result
                    },()=>{console.log("Stan po załadowaniu odpowiedzi: ",this.state.Answers)});
                    console.log("Odpowiedzi: ",result);
                },

            );
    }

    render(){
        if(this.state.Answers.length > 0)
        {
            return(

             <div>
                 { this.state.Answers.map( answer =>  <Answer key={answer.answer_id} answerData={answer}/> )}
             </div>
            );
        }
        else{
            return(
                <div></div>
            );
        }
    }
}

export default AnswersList;