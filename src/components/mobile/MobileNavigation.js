import React from "react";
import cx from "classnames";
import './MobileNavigation.scss'

const MobileNavigation = ({currentPage, navigateTo}) => {
    const buttonParams = (path) => ({
        onClick: () => navigateTo(path),
        className: cx('btn btn-lg', {active: currentPage === path})
    });

    return (
        <div id="navigation" className="btn-group btn-group-block">
            <button type="button" {...buttonParams("params")}>
                <span className="material-icons">edit</span>
                <span className="small-caps">Параметры</span>
            </button>

            <button type="button" {...buttonParams("payments")}>
                <span className="material-icons">list_alt</span>
                <span className="small-caps">Платежи</span>
            </button>

            <button type="button" {...buttonParams("schedule")}>
                <span className="material-icons">table_chart</span>
                <span className="small-caps">График</span>
            </button>

            <button type="button" {...buttonParams("settings")}>
                <span className="material-icons">settings</span>
                <span className="small-caps">Настройки</span>
            </button>
        </div>
    );
};

export default MobileNavigation;