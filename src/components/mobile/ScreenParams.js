import React from 'react';
import FieldsParams from '../shared/FieldsParams';
import CalculateButton from "../shared/CalculateButton";

const ScreenParams = ({dispatch, credit, calculate}) => {
    const onChange = React.useCallback(ev => dispatch({
        type: 'CHANGE_CREDIT',
        payload: {
            name: ev.target.name,
            value: ev.target.type === "checkbox" ? ev.target.checked : ev.target.value
        }
    }), [dispatch]);

    return (
        <div id="form">
            <FieldsParams credit={credit} onChange={onChange} />
            <CalculateButton block onClick={calculate} />
        </div>
    )
};

export default ScreenParams;