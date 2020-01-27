import React from 'react';
import propTypes from 'prop-types';
import MobileForm from "./MobileForm";
import DesktopForm from "./DesktopForm";

function generateEmptyPayment() {
    return {
        key: Math.random().toString(36).slice(2),
        period: "0", startDate: "", nextPaymentType: "only_interest", reduceType: "reduce_sum", sum: "0"
    }
}

export default class Form extends React.Component {
    static propTypes = {
        dispatch: propTypes.func,
        credit: propTypes.object,
        navigateTo: propTypes.func,
        mobile: propTypes.bool,
    };

    calculateDesktop = () => this.props.dispatch({type: 'CALCULATE'});
    calculateMobile = () => this.props.navigateTo("table");

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
        const {credit, mobile} = this.props;
        const Component = mobile ? MobileForm : DesktopForm;
        const calculate = mobile ? this.calculateMobile : this.calculateDesktop;
        return <Component credit={credit} calculate={calculate} addPayment={this.addPayment} removePayment={this.removePayment} changePayment={this.changePayment} onChange={this.onChange}/>;
    }
}