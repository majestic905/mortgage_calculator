import React from 'react';
import ChangePasswordModal from "./ChangePasswordModal";
import UseDarkThemeSwitch from "../UseDarkThemeSwitch";
import ShowPercentageSwitch from "../ShowPercentageSwitch";
import Button from "../../shared/Button";
import cx from "classnames";


const Settings = ({settings, dispatch, fb}) => {
    const {theme, showPercentage} = settings;
    const setSetting = React.useCallback(
        (name, value) => dispatch({type: "SET_SETTING", payload: {name, value}}),
        [dispatch]
    );

    const [doOpenModal, setDoOpenModal] = React.useState(null);

    return (
        <div id="settings">
            <UseDarkThemeSwitch theme={theme} setSetting={setSetting} />

            <ShowPercentageSwitch showPercentage={showPercentage} setSetting={setSetting} />

            <div className="divider" />

            <div className="form-group">
                <Button onClick={doOpenModal} link content="Изменить пароль" className="mr-2" />
                <Button primary onClick={fb.signOut} content="Выйти" />
            </div>

            <ChangePasswordModal provideOpen={setDoOpenModal} changePassword={fb.changePassword} />
        </div>
    );
};


const SettingsPanel = (props) => {
    const [collapsed, setCollapsed] = React.useState(true);
    const doToggle = React.useCallback(() => setCollapsed(collapsed => !collapsed), []);

    return (
        <div id="settings-panel">
            <div id="settings-toggle" className={cx("d-flex flex-centered c-hand", {active: !collapsed})} onClick={doToggle}>
                <i className={`icon icon-arrow-${collapsed ? 'down' : 'up'}`} />
            </div>
            {!collapsed && <Settings {...props} />}
        </div>
    )
};

export default SettingsPanel;