import React from "react";
import cx from "classnames";

const Button = ({block, large, small, primary, loading, content, id, onClick, children}) => {
    const className = cx("btn", {'btn-primary': primary, "btn-block": block, "btn-lg": large, 'btn-sm': small, loading});
    return <button type="button" id={id} className={className} onClick={onClick}>{content || children}</button>;
}

export default Button;