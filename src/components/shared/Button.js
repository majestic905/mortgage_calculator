import React from "react";
import cx from "classnames";

const Button = ({block, large, small, primary, link, loading, type = "button", id, onClick, className, content, children}) => {
    const modifiers = {'btn-primary': primary, "btn-block": block, "btn-lg": large, 'btn-sm': small, 'btn-link': link, loading};
    const _className = cx("btn", modifiers, className);

    return (
        <button type={type} id={id} className={_className} onClick={onClick}>
            {content || children}
        </button>
    );
}

export default Button;