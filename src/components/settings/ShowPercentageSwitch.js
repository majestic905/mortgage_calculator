import React from "react";

const ShowPercentageSwitch = ({showPercentage, setSetting}) => {
    return (
        <div className="form-group">
            <label className="form-switch">
                <input type="checkbox" checked={showPercentage} onChange={ev => setSetting('showPercentage', ev.target.checked)}/>
                <i className="form-icon"/> Показывать прогресс (проценты) в таблице
            </label>
        </div>
    )
};

export default ShowPercentageSwitch;