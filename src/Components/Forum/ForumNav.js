import React from 'react'
import {connect} from 'react-redux'
import {searchQuestions,changeCategory} from '../../Actions'
import {Link} from 'react-router-dom'


class ForumNav extends React.Component{

    constructor(){
        super();
    
    }
    

    searchByCategory = (e) => {
        e.stopPropagation();
        console.log(e.target.id);
        var category = e.target.id;

        var newState = {
            text: '',
            category:category,
            sort:'newest',
            type:'category'
        }
        
        this.props.searchQuestions(newState);
        this.props.changeCategory(e.target.id.toUpperCase())
    }

    handleChange = (e) =>{

        var newState = {
            text: e.target.value,
            category:'',
            sort:'newest',
            type:'input'
        }
        this.props.searchQuestions(newState);
        
        if(e.target.value.length == 0){
            this.props.changeCategory('WSZYSTKIE');

        }
        else{           
           
            this.props.changeCategory('WYSZUKIWANIE');
        }
        
     


    }
    render(){
        return(
            <div className="forumNav" id="forumNav">
    
    
                <div className="inputHolder">
                    <input className="topicsSearch" 
                    type="text" 
                    placeholder="Wyszukaj pytania..."
                    value = {this.props.questionsSearch.text}
                    onChange = {this.handleChange}
                    />
                    <div className="searchIcon">
                        <i className="fas fa-search"></i>
                    </div>
                </div>
    
    
                <div className="askQuestion">
                    <Link to="/forum/zadaj-pytanie">Zadaj pytanie</Link>
                </div>
    
    
                <div className="categories">
                    <div className="categoriesTitle">
                        Kategorie pytań
                    </div>
    
                    <div className="categoriesItems">
                        <div className="category" id="Treningi" onClick={this.searchByCategory}>
                            <i className="fas fa-dumbbell"  id="Treningi"></i>
                            <div className="tooltip animated">Treningi</div>
                        </div>
                        <div className="category"  id="Siłownie" onClick={this.searchByCategory}> 
                            <i className="fas fa-school" id="Siłownie" ></i>
                            <div className="tooltip">Siłownie</div>
                        </div>
                        <div className="category" id="Dieta" onClick={this.searchByCategory}>
                            <i className="demo-icon icon-food" id="Dieta"></i>
                            <div className="tooltip">Dieta</div>
                        </div>
                        <div className="category" id="Sprzęt" onClick={this.searchByCategory}>
                            <i className="fas fa-cog" id="Sprzęt"></i>
                            <div className="tooltip">Sprzęt</div>
                        </div>
                        <div className="category" id="Suplementy" onClick={this.searchByCategory}>
                            <i className="fas fa-pills" id="Suplementy"></i>
                            <div className="tooltip">Suplementy</div>
                        </div>
                        <div className="category" id="Muzyka" onClick={this.searchByCategory}>
                            <i className="demo-icon icon-note-beamed" id="Muzyka"></i>
                            <div className="tooltip">Muzyka</div>
                        </div>
                        <div className="category" id="Zawody" onClick={this.searchByCategory}>
                            <i className="demo-icon icon-trophy" id="Zawody"></i>
                            <div className="tooltip">Zawody</div>
                        </div>
                        <div className="category" id="Zdrowie" onClick={this.searchByCategory}>
                            <i className="demo-icon icon-heart" id="Zdrowie" ></i>
                            <div className="tooltip">Zdrowie</div>
                        </div>
                        <div className="category" id="Ciekawostki" onClick={this.searchByCategory}>
                            <i className="demo-icon icon-star-filled" id="Ciekawostki"></i>
                            <div className="tooltip">Ciekawostki</div>
                        </div>
                    </div>
                    
                  
                </div>
                
    
                <div className="socialMedia">
                    <div className="media animated"><a href="#"><i className="fab fa-facebook-square"></i></a></div>
                    <div className="media animated"><a href="#"><i className="fab fa-youtube"></i></a></div>
                    <div className="media animated"><a href="#"><i className="fab fa-twitter"></i></a></div>
                    <div className="media animated"><a href="#"><i className="fab fa-instagram"></i></a></div>
                    <div className="clear" style={{clear:"both"}}></div>
                </div>
    
    
            </div>
        );
    }
}

const mapStateToProps = state => {
    return{
        questionsSearch: state.questionsSearch
    };
}

const mapDispatchToProps = {searchQuestions,changeCategory}

export const ForumNavContainer = connect(mapStateToProps,mapDispatchToProps)(ForumNav);