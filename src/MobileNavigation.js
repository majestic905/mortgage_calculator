import React from "react";
import cx from "classnames";

const MobileNavigation = ({currentPage, navigateTo}) => {
    return (
        <div id="navigation" className="btn-group btn-group-block">
            <button type="button" onClick={() => navigateTo("form")}
                    className={cx("btn btn-lg", {active: currentPage === "form"})}
            >
                <i className="icon icon-edit"/> <b>MORTGAGE</b>
            </button>

            <button type="button" onClick={() => navigateTo("table")}
                    className={cx("btn btn-lg", {active: currentPage === "table"})}
            >
                <i className="icon icon-menu"/> <b>PAYMENTS</b>
            </button>
        </div>
    );
};

export default MobileNavigation;