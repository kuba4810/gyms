import {combineReducers} from 'redux'
import {questions} from './questions'
import {questionsSearch} from './questionsSearch'
import {user} from './user'
import {gym} from './gym'
import {gymDetails} from './gymDetails'
import {answers} from './answers'


export default combineReducers({
    questions,
    questionsSearch,
    gym,
    user,
    gymDetails,
    answers

});