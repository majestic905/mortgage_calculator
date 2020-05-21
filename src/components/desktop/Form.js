import React from 'react';
import CalculateButton from "../shared/CalculateButton";
import FieldsMain from "../shared/FieldsMain";
import FieldsExtra from "../shared/FieldsExtra";
import propTypes from 'prop-types';
import cx from "classnames";

function generateEmptyPayment() {
    return {
        key: Math.random().toString(36).slice(2),
        period: "0", startDate: "", nextPaymentType: "only_interest", reduceType: "reduce_sum", sum: "0"
    }
}

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

export default class Form extends React.Component {
    static propTypes = {
        dispatch: propTypes.func,
        credit: propTypes.object,
        mobile: propTypes.bool,
        calculate: propTypes.func,
    };

    onChange = (ev) => this.props.dispatch({
        type: 'CHANGE_CREDIT',
        payload: {
            name: ev.target.name,
            value: ev.target.type === "checkbox" ? ev.target.checked : ev.target.value
        }
    });

    addPayment = () => {
        const payments = this.props.credit.payments.slice();
        payments.push(generateEmptyPayment());
        this.onChange({target: {name: 'payments', value: payments}});
    };

    removePayment = (ev) => {
        const id = parseInt(ev.currentTarget.dataset.id, 10);
        const payments = this.props.credit.payments.slice();
        payments.splice(id, 1);
        this.onChange({target: {name: 'payments', value: payments}});
    };

    changePayment = (ev) => {
        const [, i, field] = ev.target.name.split('.');
        const payments = this.props.credit.payments.slice();
        const index = parseInt(i, 10);
        payments[index] = {...payments[index], [field]: ev.target.value};
        this.onChange({target: {name: 'payments', value: payments}});
    };

    render() {
        const {credit, mobile, calculate} = this.props;
        const {addPayment, removePayment, changePayment, onChange} = this;

        return (
            <form id="form">
                <Accordion name="accordion-details" title="Параметры кредита" defaultChecked={!mobile || credit.payments.length === 0}>
                    <FieldsMain credit={credit} onChange={onChange} />
                </Accordion>

                <div className="divider"/>

                <Accordion name="accordion-payments" title="Досрочные погашения" defaultChecked={credit.payments.length !== 0}>
                    <FieldsExtra credit={credit} onChange={onChange} addPayment={addPayment} removePayment={removePayment} changePayment={changePayment}/>
                </Accordion>

                <div className="divider"/>

                <div id="calculate-button-wrapper" className="payment">
                    <div className="mr-2"/>
                    <CalculateButton large onClick={calculate}/>
                </div>
            </form>
        )
    }
}