import React from 'react';
import Settings from '../shared/Settings';


const SettingsPanel = ({settings, dispatch, signOut}) => {
    const [collapsed, setCollapsed] = React.useState(true);

    return (
        <div id="settings-panel">
            <div id="settings-toggle" className="d-flex flex-centered c-hand" onClick={() => setCollapsed(collapsed => !collapsed)}>
                <i className={`icon icon-arrow-${collapsed ? 'down' : 'up'}`} />
            </div>
            {!collapsed && <Settings settings={settings} dispatch={dispatch} signOut={signOut} />}
        </div>
    )
};

export default SettingsPanel;