import React from "react";
import './Settings.scss'

const Settings = ({theme, setTheme, signOut}) => {
    // TODO: change password, set up PIN, change PIN, discard PIN, set up FINGERPRINT, discard FINGERPRINT
    return (
        <div id="settings">
            <div className="form-group">
                <label className="form-switch">
                    <input type="checkbox" checked={theme === "dark"} onChange={ev => setTheme(ev.target.checked ? "dark" : "light")}/>
                    <i className="form-icon"/> Use dark theme
                </label>
            </div>

            <div className="form-group">
                <button type="button" className="btn mt-2 btn-lg btn-block">Set up PIN unlock</button>
                <button type="button" className="btn mt-2 btn-lg btn-block">Discard PIN unlock</button>
            </div>

            <div className="form-group">
                <button type="button" className="btn mt-2 btn-lg btn-block">Set up fingerprint unlock</button>
                <button type="button" className="btn mt-2 btn-lg btn-block">Discard fingerprint unlock</button>
            </div>

            <div className="form-group">
                <button type="button" className="btn mt-2 btn-lg btn-block">Change password</button>
            </div>

            <div className="form-group">
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={signOut}>Sign out</button>
            </div>
        </div>
    );
};

export default Settings;