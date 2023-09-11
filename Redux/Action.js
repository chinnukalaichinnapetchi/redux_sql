import { WEATHER_DETAILS } from "./Constant";
export const weatherdetail = data => (dispatch) => {
    console.log('action', data);
    dispatch({
        type: WEATHER_DETAILS,
        payload: data
    });
}