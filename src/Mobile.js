import React from "react";
import MobileNavigation from "./components/mobile/MobileNavigation";
import FieldsParams from "./components/shared/FieldsParams";
import FieldsPayments from "./components/shared/FieldsPayments";
import Schedule from "./components/shared/Schedule";
import Settings from "./components/settings/mobile/Settings";
import './Mobile.scss';


const ScreenParams = ({dispatch, credit}) => {
    return (
        <div id="form">
            <FieldsParams credit={credit} dispatch={dispatch} />
        </div>
    )
};

const ScreenPayments = ({dispatch, payments}) => {
    return (
        <div id="form">
            <FieldsPayments mobile payments={payments} dispatch={dispatch}/>
        </div>
    )
};


const Mobile = ({credit, payments, schedule, settings, currentPage, dispatch, fb}) => {
    const {theme, showPercentage} = settings;

    return (
        <div id="mobile" className={`theme-${theme}`}>
            <MobileNavigation currentPage={currentPage} dispatch={dispatch}/>
            {currentPage === "params" && <ScreenParams credit={credit} dispatch={dispatch}/>}
            {currentPage === "payments" && <ScreenPayments payments={payments} dispatch={dispatch}/>}
            {currentPage === "schedule" && <Schedule schedule={schedule} showPercentage={showPercentage}/>}
            {currentPage === "settings" && <Settings settings={settings} dispatch={dispatch} fb={fb}/>}
        </div>
    )
};

export default Mobile;