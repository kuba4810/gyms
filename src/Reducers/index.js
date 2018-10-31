import {combineReducers} from 'redux'
import {questions} from './questions'
import {questionsSearch} from './questionsSearch'
import {user} from './user'

export default combineReducers({
    questions,
    questionsSearch,
    user
});