import React, {useCallback} from "react";
import Button from "./Button";

const Settings = ({settings, dispatch, signOut, mobile}) => {
    const {theme, showPercentage} = settings;

    const setSetting = useCallback(
        (name, value) => dispatch({type: "SET_SETTING", payload: {name, value}}),
        [dispatch]
    );

    // TODO: change password, set up PIN, change PIN, discard PIN, set up FINGERPRINT, discard FINGERPRINT
    return (
        <div id="settings">
            <div className="form-group">
                <label className="form-switch">
                    <input type="checkbox" checked={theme === "dark"} onChange={ev => setSetting('theme', ev.target.checked ? "dark" : "light")}/>
                    <i className="form-icon"/> Использовать темную тему
                </label>
            </div>

            <div className="form-group">
                <label className="form-switch">
                    <input type="checkbox" checked={showPercentage} onChange={ev => setSetting('showPercentage', ev.target.checked)}/>
                    <i className="form-icon"/> Показывать прогресс (проценты) в таблице
                </label>
            </div>

            {/*<div className="form-group">*/}
            {/*    <button type="button" className="btn mt-2 btn-lg btn-block">*/}
            {/*        <span className="material-icons">screen_lock_portrait</span>*/}
            {/*        Настроить PIN*/}
            {/*    </button>*/}
            {/*</div>*/}

            {/*<div className="form-group">*/}
            {/*    <button type="button" className="btn mt-2 btn-lg btn-block">*/}
            {/*        <span className="material-icons">fingerprint</span>*/}
            {/*        Настроить отпечаток*/}
            {/*    </button>*/}
            {/*</div>*/}

            {/*<div className="form-group">*/}
            {/*    <button type="button" className="btn mt-2 btn-lg btn-block">*/}
            {/*        <span className="material-icons">vpn_key</span>*/}
            {/*        Изменить пароль*/}
            {/*    </button>*/}
            {/*</div>*/}

            <div className="divider" />

            <div className="form-group">
                <Button primary large={mobile} block={mobile} onClick={signOut} content="Выйти" />
            </div>
        </div>
    );
};

export default Settings;