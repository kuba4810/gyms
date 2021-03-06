import React, { Component } from 'react';
import { render } from 'react-dom';
import {store} from './store'
import {Provider} from 'react-redux'

import './bootstrap/css/bootstrap.css'
import './styles/mainStyle.css'
import './styles/forumStyle.css'
import './styles/animations.css'
import './styles/userStyles.css'
import './styles/generalStyles.css'
// import './styles/gymStyle.css'


import './Fontello/css/fontello.css'

import App from './Components/App';



render(
<Provider store={store}>
    <App/>
</Provider>
, document.getElementById('root'));