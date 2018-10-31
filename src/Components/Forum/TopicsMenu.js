import React from 'react'

import {connect} from 'react-redux'
import {searchQuestions} from '../../Actions'



class TMenu extends React.Component{

   handleSort = (e) => {
        var sortType = e.target.innerHTML;
        var newState = {
            text:'',
            category:'',
            sort:sortType,
            type:'input'
        }

        searchQuestions(newState);

   }
   render(){
        return(
        <div className="topicsMenu">
            <div className="topic  topicActive" style={{padding: "23px 0px"}} onClick={this.handleSort}> NAJNOWSZE </div>
            <div className="topic" style={{padding: "23px 0px"}}>NAJSTARSZE</div>
            <div className="topic">NAJWIĘCEJ ODPOWIEDZI</div>
            <div className="topic">BEZ ODPOWIEDZI</div>
            <div className="topic" style={{padding: "23px 0px"}}>CZĘSTO ODWIEDZANE</div>
        </div>
    );
   }
}

const mapStateToProps = state => {
    return{
        questionsSearch: state.questionsSearch
    };
}

const mapDispatchToProps = {searchQuestions}

export const TopicsMenu = connect(mapStateToProps,mapDispatchToProps)(TMenu);