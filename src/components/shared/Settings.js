import React from "react";
import './Settings.scss'

const Settings = ({theme, setTheme, signOut}) => {
    // TODO: change password, set up PIN, change PIN, discard PIN, set up FINGERPRINT, discard FINGERPRINT
    return (
        <div id="settings">
            <div className="form-group">
                <label className="form-switch">
                    <input type="checkbox" checked={theme === "dark"} onChange={ev => setTheme(ev.target.checked ? "dark" : "light")}/>
                    <i className="form-icon"/> Использовать темную тему
                </label>
            </div>

            <div className="form-group">
                <button type="button" className="btn mt-2 btn-lg btn-block">
                    <span className="material-icons">screen_lock_portrait</span>
                    Настроить PIN
                </button>
            </div>

            <div className="form-group">
                <button type="button" className="btn mt-2 btn-lg btn-block">
                    <span className="material-icons">fingerprint</span>
                    Настроить отпечаток
                </button>
            </div>

            <div className="form-group">
                <button type="button" className="btn mt-2 btn-lg btn-block">
                    <span className="material-icons">vpn_key</span>
                    Изменить пароль
                </button>
            </div>

            <div className="form-group">
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={signOut}>Выйти</button>
            </div>
        </div>
    );
};

export default Settings;