import React from "react";
import Form from "./components/desktop/Form";
import Schedule from "./components/shared/Schedule";

const Desktop = ({credit, payments, dispatch, calculate, schedule}) => {
    return (
        <div id="desktop" className="columns">
            <div className="column col-xl-12 col-6">
                <Form credit={credit} payments={payments} dispatch={dispatch} calculate={calculate}/>
            </div>
            <div className="column col-xl-12 col-6">
                <Schedule schedule={schedule}/>
            </div>
        </div>
    );
}

export default Desktop;