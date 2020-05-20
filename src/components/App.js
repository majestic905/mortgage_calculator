import React, {useEffect, useCallback, useReducer} from 'react';
import useFirebase from "../hooks/useFirebase";

import MobileNavigation from "./MobileNavigation";
import Form from "./Form";
import Calculation from './Calculation';
import Settings from "./Settings"
import SignInForm from "./SignInForm";

import calculate from "../utils/calculate";


// TODO: every month 10k extra payment with default values leads to negative reduce in regular payment
  
const reducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_CREDIT': {
            const credit = {...state.credit, [action.payload.name]: action.payload.value};
            return {...state, credit};
        }
        case 'CALCULATE': {
            const calculation = calculate(state.credit);
            return {...state, calculation, currentPage: "table"};
        }
        case 'SET_CURRENT_PAGE': {
            const page = action.payload.page;
            const calculation = page === "table" ? calculate(state.credit) : state.calculation;
            return {...state, currentPage: page, calculation};
        }
        case 'SET_THEME':
            return {...state, theme: action.payload.theme};
        case 'LOGGED_IN': {
            if (!action.payload)
                return state;
            const credit = {...state.credit, ...action.payload.credit};
            const theme = action.payload.theme || state.theme;
            const calculation = calculate(credit)
            return {...state, theme, credit, calculation};
        }
        default:
            return state;
    }
};

const reducerInit = () => ({
    theme: "light",
    currentPage: "form",
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
    calculation: {data: [], error: null}
});

const App = () => {
    const [{theme, currentPage, layout, credit, calculation}, dispatch] = useReducer(reducer, null, reducerInit);
    const {user, setTheme, setCredit, signIn, signOut} = useFirebase(dispatch);

    // we want to persist credit parameters after every successful calculation
    useEffect(() => {
        if (user /* logged in */ && !calculation.error)
            setCredit(credit);
    }, [calculation, user, setCredit]);

    const navigateTo = useCallback((page) => dispatch({type: "SET_CURRENT_PAGE", payload: {page}}), []);
    const calculate = useCallback(() => dispatch({type: 'CALCULATE'}), []);

    if (user === undefined)
        return <div className="loading loading-lg"/>;

    if (user === null)
        return <SignInForm signIn={signIn}/>

    if (layout === "mobile") {
        return (
            <div id="mobile" className={`theme-${theme}`}>
                <MobileNavigation currentPage={currentPage} navigateTo={navigateTo}/>
                {currentPage === "form" && <Form credit={credit} dispatch={dispatch} calculate={calculate} mobile/>}
                {currentPage === "table" && <Calculation calculation={calculation}/>}
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
                <Calculation calculation={calculation}/>
            </div>
        </div>
    );
}

export default App;