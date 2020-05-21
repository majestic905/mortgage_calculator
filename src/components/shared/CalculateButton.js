import React from "react";
import cx from "classnames";

const CalculateButton = ({onClick, block, large}) => {
    const className = cx("btn btn-primary", {"btn-block": block, "btn-lg": large});
    return <button type="button" className={className} onClick={onClick}>Рассчитать</button>;
}

export default CalculateButton;