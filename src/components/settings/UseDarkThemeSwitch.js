import React from "react";

const UseDarkThemeSwitch = ({theme, setSetting}) => {
    return (
        <div className="form-group">
            <label className="form-switch">
                <input type="checkbox" checked={theme === "dark"} onChange={ev => setSetting('theme', ev.target.checked ? "dark" : "light")}/>
                <i className="form-icon"/> Использовать темную тему
            </label>
        </div>
    )
};

export default UseDarkThemeSwitch;