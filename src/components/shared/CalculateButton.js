import React, {useCallback} from "react";
import Button from "./Button";

const CalculateButton = ({dispatch, ...rest}) => {
    const calculate = useCallback(() => dispatch({type: 'CALCULATE'}), []);
    return <Button onClick={calculate} content="Рассчитать" {...rest}/>;
}

export default CalculateButton;