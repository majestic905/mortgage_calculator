import React, {useCallback} from "react";
import cx from "classnames";


const MobileNavigation = ({currentPage, dispatch}) => {
    const navigateTo = useCallback(
        (page) => dispatch({type: "SET_CURRENT_PAGE", payload: {page}}),
        [dispatch]
    );

    const buttonParams = (path) => ({
        onClick: () => navigateTo(path),
        className: cx('btn', {active: currentPage === path})
    });

    return (
        <div id="navigation" className="btn-group btn-group-block">
            <button type="button" {...buttonParams("params")}>
                <span className="material-icons">edit</span>
                <span>Параметры</span>
            </button>

            <button type="button" {...buttonParams("payments")}>
                <span className="material-icons">list_alt</span>
                <span>Платежи</span>
            </button>

            <button type="button" {...buttonParams("schedule")}>
                <span className="material-icons">table_chart</span>
                <span>График</span>
            </button>

            <button type="button" {...buttonParams("settings")}>
                <span className="material-icons">settings</span>
                <span>Настройки</span>
            </button>
        </div>
    );
};

export default MobileNavigation;