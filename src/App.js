import React, {useEffect, useReducer} from 'react';
import useFirebase from "./hooks/useFirebase";

import Loading from "./components/shared/Loading"
import SignInForm from "./components/shared/SignInForm";
import Desktop from "./Desktop";
import Mobile from "./Mobile";

import calculate from "./utils/calculate";
import './App.scss';


const reducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_PAYMENT': {
            const {id, name, value} = action.payload;
            const payments = state.payments.slice();
            payments[id] = {...payments[id], [name]: value};
            return {...state, payments};
        }
        case 'REMOVE_PAYMENT': {
            const id = action.payload.id;
            const payments = state.payments.slice();
            payments.splice(id, 1);
            return {...state, payments};
        }
        case 'ADD_PAYMENT': {
            const payments = state.payments.slice();
            payments.push({
                period: "0",
                startDate: "",
                nextPaymentType: "only_interest",
                reduceType: "reduce_sum",
                sum: "0"
            });
            return {...state, payments};
        }
        case 'CHANGE_CREDIT': {
            const credit = {...state.credit, [action.payload.name]: action.payload.value};
            return {...state, credit};
        }
        case 'SET_CURRENT_PAGE': {
            const page = action.payload.page;
            const schedule = page === "schedule" ? calculate(state.credit, state.payments) : state.schedule;
            return {...state, currentPage: page, schedule};
        }
        case 'SET_THEME':
            return {...state, theme: action.payload.theme};
        case 'LOGGED_IN': {
            if (!action.payload)
                return state; // new use logged in, nothing saved, return default state
            const newState = {...state, ...action.payload}; // action.payload is credit, payments, theme
            const schedule = calculate(newState.credit, newState.payments)
            return {...newState, schedule};
        }
        default:
            return state;
    }
};

const reducerInit = () => ({
    credit: {
        sum: "1000000",
        monthsNum: "60",
        startDate: "2019-01-10",
        percent: "12.5",
        paymentType: "annuity",
        paymentDay: "issue_day",
    },
    payments: [],
    theme: "light",
    currentPage: "params",
    layout: /iPhone|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
    schedule: {data: [], error: null}
});

const App = () => {
    const [{theme, currentPage, layout, credit, payments, schedule}, dispatch] = useReducer(reducer, null, reducerInit);
    const {user, persistData, signIn, signOut} = useFirebase(dispatch);

    // we want to persist credit parameters after every successful calculation
    useEffect(() => {
        if (user /* logged in */ && !schedule.error)
            persistData({credit, payments});
    }, [schedule, user, persistData]);

    useEffect(() => {
        if (user)
            persistData({theme});
    }, [theme, user, persistData]);

    if (user === undefined)
        return <Loading />

    if (user === null)
        return <SignInForm signIn={signIn}/>

    if (layout === "mobile") {
        return <Mobile credit={credit} payments={payments} schedule={schedule} dispatch={dispatch}
                       signOut={signOut} theme={theme} currentPage={currentPage} />;
    }

    return (
        <Desktop credit={credit} payments={payments} schedule={schedule} dispatch={dispatch} />
    );
}

export default App;