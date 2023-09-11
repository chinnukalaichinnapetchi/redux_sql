import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { weatherReducer } from './Reducers';

const rootReducer = combineReducers({
    weather: weatherReducer,
});

const store = createStore(
    rootReducer,
    applyMiddleware(thunk),
);

export default store;