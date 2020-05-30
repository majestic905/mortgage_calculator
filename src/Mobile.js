import React from "react";
import MobileNavigation from "./components/mobile/MobileNavigation";
import ScreenParams from "./components/mobile/ScreenParams";
import ScreenPayments from "./components/mobile/ScreenPayments";
import Schedule from "./components/shared/Schedule";
import Settings from "./components/shared/Settings";

const Mobile = ({credit, payments, dispatch, signOut, schedule, theme, currentPage}) => {
    return (
        <div id="mobile" className={`theme-${theme}`}>
            <MobileNavigation currentPage={currentPage} dispatch={dispatch}/>
            {currentPage === "params" && <ScreenParams credit={credit} dispatch={dispatch}/>}
            {currentPage === "payments" && <ScreenPayments payments={payments} dispatch={dispatch}/>}
            {currentPage === "schedule" && <Schedule schedule={schedule}/>}
            {currentPage === "settings" && <Settings theme={theme} dispatch={dispatch} signOut={signOut}/>}
        </div>
    )
};

export default Mobile;