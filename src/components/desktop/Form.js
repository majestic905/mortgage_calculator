import React from 'react';

import Button from "../shared/Button";
import FieldsParams from "../shared/FieldsParams";
import FieldsPayments from "../shared/FieldsPayments";

import './Form.scss';


const Accordion = ({name, title, defaultChecked, children}) => {
    return (
        <div className="accordion">
            <input type="checkbox" id={name} name={name} hidden defaultChecked={defaultChecked}/>
            <label className="accordion-header h4" htmlFor={name}>
                <i className="icon icon-arrow-right mr-1"/> {title}
            </label>
            <div className="accordion-body">
                {children}
            </div>
        </div>
    )
};

const Form = ({dispatch, credit, mobile, calculate}) => {
    const onChange = React.useCallback(ev => dispatch({
        type: 'CHANGE_CREDIT',
        payload: {
            name: ev.target.name,
            value: ev.target.type === "checkbox" ? ev.target.checked : ev.target.value
        }
    }), [dispatch]);

    return (
        <form id="form">
            <Accordion name="accordion-details" title="Параметры кредита" defaultChecked={!mobile || credit.payments.length === 0}>
                <FieldsParams credit={credit} onChange={onChange} />
            </Accordion>

            <div className="divider"/>

            <Accordion name="accordion-payments" title="Досрочные погашения" defaultChecked={credit.payments.length !== 0}>
                <FieldsPayments payments={credit.payments} onChange={onChange}/>
            </Accordion>

            <div className="divider"/>

            <div id="calculate-button-wrapper" className="payment">
                <div className="mr-2"/>
                <Button large primary onClick={calculate} content="Рассчитать"/>
            </div>
        </form>
    )
};

export default Form