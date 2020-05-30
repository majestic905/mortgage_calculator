import React from 'react';

import FieldsParams from "../shared/FieldsParams";
import FieldsPayments from "../shared/FieldsPayments";

import './Form.scss';
import CalculateButton from "../shared/CalculateButton";


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

const Form = ({dispatch, credit, payments, mobile}) => {
    return (
        <form id="form">
            <Accordion name="accordion-details" title="Параметры кредита" defaultChecked={!mobile || payments.length === 0}>
                <FieldsParams credit={credit} dispatch={dispatch} />
            </Accordion>

            <div className="divider"/>

            <Accordion name="accordion-payments" title="Досрочные погашения" defaultChecked={payments.length !== 0}>
                <FieldsPayments payments={payments} dispatch={dispatch} />
            </Accordion>

            <div className="divider"/>

            <div id="calculate-button-wrapper" className="payment">
                <div className="mr-2"/>
                <CalculateButton large primary dispatch={dispatch} />
            </div>
        </form>
    )
};

export default Form