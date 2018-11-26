import {combineReducers} from 'redux'
import {questions} from './questions'
import {questionsSearch} from './questionsSearch'
import {user} from './user'
import {gym} from './gym'

export default combineReducers({
    questions,
    questionsSearch,
    gym,
    user

});