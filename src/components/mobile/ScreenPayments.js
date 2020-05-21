import React from 'react';
import FieldsExtra from '../shared/FieldsExtra';
import CalculateButton from "../shared/CalculateButton";

function generateEmptyPayment() {
    return {
        key: Math.random().toString(36).slice(2),
        period: "0", startDate: "", nextPaymentType: "only_interest", reduceType: "reduce_sum", sum: "0"
    }
}

const ScreenParams = ({dispatch, credit, calculate}) => {
    const onChange = React.useCallback(ev => dispatch({
        type: 'CHANGE_CREDIT',
        payload: {
            name: ev.target.name,
            value: ev.target.type === "checkbox" ? ev.target.checked : ev.target.value
        }
    }), [dispatch]);

    const addPayment = () => {
        const payments = credit.payments.slice();
        payments.push(generateEmptyPayment());
        onChange({target: {name: 'payments', value: payments}});
    };

    const removePayment = (ev) => {
        const id = parseInt(ev.currentTarget.dataset.id, 10);
        const payments = credit.payments.slice();
        payments.splice(id, 1);
        onChange({target: {name: 'payments', value: payments}});
    };

    const changePayment = (ev) => {
        const [, i, field] = ev.target.name.split('.');
        const payments = credit.payments.slice();
        const index = parseInt(i, 10);
        payments[index] = {...payments[index], [field]: ev.target.value};
        onChange({target: {name: 'payments', value: payments}});
    };

    return (
        <div id="form">
            <FieldsExtra credit={credit} mobile onChange={onChange} addPayment={addPayment} changePayment={changePayment} removePayment={removePayment}/>
            <CalculateButton block onClick={calculate} />
        </div>
    )
};

export default ScreenParams;