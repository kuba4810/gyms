import React from "react";
import {Link} from 'react-router-dom'

const AppHeader = () =>{
    return(
        <header className="mainPageHeader">
            <div className="caption animated">
                <i className="fas fa-dumbbell"></i> SIŁOWNIE.INFO <i className="fas fa-dumbbell"></i> <br/>
            </div>
            <hr/>
            <span className="underTitle animated">ZNAJDŹ SWOJĄ SIŁOWNIE</span>
            <span className="secondUnderTitle animated">ZACZNIJ TRENING JUŻ DZIŚ</span>
        </header>
    );
}


const AppMain =() => {
    return (
        <main className="mainPageMain">

            <div className="grid animated">
                <div className="item">
                    <Link to="/silownie">
                        <img src={require("../images/findYourGym.jpg")} alt="wyszukiwarka-silowni"/>
                        <div className="itemCaption">Siłownie</div>
                        <div className="itemInfo animated">Znajdź siłownię w twojej okolicy</div>
                        <div className="itemSecondInfo animated">Lub dodaj własna</div>

                    </Link>
                </div>
                <div className="item">
                    <Link to="/trenerzy">
                        <img src={require("../images/personalTrainer.jpg")} alt="wyszukaj-trenera"/>
                        <div className="itemCaption ">Trenerzy</div>
                        <div className="itemInfo animated">Umów się na ćwiczenia z trenerem</div>
                        <div className="itemSecondInfo animated">Zamów specjalną dietę</div>
                    </Link>
                </div>
                <div className="item">
                    <Link to="/forum">
                        <img src={require("../images/gymForum.jpg")} alt="forum-dyskusyjne"/>

                        <div className="itemCaption">Forum Dyskusyjne</div>
                        <div className="itemInfo animated">Porozmawiaj z ekspertami treningach</div>
                        <div className="itemSecondInfo animated">Forum otwarte dla wszystkich</div>
                    </Link>
                </div>
            </div>

        </main>
    );
}

const AppFooter = () =>{
    return(
        <footer>
            <span className="footerText">&copy; Kozioł & Koczaski 2018</span>
        </footer>
    );
}

const mainPage = () => {
    return(
        <div>
            <AppHeader/>
            <AppMain/>
            <AppFooter/>
        </div>
    );
}

export default mainPage;