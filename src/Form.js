import React from 'react';
import propTypes from 'prop-types';
import cx from "classnames";

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
        const calculate = mobile ? this.calculateMobile : this.calculateDesktop;

        const {addPayment, removePayment, changePayment, onChange} = this;

        return (
            <form id="form">
                <Accordion name="accordion-details" title="Параметры кредита" defaultChecked={!mobile || credit.payments.length === 0}>
                    <div className="form-horizontal columns">
                        <div className="column col-lg-12 col-xl-6 col-12 mt-2">
                            <CreditSum value={credit.sum} onChange={onChange}/>
                            <MonthsNum value={credit.monthsNum} onChange={onChange}/>
                            <StartDate value={credit.startDate} onChange={onChange}/>
                        </div>

                        <div className="column col-lg-12 col-xl-6 col-12 mt-2">
                            <Percent value={credit.percent} onChange={onChange}/>
                            <PaymentType value={credit.paymentType} onChange={onChange} renderTooltips={!mobile}/>
                            <PaymentDay value={credit.paymentDay} onChange={onChange}/>
                        </div>
                    </div>
                </Accordion>

                <div className="divider"/>

                <Accordion name="accordion-payments" title="Досрочные погашения" defaultChecked={credit.payments.length !== 0}>
                    {credit.payments.map((payment, i) =>
                        <div key={payment.key} className="payment d-flex">
                            <div className="mr-2">
                                {i+1}.
                            </div>
                            <div className="columns col-gapless">
                                <ExtraPayment.Period index={i} value={payment.period} onChange={changePayment}/>
                                <ExtraPayment.StartDate index={i} value={payment.startDate} onChange={changePayment}/>
                                <ExtraPayment.Sum index={i} value={payment.sum} onChange={changePayment}/>
                                <ExtraPayment.ReduceType index={i} value={payment.reduceType} onChange={changePayment}/>
                                <ExtraPayment.NextPaymentType index={i} value={payment.nextPaymentType} onChange={changePayment} removePayment={removePayment}/>
                            </div>
                            <div className="ml-2">
                                <RemovePaymentButton mobile={mobile} onClick={removePayment} paymentIndex={i}/>
                            </div>
                        </div>
                    )}
                    <div className="px-1 py-1">
                        <button type="button" className="btn btn-block" onClick={addPayment}><i className="icon icon-plus"/> Добавить досрочный платеж</button>
                    </div>
                </Accordion>

                <div className="divider"/>

                <div className="py-1">
                    <button type="button" className="btn btn-block btn-primary" onClick={calculate}>Рассчитать</button>
                </div>
            </form>
        )
    }
}

const Accordion = ({name, title, defaultChecked, children}) => {
    return (
        <div className="accordion mb-2">
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

const CreditSum = ({value, onChange}) => {
    return (
        <div className="form-group">
            <div className="col-4 col-sm-12">
                <label className="form-label" htmlFor="sum">Сумма кредита (руб.)</label>
            </div>
            <div className="col-8 col-sm-12 d-flex">
                <input required type="number" min="0" step="1" name="sum" id="sum" className="form-input" value={value} onChange={onChange}/>
                <span className="ml-2 text-nowrap">рублей</span>
            </div>
        </div>
    )
};

const MonthsNum = ({value, onChange}) => {
    return (
        <div className="form-group">
            <div className="col-4 col-sm-12">
                <label className="form-label" htmlFor="monthsNum">Срок кредита</label>
            </div>
            <div className="col-8 col-sm-12 d-flex">
                <input required type="number" min="0" step="1" name="monthsNum" id="monthsNum" className="form-input" value={value} onChange={onChange}/>
                <span className="ml-2 text-nowrap">месяцев</span>
            </div>
        </div>
    )
};

const StartDate = ({value, onChange}) => {
    return (
        <div className="form-group">
            <div className="col-4 col-sm-12">
                <label className="form-label" htmlFor="startDate">Дата выдачи кредита</label>
            </div>
            <div className="col-8 col-sm-12">
                <input required type="date" id="startDate" name="startDate" className="form-input" value={value} onChange={onChange}/>
            </div>
        </div>
    )
};

const Percent = ({value, onChange}) => {
    return (
        <div className="form-group">
            <div className="col-4 col-sm-12">
                <label className="form-label" htmlFor="percent">Процентная ставка</label>
            </div>
            <div className="col-8 col-sm-12 d-flex">
                <input required type="number" min="0" step="0.1" name="percent" id="percent" className="form-input" value={value} onChange={onChange}/>
                <span className="ml-2 text-nowrap">% годовых</span>
            </div>
        </div>
    )
};

const PaymentType = ({value, onChange, renderTooltips}) => {
    const cls = cx("form-radio form-inline", {tooltip: renderTooltips});

    return (
        <div className="form-group">
            <div className="col-4 col-sm-12">
                <label className="form-label" htmlFor="paymentType">Вид платежа</label>
            </div>
            <div className="col-8 col-sm-12">
                <label className={cls} data-tooltip="Аннуитетный платеж – вариант ежемесячного платежа по кредиту, когда размер ежемесячного платежа остаётся постоянным на всём периоде кредитования.">
                    <input type="radio" name="paymentType" value="annuity" checked={value === "annuity"} onChange={onChange}/><i className="form-icon"/> Аннуитетный
                </label>
                <label className={cls} data-tooltip="Дифференцированный платеж – вариант ежемесячного платежа по кредиту, когда размер ежемесячного платежа по погашению кредита постепенно уменьшается к концу периода кредитования.">
                    <input type="radio" name="paymentType" value="differentiated" checked={value === "differentiated"} onChange={onChange}/><i className="form-icon"/> Дифференцированный
                </label>
            </div>
        </div>
    )
};

const PaymentDay = ({value, onChange}) => {
    return (
        <div className="form-group">
            <div className="col-4 col-sm-12">
                <label className="form-label" htmlFor="paymentDay">Ежемесячные платежи</label>
            </div>
            <div className="col-8 col-sm-12">
                <select name="paymentDay" className="form-select" value={value} onChange={onChange}>
                    <option value="issue_day">в день выдачи кредита</option>
                    <option value="last_day_of_month">в последний день месяца</option>
                    {Array.from({length: 28}, (_, i) =>
                        <option key={i+1} value={i+1}>{i+1}-е число каждого месяца</option>
                    )}
                </select>
            </div>
        </div>
    )
};

const RemovePaymentButton = ({mobile, paymentIndex, onClick}) => {
    if (mobile)
        return (
            <button type="button" className="btn btn-sm" onClick={onClick} data-id={paymentIndex}>
                <i className="icon icon-cross"/> Удалить
            </button>
        );

    return (
        <button type="button" className="btn btn-action" onClick={onClick} data-id={paymentIndex}>
            <i className="icon icon-cross"/>
        </button>
    )
};

const ExtraPayment = {
    Period: ({index, value, onChange}) => {
        return (
            <div className="column col-sm-12 col-lg-4 col-xl-2 col-4">
                <select name={`payment.${index}.period`} className="form-select" value={value} onChange={onChange}>
                    <option value="0">Разовый</option>
                    <option value="1">Раз в месяц</option>
                    <option value="2">Раз в 2 месяца</option>
                    <option value="3">Раз в 3 месяца</option>
                    <option value="6">Раз в полгода</option>
                    <option value="12">Раз в год</option>
                </select>
            </div>
        )
    },
    StartDate: ({index, value, onChange}) => {
        return (
            <div className="column col-sm-6 col-lg-4 col-xl-2 col-4">
                <input required type="date" name={`payment.${index}.startDate`} className="form-input" value={value} onChange={onChange}/>
            </div>
        )
    },
    Sum: ({index, value, onChange}) => {
        return (
            <div className="column col-sm-6 col-lg-4 col-xl-2 col-4">
                <input required type="number" min="0" step="1" name={`payment.${index}.sum`} className="form-input" placeholder="Сумма" value={value} onChange={onChange}/>
            </div>
        )
    },
    ReduceType: ({index, value, onChange}) => {
        return (
            <div className="column col-md-12 col-lg-6 col-xl-3 col-6">
                <select name={`payment.${index}.reduceType`} className="form-select" value={value} onChange={onChange}>
                    <option value="reduce_period">Уменьшить срок кредита</option>
                    <option value="reduce_sum">Уменьшить ежемесячный платеж</option>
                </select>
            </div>
        )
    },
    NextPaymentType: ({index, value, onChange}) => {
        return (
            <div className="column col-md-12 col-lg-6 col-xl-3 col-6 d-flex">
                <select name={`payment.${index}.nextPaymentType`} className="form-select" value={value} onChange={onChange}>
                    <option value="no_changes">Следующий платеж - без изменений</option>
                    <option value="only_interest">Следующий платеж - только проценты</option>
                </select>
            </div>
        )
    }
};