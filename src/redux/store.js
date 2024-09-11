import { applyMiddleware, combineReducers, createStore } from "redux";
import settingsReducer from "./reducers/settings-reducer";
import thunkMiddleware from "redux-thunk";

let reducers = combineReducers({ settingsReducer });

let store = createStore(reducers, applyMiddleware(thunkMiddleware));

export default store;
window.store = store;