import React, {useState, useEffect, useCallback, useReducer} from 'react';
import usePersistedJson from "./hooks/usePersistedJson";
import MobileNavigation from "./MobileNavigation";
import Form from "./Form";
import Calculation from './Calculation';
import calculate from "./calculate";
import './App.scss';

// TODO: every month 10k extra payment with default values leads to negative reduce in regular payment

function generateEmptyCredit() {
    return {
        sum: "1000000",
        monthsNum: "60",
        startDate: "2019-01-10",
        percent: "12.5",
        paymentType: "annuity",
        paymentDay: "issue_day",
        payments: []
    };
}
  
const reducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_CREDIT': {
            const credit = {...state.credit, [action.payload.name]: action.payload.value};
            return {...state, credit};
        }
        case 'CALCULATE': {
            const calculation = {};
            try {
                calculation.data = calculate(state.credit);
            } catch (error) {
                calculation.error = error;
            }
            return {...state, calculation};
        }
        default:
            return state;
    }
};

const reducerInit = (persistedCredit) => ({
    credit: persistedCredit,
    calculation: {data: calculate(persistedCredit), error: null}
});

const App = () => {
    const [persistedCredit, persistCredit] = usePersistedJson("credit", generateEmptyCredit);
    const [{credit, calculation}, dispatch] = useReducer(reducer, persistedCredit, reducerInit);

    // we want to persist credit parameters after every successful calculation
    useEffect(() => {
        if (!calculation.error)
            persistCredit(credit)
    }, [calculation]);

    const [currentPage, setCurrentPage] = useState("form");
    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isMobilePathname = window.location.pathname === "/mobile";
    const renderMobileLayout = isMobilePathname || isMobileDevice;

    const navigate = useCallback((page) => {
        if (page === "table")
            dispatch({type: 'CALCULATE'});
        setCurrentPage(page);
    }, []);
    
    if (renderMobileLayout)
        return (
            <div id="mobile">
                <MobileNavigation currentPage={currentPage} navigateTo={navigate}/>
                {currentPage === "form" && <Form credit={credit} dispatch={dispatch} mobile navigateTo={navigate}/>}
                {currentPage === "table" && <Calculation calculation={calculation}/>}
            </div>  
        );
    else
        return (
            <div id="desktop" className="columns">
                <div className="column col-xl-12 col-6">
                    <Form credit={credit} dispatch={dispatch}/>
                </div>
                <div className="column col-xl-12 col-6">
                    <Calculation calculation={calculation}/>
                </div>
            </div>
        );
}

export default App;