import React from "react";
import SettingsPanel from "./components/settings/desktop/SettingsPanel";
import Form from "./components/desktop/Form";
import Schedule from "./components/shared/Schedule";
import './Desktop.scss';


const Desktop = ({credit, payments, dispatch, calculate, schedule, settings, fb}) => {
    return (
        <div id="desktop" className={`columns theme-${settings.theme}`}>
            <div className="column col-xl-12 col-6">
                <SettingsPanel settings={settings} dispatch={dispatch} fb={fb} />
                <Form credit={credit} payments={payments} dispatch={dispatch} calculate={calculate}/>
            </div>
            <div className="column col-xl-12 col-6">
                <Schedule schedule={schedule} showPercentage={settings.showPercentage}/>
            </div>
        </div>
    );
}

export default Desktop;