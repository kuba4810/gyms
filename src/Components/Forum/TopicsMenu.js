import React from 'react'

import {connect} from 'react-redux'
import {searchQuestions,sortChanged} from '../../Actions'

const topicActive = {
    backgroundColor : 'cornsilk',
    color : 'red'
}

class TMenu extends React.Component{

    constructor(){
        super();

        this.state = {
            activeLink : 'newest'
        }
    }


   changeSortType = (e) => {       
        this.props.sortChanged(e.target.id);     
        this.setState({
            activeLink : e.target.id
        })          

   }
   render(){
        return(
        <div className="topicsMenu">

            {/* Newest */}
            {
                this.state.activeLink === 'newest' ? 
                <div className="topic" style={topicActive}
                    id="newest"
                    onClick={this.changeSortType}>
                    NAJNOWSZE 
                </div> :
                <div className="topic" 
                   id="newest"
                   onClick={this.changeSortType}>
                   NAJNOWSZE 
               </div>
            }

            {/* Oldest */}
            {
                this.state.activeLink === 'oldest' ?
                <div className="topic" style={topicActive}
                    id="oldest"
                    onClick={this.changeSortType}>
                    NAJSTARSZE
                </div> :

                <div className="topic"
                   id="oldest"
                   onClick={this.changeSortType}>
                   NAJSTARSZE
                </div>
            }

            {/* Most answered */}
            {
                this.state.activeLink === 'most_answered' ?
                <div className="topic" style={ topicActive}
                     id="most_answered"
                     onClick={this.changeSortType}>
                     NAJWIĘCEJ ODPOWIEDZI
                </div> :
                 <div className="topic"
                     id="most_answered"
                     onClick={this.changeSortType}>
                     NAJWIĘCEJ ODPOWIEDZI
                 </div>

            }

            {/* Without answers */}
            {
                this.state.activeLink === 'without_answers' ?
                <div className="topic" style={topicActive} 
                     id="without_answers"
                     onClick={this.changeSortType}>
                     BEZ ODPOWIEDZI
                </div> :
                <div className="topic"
                    id="without_answers"
                    onClick={this.changeSortType}>
                    BEZ ODPOWIEDZI
                </div>
            }

            {/* Most rated */}
            {
                this.state.activeLink === 'most_rated' ?
                <div className="topic" style={topicActive} 
                     id="most_rated" 
                     onClick={this.changeSortType}>
                     NAJWYŻEJ OCENIANE
                 </div>:
                <div className="topic"
                    id="most_rated" 
                    onClick={this.changeSortType}>
                    NAJWYŻEJ OCENIANE
                </div>
            }

        </div>
    );
   }
}

const mapStateToProps = state => {
    return{
        questionsSearch: state.questionsSearch
    };
}

const mapDispatchToProps = {searchQuestions,sortChanged}

export const TopicsMenu = connect(mapStateToProps,mapDispatchToProps)(TMenu);