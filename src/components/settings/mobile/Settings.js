import React, {useCallback} from "react";
import ChangePasswordForm from "./ChangePasswordForm";
import UseDarkThemeSwitch from "../UseDarkThemeSwitch";
import ShowPercentageSwitch from "../ShowPercentageSwitch";

// TODO: set up PIN, change PIN, discard PIN, set up FINGERPRINT, discard FINGERPRINT
// Material icons: PIN screen_lock_portrait, fingerprint fingerprint

const Settings = ({settings, dispatch, fb}) => {
    const {theme, showPercentage} = settings;
    const setSetting = useCallback(
        (name, value) => dispatch({type: "SET_SETTING", payload: {name, value}}),
        [dispatch]
    );

    const [isFormShown, setIsFormShown] = React.useState(false);
    const doToggle = React.useCallback(() => setIsFormShown(shown => !shown), []);

    return (
        <div id="settings">
            <div className="text-center">
                <img src="/logo192.png" className="img-responsive p-centered" alt="Logo"/>
                <div className="h3">Mortgage Calculator</div>
                <p className="h5">Version: {process.env.REACT_APP_VERSION}</p>
            </div>

            <UseDarkThemeSwitch theme={theme} setSetting={setSetting} />

            <ShowPercentageSwitch showPercentage={showPercentage} setSetting={setSetting} />

            <div className="form-group">
                <div className="tile tile-centered" onClick={doToggle}>
                    <div className="tile-icon"><span className="material-icons">vpn_key</span></div>
                    <div className="tile-content">Изменить пароль</div>
                </div>

                {isFormShown && <ChangePasswordForm changePassword={fb.changePassword}/>}
            </div>

            <div className="form-group">
                <div className="tile tile-centered" onClick={fb.signOut}>
                    <div className="tile-icon"><span className="material-icons">exit_to_app</span></div>
                    <div className="tile-content">Выйти</div>
                </div>
            </div>
        </div>
    );
};

export default Settings;