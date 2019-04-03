 import React from 'react';
 const spinner =() =>{
    return(
        <div className="newGymOverlay" >                    
            <div class="loaderContainer">
               <div class="loader"></div>
               <div class="loaderInner"></div>
               <div class="loaderInnerSmall"></div>
            </div>

          
        </div>
    );
}

export default spinner;