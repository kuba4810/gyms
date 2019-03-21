import React from 'react'
import {Link} from 'react-router-dom'

class QuestionLink extends React.Component{
    constructor(){
        super(...arguments);
    }
   

    render(){
        const data =  this.props.questionData;
        return(
            <div className="post animated fadeInDown" style={{animationDelay:`.${this.props.delay}s`}} >
                <div className="stats">
                    <div className="ans"> {data.how_many_answers} <br/> odpowiedzi</div>
                    <div className="votes">{data.pluses - data.minuses}<br/> głosów</div>
                    <div className="clear:both"></div>
                </div>

                <div className="postTopic">
                    <Link  to={"/forum/pytanie/" + data.question_id + "/" + data.topic.toLowerCase().split(" ").join("-")}>{data.topic}</Link>
                </div>
                <div className="postData">
                    Dodany przez: <Link to={"/uzytkownik/profil/" + data.login} className="userLink">{data.login}</Link> <span className="creationDate">{data.creating_date.slice(0,10)}, {data.creating_date.slice(11,19)} Kategoria: {data.category}</span>
                </div>
            </div>


        );
    }
}
export default QuestionLink;