import React, { Component } from 'react';

class SectionGym extends Component {
    state = {  }
    render() { 
    return (
      <React.Fragment>
          <section>
            <h1>Znajdź siłownię lub fitness w Twoim rejonie</h1>
            <p>Pełne oferty siłowni wraz z opiniami i galerią</p>
            <div class="search-box">
              <input
                class="search-txt"
                type="text"
                name=""
                placeholder="Wyszukaj"
              />
            </div>
            <form>
              <div class="btn">
                <button type="button" id="add-gym">
                  <a href="">Dodaj siłownię</a>
                </button>
              </div>
            </form>
          </section>
      </React.Fragment>
    );
  };
}

export default SectionGym;