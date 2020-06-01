import React from "react";
import cx from "classnames";

const InputField = ({id, name, type = "text", value, label, onChange,
                     large, small,
                     labelClass, inputClass, wrapperClass,
                     inputProps, labelProps, wrapperProps}) => {
    const wrapperCl = cx("form-group", wrapperClass);
    const labelCl = cx("form-label", {"label-lg": large, "label-sm": small}, labelClass);
    const inputCl = cx("form-input", {"input-lg": large, "input-sm": small}, inputClass);
    id = id || name;

    return (
        <div className={wrapperCl} {...wrapperProps}>
            <label htmlFor={id} className={labelCl} {...labelProps}>{label}</label>
            <input type={type} className={inputCl} name={name} id={id} onChange={onChange} value={value} {...inputProps}/>
        </div>
    );
}

export default InputField;