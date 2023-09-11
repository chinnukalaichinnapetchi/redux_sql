import { WEATHER_DETAILS } from "./Constant";

const instialState = {
    weather: [],

};

export const weatherReducer = (state = instialState, action) => {
    console.log("reducer", action);
    switch (action.type) {

        case WEATHER_DETAILS:
            return { ...state, weather: action.payload };

        default:
            return state;
    }
};