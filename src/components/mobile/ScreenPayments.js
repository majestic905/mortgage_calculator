import React from 'react';
import FieldsPayments from '../shared/FieldsPayments';
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
            <FieldsPayments payments={credit.payments} mobile onChange={onChange}/>
            <Button block primary onClick={calculate} content="Рассчитать" />
        </div>
    )
};

export default ScreenParams;