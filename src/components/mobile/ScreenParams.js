import React from 'react';
import FieldsParams from '../shared/FieldsParams';
import Button from "../shared/Button";

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
            <Button block primary onClick={calculate} content="Рассчитать" />
        </div>
    )
};

export default ScreenParams;