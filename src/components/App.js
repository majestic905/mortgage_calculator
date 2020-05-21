import React, {useEffect, useCallback, useReducer} from 'react';
import useFirebase from "../hooks/useFirebase";

import MobileNavigation from "./mobile/MobileNavigation";
import ScreenParams from "./mobile/ScreenParams";
import ScreenPayments from "./mobile/ScreenPayments";

import Form from "./desktop/Form";

import Schedule from './shared/Schedule';
import Settings from "./shared/Settings"
import SignInForm from "./shared/SignInForm";
import Loading from "./shared/Loading"

import calculate from "../utils/calculate";


// TODO: every month 10k extra payment with default values leads to negative reduce in regular payment
  
const reducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_CREDIT': {
            const credit = {...state.credit, [action.payload.name]: action.payload.value};
            return {...state, credit};
        }
        case 'CALCULATE': {
            const schedule = calculate(state.credit);
            return {...state, schedule, currentPage: "schedule"};
        }
        case 'SET_CURRENT_PAGE': {
            const page = action.payload.page;
            const schedule = page === "schedule" ? calculate(state.credit) : state.schedule;
            return {...state, currentPage: page, schedule};
        }
        case 'SET_THEME':
            return {...state, theme: action.payload.theme};
        case 'LOGGED_IN': {
            if (!action.payload)
                return state;
            const credit = {...state.credit, ...action.payload.credit}; // firebase doesn't store empty arrays (payments = [])
            const theme = action.payload.theme || state.theme;
            const schedule = calculate(credit)
            return {...state, theme, credit, schedule};
        }
        default:
            return state;
    }
};

const reducerInit = () => ({
    theme: "light",
    currentPage: "params",
    layout: /iPhone|iPad|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
    credit: {
        sum: "1000000",
        monthsNum: "60",
        startDate: "2019-01-10",
        percent: "12.5",
        paymentType: "annuity",
        paymentDay: "issue_day",
        payments: []
    },
    schedule: {data: [], error: null}
});

const App = () => {
    const [{theme, currentPage, layout, credit, schedule}, dispatch] = useReducer(reducer, null, reducerInit);
    const {user, setTheme, setCredit, signIn, signOut} = useFirebase(dispatch);

    // we want to persist credit parameters after every successful calculation
    useEffect(() => {
        if (user /* logged in */ && !schedule.error)
            setCredit(credit);
    }, [schedule, user, setCredit]);

    const navigateTo = useCallback((page) => dispatch({type: "SET_CURRENT_PAGE", payload: {page}}), []);
    const calculate = useCallback(() => dispatch({type: 'CALCULATE'}), []);

    if (user === undefined)
        return <Loading />

    if (user === null)
        return <SignInForm signIn={signIn}/>

    if (layout === "mobile") {
        return (
            <div id="mobile" className={`theme-${theme}`}>
                <MobileNavigation currentPage={currentPage} navigateTo={navigateTo}/>
                {currentPage === "params" && <ScreenParams credit={credit} dispatch={dispatch} calculate={calculate}/>}
                {currentPage === "payments" && <ScreenPayments credit={credit} dispatch={dispatch} calculate={calculate}/>}
                {currentPage === "schedule" && <Schedule schedule={schedule}/>}
                {currentPage === "settings" && <Settings theme={theme} setTheme={setTheme} signOut={signOut}/>}
            </div>
        );
    }

    return (
        <div id="desktop" className="columns theme-light">
            <div className="column col-xl-12 col-6">
                <Form credit={credit} dispatch={dispatch} calculate={calculate}/>
            </div>
            <div className="column col-xl-12 col-6">
                <Schedule schedule={schedule}/>
            </div>
        </div>
    );
}

export default App;